import * as WebgpuUtils from "webgpu-utils";
import type {ShaderDataDefinitions} from "webgpu-utils";
import {RGBColor} from "../../Cores/Color";

export class OrderedDitherWebgpu {
    adapter: GPUAdapter | null = null;
    device: GPUDevice | null = null;
    shaderCode: string = "Shaders/OrderedDitherShader.wgsl?row";

    image: ImageData | null = null;
    usableColorList: Array<[number, number, number]> = [];

    thresholdMap: number[] = [];
    thresholdMapSize: [number, number] = [0, 0];

    async RequestToDither(
        shaderCode: string,
        image: ImageData,
        usableColorList: RGBColor[],
        [thresholdMapWidth, thresholdMapHeight, thresholdMap]: [number, number, number[][]]
    ): Promise<Array<number> | null> {

        // shader code
        this.shaderCode = shaderCode;

        // image
        this.image = image;

        // usableColorList
        this.usableColorList = [];
        usableColorList.forEach((value: RGBColor) => {
            this.usableColorList.push(RGBColor.Tou32Vec3(value));
        });

        // threshold map
        this.thresholdMap = [];
        thresholdMap.forEach((value: number[]) => {
            value.forEach(value => {
                this.thresholdMap.push(value);
            })
        });
        this.thresholdMapSize = [thresholdMapWidth, thresholdMapHeight];

        await this.SetupGPU();
        return await this.Compile();
    }

    async SetupGPU(): Promise<void> {
        if (!navigator.gpu) {
            return new Promise((resolve, reject) => reject(new Error("There has no GPU")));
        }
        // adapter初期化
        this.adapter = await navigator.gpu.requestAdapter();
        if (!this.adapter) {
            return new Promise((resolve, reject) => reject(new Error("failed to request adapter")));
        }

        this.device = await this.adapter.requestDevice();
        if (!this.device) {
            return new Promise((resolve, reject) => reject(new Error("failed to request device")));
        }
    }

