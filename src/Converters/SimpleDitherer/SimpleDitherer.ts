import { ThresholdDitherer } from "../ThresholdDitherer";
import { RGBColor } from "../../Cores/Color";
import { addScaled, dot, DistSq, norm2, rgbToLab, sub } from "../../FunctionLibraries/ColorFunctionLibrary.ts";
import { MCMapData } from "../../Datas/MapData/MCMapData.ts";
import { OptionData } from "../../Datas/Options/OptionData.ts";
import { SimpleDitherWebgpu } from "./SimpleDitherWebgpu.ts";
import { BoolToEDimensionalMode } from "../../Cores/Types.ts";
import shaderCode from './Shaders/SimpleDitherShader.wgsl?raw';

export class SimpleDitherer extends ThresholdDitherer {

    ditherWebgpu: SimpleDitherWebgpu;

    constructor() {
        super();
        this.ditherWebgpu = new SimpleDitherWebgpu();
    }

    override async Convert(optionData: OptionData): Promise<MCMapData> {
        console.log("start simple dither")
        const MapData = await this.ConvertWithWebgpu(optionData);
        if (MapData) {
            return MapData;
        }
        console.warn("it cannot convert with webgpu.\n" +
            "We would make with webworker.");

        return super.Convert(optionData);
    }

    async ConvertWithWebgpu(optionData: OptionData): Promise<MCMapData | null> {
        const img = optionData.baseImage;
        const magnification = optionData.magnification;

        const imageData = this.GetActualImageData(img, magnification);
        if (!imageData) {
            return null;
        }

        const width = imageData.width;
        const height = imageData.height;

        const returnArray = await this.ditherWebgpu.RequestToDither(shaderCode, imageData, optionData.usingColors);
        if (!returnArray || returnArray.length < width * height) {
            return null;
        }
        const returnData = new MCMapData();
        returnData.dimensionalMode = BoolToEDimensionalMode(optionData.bIsDimensionalMode);

        // width / height
        returnData.width = width;
        returnData.height = height;

        // map
        for (let y: number = 0; y < height; ++y) {
            const mapItem: number[] = [];
            for (let x: number = 0; x < width; ++x) {
                const index = returnArray[y * width + x];
                mapItem.push(index);
            }
            returnData.map.push(mapItem);
        }

        // map to color
        for (let i = 0; i < optionData.usingColors.length; ++i) {
            returnData.mapToColorId.set(i, optionData.usingColors[i]);
        }

        return returnData;
    }
}
