import {DithererBase} from "./DithererBase";
import {OptionData} from "../Datas/Options/OptionData";
import {MCMapData} from "../Datas/MapData/MCMapData";
import {RGBColor} from "../Cores/Color";

export class RawDitherer extends DithererBase {

    override async Convert(optionData: OptionData): Promise<MCMapData> {
        return this.ConvertImgToMCMapData(optionData.baseImage, optionData.magnification);
    }
    ConvertImgToMCMapData(img: ImageData, magnification: number): MCMapData {
        let ReturnData: MCMapData = new MCMapData();

        const imageData = this.GetActualImageData(img, magnification);
        if (!imageData) {
            return ReturnData;
        }

        const data = imageData?.data;
        if (!data) {
            return ReturnData;
        }

        const width = imageData.width;
        const height = imageData.height;

        let map: number[][] = [];

        let colorToMapColor: Map<number, RGBColor> = new Map();
        for (let y = 0; y < height; ++y) {
            let row: number[] = [];
            for (let x = 0; x < width; ++x) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const color = new RGBColor(r, g, b);

                // 色に対応する数字取得, 新規色登録
                const colorId = RGBColor.CreateColorId(color);
                const mapColor = colorToMapColor.get(colorId);
                if (!mapColor) {
                    colorToMapColor.set(colorId, color);
                }
                row.push(colorId);
            }
            map.push(row);
        }

        ReturnData.map = map;
        ReturnData.width = width;
        ReturnData.height = height;
        ReturnData.mapToColorId = colorToMapColor;

        return ReturnData;
    }
}