    async Compile(): Promise<Array<number> | null> {
        if (!this.device) {
            return new Promise((resolve, reject) => reject(new Error("failed to get device")));
        }
        if (!this.image) {
            return new Promise((resolve, reject) => reject(new Error("it is not set image")));
        }
        const computePipeline = this.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: this.device.createShaderModule({code: this.shaderCode}),
                entryPoint: "main",
            },
        });
        const defs: ShaderDataDefinitions = WebgpuUtils.makeShaderDataDefinitions(this.shaderCode);

        // buffers
        const [bindGroups, outputBuffer] = await this.SetupStorageBuffer(computePipeline, defs, this.image);
        if (!outputBuffer) {
            return null;
        }

        const computeEncoder = this.device.createCommandEncoder();

        const pass = computeEncoder.beginComputePass();
        pass.setPipeline(computePipeline);
        // バッファに値を設定
        bindGroups.forEach((bindGroup: GPUBindGroup, index) => {
            pass.setBindGroup(index, bindGroup);
        });

        //
        const workgroupCountX: number = Math.ceil(this.image.width / 16);
        const workgroupCountY: number = Math.ceil(this.image.height / 16);
        pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
        pass.end();
        // pass.
        this.device.queue.submit([computeEncoder.finish()]);

        // 戻り値取得
        const readMapView = WebgpuUtils.makeStructuredView(defs.storages.outputArray, new ArrayBuffer(4 * this.image.width * this.image.height));
        const readBuffer = this.device.createBuffer(
            {
                size: readMapView.arrayBuffer.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            }
        )
        const copyEncoder = this.device.createCommandEncoder();
        copyEncoder.copyBufferToBuffer(
            outputBuffer, 0, readBuffer, 0
        );
        this.device.queue.submit([copyEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint32Array(readBuffer.getMappedRange());
        console.log(data);
        return Array.from(data);
    }

    async SetupStorageBuffer(pipeline: GPUComputePipeline,
                             defs: ShaderDataDefinitions,
                             image: ImageData
    ): Promise<[Array<GPUBindGroup>, GPUBuffer | null]> {
        if (!this.device || !this.image) {
            return [[], null];
        }

        // buffer定義

        // 入力画像
        const imageBitmap = await createImageBitmap(image);
        const inputTexture = WebgpuUtils.createTextureFromSource(
            this.device, imageBitmap,
            {
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.RENDER_ATTACHMENT |
                    GPUTextureUsage.COPY_DST,
                mips: false
            });

        // input画像サイズ
        const imageSizeView = WebgpuUtils.makeStructuredView(defs.uniforms.imageSize);
        const imageSizeBuffer = this.device.createBuffer({
            size: imageSizeView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        imageSizeView.set({
            width: this.image.width,
            height: this.image.height,
        });
        this.device.queue.writeBuffer(imageSizeBuffer, 0, imageSizeView.arrayBuffer);

        // 出力配列
        const outputArrayView = WebgpuUtils.makeStructuredView(defs.storages.outputArray, new ArrayBuffer(4 * this.image.width * this.image.height));
        const outputBuffer = this.device.createBuffer({
            size: outputArrayView.arrayBuffer.byteLength, // u32 * image size
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });
        this.device.queue.writeBuffer(outputBuffer, 0, outputArrayView.arrayBuffer);

        // 色一覧
        const usableColorListView
            = WebgpuUtils.makeStructuredView(defs.storages.usableColorList, new ArrayBuffer(4 * 4 * this.usableColorList.length));// f32 * 4 * array
        const usableColorListBuffer = this.device.createBuffer({
            size: usableColorListView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        usableColorListView.set(this.usableColorList);
        this.device.queue.writeBuffer(usableColorListBuffer, 0, usableColorListView.arrayBuffer);
        // 色一覧のサイズ
        const usableColorListNumView = WebgpuUtils.makeStructuredView(defs.uniforms.usableColorListNum);
        const usableColorListNumBuffer = this.device.createBuffer({
            size: usableColorListNumView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        usableColorListNumView.set(this.usableColorList.length);
        this.device.queue.writeBuffer(usableColorListNumBuffer, 0, usableColorListNumView.arrayBuffer);

        // 閾値マップ
        const thresholdMapView = WebgpuUtils.makeStructuredView(defs.storages.thresholdMap, new ArrayBuffer(4 * this.thresholdMapSize[0] * this.thresholdMapSize[1]));
        const thresholdMapBuffer = this.device.createBuffer({
            size: thresholdMapView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        thresholdMapView.set(this.thresholdMap);
        this.device.queue.writeBuffer(thresholdMapBuffer, 0, thresholdMapView.arrayBuffer);

        const thresholdMapSizeView = WebgpuUtils.makeStructuredView(defs.uniforms.thresholdMapSize);
        const thresholdMapSizeBuffer = this.device.createBuffer({
            size: thresholdMapSizeView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        thresholdMapSizeView.set({
            width: this.thresholdMapSize[0],    // width
            height: this.thresholdMapSize[1],   // height
        });
        this.device.queue.writeBuffer(thresholdMapSizeBuffer, 0, thresholdMapSizeView.arrayBuffer);

        const bindGroupArray: Array<GPUBindGroup> = [];
        // 入力画像系
        const bindGroup0 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: inputTexture.createView(),},
                {binding: 1, resource: {buffer: imageSizeBuffer},},
            ]
        });
        bindGroupArray.push(bindGroup0);

        // 出力画像系
        const bindGroup1: GPUBindGroup = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(1),
            entries: [
                {binding: 0, resource: {buffer: outputBuffer},},
            ]
        });
        bindGroupArray.push(bindGroup1);

        // 色リスト系
        const bindGroup2: GPUBindGroup = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(2),
            entries: [
                {binding: 0, resource: {buffer: usableColorListBuffer},},
                {binding: 1, resource: {buffer: usableColorListNumBuffer},},
            ]
        });
        bindGroupArray.push(bindGroup2);

        // 閾値系
        const bindGroup3: GPUBindGroup = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(3),
            entries: [
                {binding: 0, resource: {buffer: thresholdMapBuffer},},
                {binding: 1, resource: {buffer: thresholdMapSizeBuffer},},
            ]
        });
        bindGroupArray.push(bindGroup3);

        return [bindGroupArray, outputBuffer];
    }
}
