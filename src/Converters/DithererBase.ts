import {MCMapData} from "../Datas/MapData/MCMapData";
import {OptionData} from "../Datas/Options/OptionData";
import {ObserverSubject} from "../Cores/Observer";
import {wrap} from 'comlink';

export abstract class DithererBase {

    private offCanvas: HTMLCanvasElement = document.createElement('canvas');

    protected get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    protected GetActualImageData(img: ImageData, magnification: number = 1): ImageData | null {
        if (!img) {
            return null;
        }
        const actualWidth = img.width * magnification;
        const actualHeight = img.height * magnification;

        const ctx = this.canvas.getContext("2d");
        const offCtx = this.offCanvas.getContext("2d");
        if (!ctx || !offCtx) {
            return null;
        }
        offCtx.canvas.width = img.width;
        offCtx.canvas.height = img.height;
        offCtx.putImageData(img, 0, 0);

        ctx.canvas.width = actualWidth;
        ctx.canvas.height = actualHeight;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.imageSmoothingEnabled = false; // smoothingを切る

        ctx.drawImage(this.offCanvas,
            0, 0, img.width, img.height, // 元画像領域
            0, 0, actualWidth, actualHeight); // 拡大率適用

        return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    private readonly _canvas: HTMLCanvasElement;

    async Convert(optionData: OptionData): Promise<MCMapData> {
        return new MCMapData();
    }

    constructor() {
        this.onProgressChange = new ObserverSubject();
        this._canvas = document.createElement('canvas');
    }

    //
    protected SetCurrentProgress(currentProgress: number, maxProgress: number) {
        this.onProgressChange.notify([currentProgress, maxProgress]);
    }

    onProgressChange: ObserverSubject<[number, number]>;

}
