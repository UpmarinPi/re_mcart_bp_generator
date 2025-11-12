import * as Comlink from 'comlink';
import {OptionData} from "../Datas/Options/OptionData";
import {MCMapData} from "../Datas/MapData/MCMapData";
import {RGBColor} from "../Cores/Color";

const endpoint: Comlink.Endpoint =
    typeof window === "undefined"
        ? (self as DedicatedWorkerGlobalScope)
        : (window as unknown as Comlink.Endpoint);

export class ThresholdDithererWorker {
    // [currentDoneProcess, MaxProcess]

    async Convert(optionData: OptionData,
                  imageWidth: number, imageHeight: number,
                  data: Uint8ClampedArray,
                  getNearestColorFunc: ([x, y]: [number, number], baseColor: RGBColor, colorList: RGBColor[]) => Promise<number>,
                  onProcessUpdated: (currentProcess: number, maxProcess: number) => void)
        : Promise<MCMapData> {
        return await this.ConvertWithoutGPU(optionData, imageWidth, imageHeight, data, getNearestColorFunc, onProcessUpdated);
    }
    async ConvertWithoutGPU(optionData: OptionData,
                  imageWidth: number, imageHeight: number,
                  data: Uint8ClampedArray,
                  getNearestColorFunc: ([x, y]: [number, number], baseColor: RGBColor, colorList: RGBColor[]) => Promise<number>,
                  onProcessUpdated: (currentProcess: number, maxProcess: number) => void)
        : Promise<MCMapData> {
        // const start: number = performance.now();
        console.log("start converting!");
        const returnData: MCMapData = new MCMapData();

        const maxProgress = imageWidth * imageHeight;

        const map: number[][] = [];
        const colorToMapColor: Map<number, RGBColor> = new Map();
        for (let y = 0; y < imageHeight; ++y) {
            const row: number[] = [];
            for (let x = 0; x < imageWidth; ++x) {
                const index = (y * imageWidth + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const colorKey: number = await getNearestColorFunc([x, y], new RGBColor(r, g, b), optionData.usingColors);
                let color = new RGBColor();
                if (optionData.usingColors && colorKey < optionData.usingColors.length) {
                    color = optionData.usingColors[colorKey];
                }

                // 色に対応する数字取得, 新規色登録
                const colorId = RGBColor.CreateColorId(color);
                const mapColor = colorToMapColor.get(colorId);
                if (!mapColor) {
                    colorToMapColor.set(colorId, color);
                }
                row.push(colorId);

                const currentProgress = y * imageWidth + x;
                onProcessUpdated(currentProgress, maxProgress);
            }
            map.push(row);
        }

        returnData.map = map;
        returnData.width = imageWidth;
        returnData.height = imageHeight;
        returnData.mapToColor = colorToMapColor;

        console.log("Completed!");
        // const end: number = performance.now();
        // const elapsedTime = (2 - 1).toFixed(2) / 1000;
        // console.log("elapsed time: ", (elapsedTime), "s");
        return returnData;
    }
}

Comlink.expose(ThresholdDithererWorker, endpoint);
