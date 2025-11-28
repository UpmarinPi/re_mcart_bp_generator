import {EDimensionalMode} from "../../Cores/Types";
import {RGBColor} from "../../Cores/Color";

export class MCMapData {
    // 次元モード
    dimensionalMode: EDimensionalMode = EDimensionalMode.Flat;

    // 地図幅
    width: number = 0;
    // 地図高さ
    height: number = 0;
    // 地図全体の情報
    // それぞれのピクセルをid(number)で管理
    map: number[][] = [];

    // dimensionalMode == Shape 時にのみ使用。高さ情報をnumberで管理
    dimensionalMap: number[][] = [];

    // id to color
    mapToColorId: Map<number, RGBColor> = new Map();

    // id to block
    mapToBlockId: Map<number, string> = new Map();
}
