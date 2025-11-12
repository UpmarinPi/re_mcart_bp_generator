import {DithererBase} from "./DithererBase";
import {MCMapData} from "../Datas/MapData/MCMapData";
import {OptionData} from "../Datas/Options/OptionData";
import {RGBColor} from "../Cores/Color";
import * as Comlink from "comlink";
import type {ThresholdDithererWorker} from "./ThresholdDithererWorker";

export class ThresholdDitherer extends DithererBase {
    constructor() {
        super();
    }

    override async Convert(optionData: OptionData): Promise<MCMapData> {
        const img = optionData.baseImage;
        const magnification = optionData.magnification;

        const imageData = this.GetActualImageData(img, magnification);
        if (!imageData) {
            return new MCMapData();
        }

        const data = imageData.data;
        if (!data) {
            return new MCMapData();
        }
        const width = imageData.width;
        const height = imageData.height;

        return await this.ConvertWithWebWorker(optionData, width, height, data);
    }

    async ConvertWithWebWorker(optionData: OptionData, width: number, height: number, data: Uint8ClampedArray<ArrayBufferLike>): Promise<MCMapData> {
        const ThresholdDithererWorkerClass
            = Comlink.wrap<typeof ThresholdDithererWorker>(new Worker(new URL("./ThresholdDithererWorker.ts", import.meta.url), {type: "module",}));

        const ThresholdDithererWorkerInstance = await new ThresholdDithererWorkerClass();

        return await ThresholdDithererWorkerInstance.Convert(optionData, width, height, data,
            Comlink.proxy(this.GetNearestColorId.bind(this)),
            Comlink.proxy(this.SetCurrentProgress.bind(this)));
    }

    async GetNearestColorId(_cords: [number, number], baseColor: RGBColor, colorList: RGBColor[]): Promise<number> {
        let nearsetColorNum: number = 0;
        let shortestDistance: number = -1;
        for (let i = 0; i < colorList.length; i++) {
            const color = colorList[i];
            const distance = (baseColor.r - color.r) * (baseColor.r - color.r)
                + (baseColor.g - color.g) * (baseColor.g - color.g)
                + (baseColor.b - color.b) * (baseColor.b - color.b);

            if (shortestDistance === -1 || distance < shortestDistance) {
                shortestDistance = distance;
                nearsetColorNum = i;
            }
        }

        return nearsetColorNum;
    }
}
