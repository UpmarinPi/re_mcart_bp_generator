import { ConvertModes } from "../../Cores/Types";
import { RGBColor } from "../../Cores/Color";

enum EOptionDataInvalidReasons {
    Image = "Invalid image",
    Magnification = "Invalid magnification",
    ConvertMode = "Invalid convert mode",
    SimpleDitherColorCutPow = "Invalid simple dither color cut power",
    UsingColors = "Invalid using colors",
    ColorsToBlocks = "Invalid colors to blocks"
}

export class OptionData {
    // 元画像
    baseImage: ImageData = new ImageData(1, 1);

    // 拡大率
    magnification: number = 1.0;

    // 変換モード
    convertMode: string = ConvertModes.SimpleDither;

    // 明暗モード
    bIsDimensionalMode: boolean = false;

    // 単純ディザリングの中間生成
    bGeneratesSimpleDitherIntermediate: boolean = false;

    // 単純ディザリングの色分割数
    simpleDitherColorCutPow: number = 3;

    // 使用する色群
    usingColors: RGBColor[] = [];

    // 使用するブロック群
    colorsToBlocks: Map<RGBColor, string> = new Map();

    // その他パラメータ
    params: any = 1;

    // [bIsValid, InvalidReason]
    public GetIsValidData(): [boolean, EOptionDataInvalidReasons | undefined] {
        if (this.baseImage == null || this.baseImage.width <= 0 || this.baseImage.height <= 0) {
            return [false, EOptionDataInvalidReasons.Image];
        }
        if (this.magnification <= 0) {
            return [false, EOptionDataInvalidReasons.Magnification];
        }
        if (this.convertMode === "") {
            return [false, EOptionDataInvalidReasons.ConvertMode];
        }
        if (this.simpleDitherColorCutPow <= 0) {
            return [false, EOptionDataInvalidReasons.SimpleDitherColorCutPow];
        }
        if (this.usingColors.length === 0) {
            return [false, EOptionDataInvalidReasons.UsingColors];
        }
        if (this.colorsToBlocks.size === 0) {
            return [false, EOptionDataInvalidReasons.ColorsToBlocks];
        }
        return [true, undefined];
    }

}
