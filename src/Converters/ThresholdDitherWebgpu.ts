export class ThresholdDitherWebgpu {
    adapter: GPUAdapter | null = null;
    device: GPUDevice | null = null;
    wgslPath: string = "";

    constructor() {
        this.SetupGPU().then(_r => {

        });
    }

    async SetupGPU(): Promise<void> {
        if (!navigator.gpu) {
            return new Promise((resolve, reject) => reject(new Error("There has no GPU")));
        }
        // adapter初期化
        this.adapter = await navigator.gpu.requestAdapter();
        if(!this.adapter) {
            return new Promise((resolve, reject) => reject(new Error("failed to request adapter")));
        }

        this.device = await this.adapter.requestDevice();
        if(!this.device) {
            return new Promise((resolve, reject) => reject(new Error("failed to request device")));
        }
    }

    async Compile(){
        if(!this.device) {
            return new Promise((resolve, reject) => reject(new Error("failed to get device")));
        }
        const shaderCode = await fetch(this.wgslPath).then((res) => res.text());

        const computePipeline = this.device.createComputePipeline({
            layout: "auto",
            compute: {
                module: this.device.createShaderModule({code: shaderCode}),
                entryPoint: "main",
            },
        });

        const storageData = new Uint32Array(8);
        const storageBuffer = this.device.createBuffer({
            size: storageData.byteLength,
            usage:
                GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        this.device.queue.writeBuffer(storageBuffer, 0, storageData);

        const readbackBuffer = this.device.createBuffer({
            size: storageData.byteLength,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });


        const bindGroupLayout = computePipeline.getBindGroupLayout(0);

        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: storageBuffer },
                },
            ],
        });
        const commandEncoder = this.device.createCommandEncoder();

        const passEncoder = commandEncoder.beginComputePass();

        passEncoder.setPipeline(computePipeline);
        // passEncoder.
    }
    async SetupStorageBuffer(pipeline: GPUComputePipeline){
        if(!this.device) {
            return;
        }

        // buffer定義
        const inputTextureBuffer = this.device.createBuffer({
            size: 1, // todo
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const inputSamplerBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const imageSizeBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const outputTextureBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
        const usableColorListBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const usableColorListNumBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const thresholdMapBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        const thresholdMapSizeBuffer = this.device.createBuffer({
            size: 1,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        })

        // 入力画像
        const bindGroup0 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: inputTextureBuffer },},
                { binding: 1, resource: { buffer: inputSamplerBuffer },},
                { binding: 2, resource: { buffer: imageSizeBuffer },},
            ]
        });

        // 出力画像
        const bindGroup1 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(1),
            entries: [
                { binding: 0, resource: { buffer: outputTextureBuffer },},
            ]
        });

        // 色リスト
        const bindGroup2 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(2),
            entries: [
                { binding: 0, resource: { buffer: usableColorListBuffer },},
                { binding: 1, resource: { buffer: usableColorListNumBuffer },},
            ]
        });

        // 閾値系
        const bindGroup3 = this.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(3),
            entries: [
                { binding: 0, resource: { buffer: thresholdMapBuffer },},
                { binding: 1, resource: { buffer: thresholdMapSizeBuffer },},
            ]
        });
//         // GPUで使用するバッファーを作る
//         const storageBuffer = this.device.createBuffer({
//             size: storageData.byteLength,
//             usage:
//                 GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
//         });
// // 非同期に値を転送
//         this.device.queue.writeBuffer(storageBuffer, 0, storageData);
    }
}
