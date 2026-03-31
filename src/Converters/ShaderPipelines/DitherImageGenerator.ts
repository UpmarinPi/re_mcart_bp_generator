import type { DithererBase } from "../DithererBase";
import { OptionData } from "../../Datas/Options/OptionData";
import { MCMapDataToImage } from "./MCMapDataToImage";
import type { RGBColor } from "../../Cores/Color";

export class DitherImageGenerator<T extends DithererBase> {
    ditherer: T;

    constructor(ditherer: T) {
        this.ditherer = ditherer;
    }

    async Convert(baseImage: ImageData, colorList: RGBColor[]): Promise<ImageData> {
        const optionData = new OptionData();
        optionData.baseImage = baseImage;
        optionData.usingColors = colorList;
        const mcMapData = await this.ditherer.Convert(optionData);
        return await MCMapDataToImage.Convert(mcMapData);
    }
}