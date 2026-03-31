import { ConvertModes } from "../../Cores/Types";
import { RGBColor } from "../../Cores/Color";

export class OptionData {
    // 元画像
    baseImage: ImageData = new ImageData(1, 1);

    // 拡大率
    magnification: number = 1.0;

    // 変換モード
    convertMode: string = ConvertModes.RawDither;

    // 明暗モード
    bIsDimensionalMode: boolean = false;

    // 単純ディザリングの中間生成
    bGeneratesSimpleDitherIntermediate: boolean = false;

    // 単純ディザリングの色分割数
    simpleDitherColorCutPow: number = 3;

    // 使用する色群
    usingColors: RGBColor[] = [];

    // 使用するブロック群
    usingBlocks: string[] = [];

    // その他パラメータ
    params: any = 1;

}
