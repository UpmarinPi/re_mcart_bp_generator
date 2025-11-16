import * as WebgpuUtils from "webgpu-utils";
import type {ShaderDataDefinitions} from "webgpu-utils";
import type {RGBColor} from "../Cores/Color.ts";

export class ThresholdDitherWebgpu {
    adapter: GPUAdapter | null = null;
    device: GPUDevice | null = null;
    wgslPath: string = "Shaders/OrderedDitherShader.wgsl";

    image: ImageData | null = null;
    usableColorList: RGBColor[] = [];

    thresholdMap: number[][] = [];
    thresholdMapSize: number = 0;

    constructor() {
        this.SetupGPU().then(_r => {

        });
    }
    async RequestToDither(
        image: ImageData,
        usableColorList: RGBColor[],
        [thresholdMapWidth,thresholdMapHeight , thresholdMap]: [number, number, number[][]]
    ): Promise<Array<number>>{
        this.image = image;
        this.thresholdMap = thresholdMap;
        this.thresholdMapSize = thresholdMapWidth * thresholdMapHeight;
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

    async Compile(): Promise<Array<number>> {
        if (!this.device) {
            return new Promise((resolve, reject) => reject(new Error("failed to get device")));
        }
        if(!this.image){
            return new Promise((resolve, reject) => reject(new Error("it is not set image")));
        }
        const shaderCode = await fetch(this.wgslPath).then((res) => res.text());

        const computePipeline = this.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: this.device.createShaderModule({code: shaderCode}),
                entryPoint: "main",
            },
        });
        const defs: ShaderDataDefinitions = WebgpuUtils.makeShaderDataDefinitions(shaderCode);

        // buffers
        const [bindGroups, outputBuffer] = await this.SetupStorageBuffer(computePipeline, defs, this.image);
        if(!outputBuffer) {
            return [];
        }

        const computeEncoder = this.device.createCommandEncoder();

        const pass = computeEncoder.beginComputePass();
        pass.setPipeline(computePipeline);
        // バッファに値を設定
        bindGroups.forEach((bindGroup: GPUBindGroup, index) => {
            pass.setBindGroup(index, bindGroup);
        });
        pass.dispatchWorkgroups(8, 8, 1);
        pass.end();
        // pass.
        this.device.queue.submit([computeEncoder.finish()]);

        // 戻り値取得
        const readBuffer = this.device.createBuffer(
            {
                size: 4 * this.image.width * this.image.height,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            }
        )
        const copyEncoder = this.device.createCommandEncoder();
        copyEncoder.copyBufferToBuffer(
            outputBuffer,0,readBuffer, 0
        );
        this.device.queue.submit([copyEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const data = new Uint32Array(readBuffer.getMappedRange());

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
        const inputTexture = WebgpuUtils.createTextureFromSource(this.device, image.data);

        // サンプラー
        const inputSampler = this.device.createSampler();

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
        const outputArrayView = WebgpuUtils.makeStructuredView(defs.storages.outputArray);
        const outputBuffer = this.device.createBuffer({
            size: 4 * this.image.width * this.image.height, // u32 * image size
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        this.device.queue.writeBuffer(outputBuffer, 0, outputArrayView.arrayBuffer);

        // 色一覧
        const usableColorListView = WebgpuUtils.makeStructuredView(defs.storages.usableColorList);
        const usableColorListBuffer = this.device.createBuffer({
            size: 4 * this.usableColorList.length,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        // todo 色一覧の登録
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
        const thresholdMapView = WebgpuUtils.makeStructuredView(defs.storages.thresholdMap);
        const thresholdMapBuffer = this.device.createBuffer({
            size: 4 * this.thresholdMapSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        thresholdMapView.set(this.thresholdMap);
        this.device.queue.writeBuffer(thresholdMapBuffer, 0, thresholdMapView.arrayBuffer);

        const thresholdMapSizeView = WebgpuUtils.makeStructuredView(defs.uniforms.thresholdMapSize);
        const thresholdMapSizeBuffer = this.device.createBuffer({
            size: thresholdMapSizeView.arrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
        thresholdMapSizeView.set(this.thresholdMapSize);
        this.device.queue.writeBuffer(thresholdMapSizeBuffer, 0, thresholdMapSizeView.arrayBuffer);

        const bindGroupArray: Array<GPUBindGroup> = [];
        // 入力画像系
        const bindGroup0 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: inputTexture.createView(),},
                {binding: 1, resource: inputSampler,},
                {binding: 2, resource: {buffer: imageSizeBuffer},},
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
