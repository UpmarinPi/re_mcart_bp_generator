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
}