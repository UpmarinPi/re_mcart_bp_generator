import {ThresholdDitherer} from "../ThresholdDitherer";
import {RGBColor} from "../../Cores/Color";
import {addScaled, dot, DistSq, norm2, rgbToLab, sub} from "../../FunctionLibraries/ColorFunctionLibrary";
import {MCMapData} from "../../Datas/MapData/MCMapData.ts";
import {OptionData} from "../../Datas/Options/OptionData.ts";
import {OrderedDitherWebgpu} from "./OrderedDitherWebgpu.ts";
import {BoolToEDimensionalMode} from "../../Cores/Types.ts";
import shaderCode from './Shaders/OrderedDitherShader.wgsl?raw';

export abstract class OrderedDithererBase extends ThresholdDitherer {
    // width, height, threshold map
    GetThresholdMap(): [number, number, number[][]] {
        return [
            1, 1,
            [
                [0],
            ]
        ];
    }

    ditherWebgpu: OrderedDitherWebgpu;

    constructor() {
        super();
        this.ditherWebgpu = new OrderedDitherWebgpu();
    }

    override async Convert(optionData: OptionData): Promise<MCMapData> {
        console.log("start ordered dither")
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

        const returnArray = await this.ditherWebgpu.RequestToDither(shaderCode, imageData, optionData.usingColors, this.GetThresholdMap());
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
            returnData.mapToColor.set(i, optionData.usingColors[i]);
        }

        return returnData;
    }

    override async GetNearestColorId(cords: [number, number], baseColor: RGBColor, colorList: RGBColor[]): Promise<number> {

        let bestApproxPair: Array<number> = this.FindBestApproxWithRGB(baseColor, colorList);

        // 2つ目の要素が無効値(0未満)の場合は確定で1つ目の要素を返す
        return bestApproxPair[1] < 0 ? bestApproxPair[0] : this.SelectNumByOrderedDither(cords[0], cords[1], RGBColor.Tou32Vec3(baseColor), bestApproxPair[0], bestApproxPair[1], colorList);
    }

    private SelectNumByOrderedDither(x: number, y: number, targetColor: [number, number, number], aColorIdx: number, bColorIdx: number, colorList: RGBColor[]): number {
        if (bColorIdx < 0) {
            return aColorIdx;
        }
        let aColor: [number, number, number] = RGBColor.Tou32Vec3(colorList[aColorIdx]);
        let bColor: [number, number, number] = RGBColor.Tou32Vec3(colorList[bColorIdx]);

        let aDistance: number = DistSq(targetColor, aColor);
        let bDistance: number = DistSq(targetColor, bColor);

        if ((aDistance + bDistance) <= 0) {
            return aColorIdx;
        }
        const [thresholdMapSizeWidth, thresholdMapSizeHeight, thresholdMap] = this.GetThresholdMap();
        let layerIndex = thresholdMap[(y % thresholdMapSizeHeight)][(x % thresholdMapSizeWidth)];

        return aDistance / (aDistance + bDistance) < layerIndex / (thresholdMapSizeHeight * thresholdMapSizeWidth) ? aColorIdx : bColorIdx;

    }

    // 単に近い二色ではなく、ある程度近い色から、市松模様にしたときに最も色が近くなる組み合わせを取得
    FindBestApproxWithRGB(targetColor: RGBColor, colorList: RGBColor[] = [], kNearest = 12) {
        let bestIds: Array<number> = []; // targetColorに近い12色を持つ配列
        let bestDists: Array<number> = []; // bestIdsの各色のtarget colorとの距離

        // 初期化
        for (let i = 0; i < kNearest; i = i + 1) {
            bestIds.push(-1);
            bestDists.push(-1);
        }

        // 全色から近い12色を取る
        for (let i = 0; i < colorList.length; i = i + 1) {
            // 最大値を取る

            let maxIdx = 0; // bestIds内での最大距離ID
            let maxDist = bestDists[0]; // bestIds内での最大距離
            for (let j = 1; j < kNearest; j = j + 1) {
                let isBigger: boolean = ((maxDist >= 0) && (bestDists[j] < 0 || bestDists[j] > maxDist));
                maxIdx = isBigger ? j : maxIdx;
                maxDist = isBigger ? bestDists[j] : maxDist;
            }

            // bestIds内の最大距離と比較して小さい方を入れる
            let d = DistSq(RGBColor.Tou32Vec3(targetColor), RGBColor.Tou32Vec3(colorList[i]));
            let needsUpdateBiggest: boolean = (maxDist < 0 || d < maxDist);

            bestDists[maxIdx] = needsUpdateBiggest ? d : bestDists[maxIdx];
            bestIds[maxIdx] = needsUpdateBiggest ? i : bestIds[maxIdx];
        }

        let bestPair: Array<number> = Array(0, -1);
        let bestPairDist: number = bestDists[0];

        // 色がある程度近いkNearest個の配列のうち、最も綺麗な組み合わせを絞り込み
        for (let a = 0; a < kNearest; a = a + 1) {
            let aId: number = bestIds[a];
            if (aId < 0 || colorList.length <= aId) {
                continue;
            }
            let aColor: [number, number, number] = RGBColor.Tou32Vec3(colorList[aId]);
            for (let b = 0; b < kNearest; b = b + 1) {

                let bId: number = bestIds[b];
                if (bId < 0 || colorList.length <= bId) {
                    continue;
                }
                let bColor: [number, number, number] = RGBColor.Tou32Vec3(colorList[bId]);
                // console.log(`a = [${aId}]: ${aColor}`);
                // console.log(`b = [${bId}]: ${bColor}`);
                let diff = sub(aColor, bColor);

                let dist: number;
                let isTheSameColor = (dot(diff, diff) < 1e-6 || aId == bId);
                let denom: number = isTheSameColor ? 1 : dot(diff, diff);
                if (isTheSameColor) {
                    dist = DistSq(RGBColor.Tou32Vec3(targetColor), aColor);
                } else {
                    let alphaStar = dot(sub(RGBColor.Tou32Vec3(targetColor), bColor), diff) / denom;
                    let alpha = Math.max(0, Math.min(1, alphaStar));
                    let mix = addScaled(aColor, bColor, alpha);
                    dist = DistSq(RGBColor.Tou32Vec3(targetColor), mix);
                }


                // よりよい値なら更新
                let isBetter = dist < bestPairDist;
                bestPair[0] = isBetter ? aId : bestPair[0];
                bestPair[1] = isBetter ? (isTheSameColor ? -1 : bId) : bestPair[1];
                bestPairDist = isBetter ? dist : bestPairDist;

            }
        }
        return bestPair;
    }

    // 上記のlab版
    FindBestApproxWithLab(target: RGBColor, paletteColor: RGBColor[] = [], kNearest = 12) {
        const targetLab = rgbToLab(target);
        const dists = paletteColor.map((p, i) => ({
            i, d: DistSq(targetLab, rgbToLab(p))
        }));
        dists.sort((a, b) => a.d - b.d);
        const nearest = dists.slice(0, Math.min(kNearest, dists.length)).map(x => x.i);

        let best = {
            type: 'single',
            i: nearest[0],
            j: -1,
            alpha: 1,
            dist: dists[0] ? dists[0].d : 0,
            dist_i: dists[0] ? dists[0].d : 0,
            dist_j: Infinity,
        };

        for (let a = 0; a < nearest.length; a++) {
            const i = nearest[a];
            for (let b = a + 1; b < nearest.length; b++) {
                const j = nearest[b];
                const c1 = rgbToLab(paletteColor[i]), c2 = rgbToLab(paletteColor[j]);
                const diff = sub(c1, c2);
                const denom = norm2(diff);

                if (denom < 1e-6) { // ほぼ同色
                    continue;
                }

                const alphaStar = dot(sub(targetLab, c2), diff) / denom;
                const alpha = Math.max(0, Math.min(1, alphaStar));
                const mix = addScaled(c1, c2, alpha);
                const d = DistSq(targetLab, mix);

                if (d < best.dist) {
                    best = {
                        type: 'pair',
                        i,
                        j,
                        alpha,
                        dist: d,
                        dist_i: DistSq(targetLab, c1),
                        dist_j: DistSq(targetLab, c2),
                    };
                }
            }
        }
        return best;
    }

    //////////////// 以下 色取得方法 過去に使用していた履歴

    // 二色の距離をlab値から変換
    private static GetTwoColorDistance(rgb1: RGBColor, rgb2: RGBColor): number {
        const [L1, a1, b1] = rgbToLab(rgb1);
        const [L2, a2, b2] = rgbToLab(rgb2);

        const avgLp = (L1 + L2) / 2.0;
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        const avgC = (C1 + C2) / 2.0;

        const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7.0) / (Math.pow(avgC, 7.0) + Math.pow(25.0, 7.0))));
        const a1p = (1 + G) * a1;
        const a2p = (1 + G) * a2;
        const C1p = Math.sqrt(a1p * a1p + b1 * b1);
        const C2p = Math.sqrt(a2p * a2p + b2 * b2);

        const avgCp = (C1p + C2p) / 2.0;
        const h1p = Math.atan2(b1, a1p) * 180 / Math.PI + (Math.atan2(b1, a1p) < 0 ? 360 : 0);
        const h2p = Math.atan2(b2, a2p) * 180 / Math.PI + (Math.atan2(b2, a2p) < 0 ? 360 : 0);

        let dhp = h2p - h1p;
        if (Math.abs(dhp) > 180) dhp -= Math.sign(dhp) * 360;
        const dLp = L2 - L1;
        const dCp = C2p - C1p;
        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI / 180) / 2);

        const avgHp = Math.abs(h1p - h2p) > 180
            ? (h1p + h2p + 360) / 2
            : (h1p + h2p) / 2;

        const T =
            1 -
            0.17 * Math.cos((avgHp - 30) * Math.PI / 180) +
            0.24 * Math.cos((2 * avgHp) * Math.PI / 180) +
            0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180) -
            0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180);

        const SL = 1 + (0.015 * Math.pow(avgLp - 50, 2)) / Math.sqrt(20 + Math.pow(avgLp - 50, 2));
        const SC = 1 + 0.045 * avgCp;
        const SH = 1 + 0.015 * avgCp * T;
        const RT = -2 * Math.sqrt(Math.pow(avgCp, 7.0) / (Math.pow(avgCp, 7.0) + Math.pow(25.0, 7.0))) *
            Math.sin((60 * Math.exp(-Math.pow((avgHp - 275) / 25, 2))) * Math.PI / 180);

        return Math.sqrt(
            Math.pow(dLp / SL, 2) +
            Math.pow(dCp / SC, 2) +
            Math.pow(dHp / SH, 2) +
            RT * (dCp / SC) * (dHp / SH)
        );
    }

    // 単純な座標変換による距離取得
    private static GetTwoColorByRGB(rgb1: RGBColor, rgb2: RGBColor): number {
        return (rgb1.r - rgb2.r) * (rgb1.r - rgb2.r)
            + (rgb1.g - rgb2.g) * (rgb1.g - rgb2.g)
            + (rgb1.b - rgb2.b) * (rgb1.b - rgb2.b);
    }

    // lab色を基に距離を計算
    private static GetTwoColorByLab(rgb1: RGBColor, rgb2: RGBColor) {
        // lab値変換後 量子化
        const lab1 = rgbToLab(rgb1);
        const lab2 = rgbToLab(rgb2);
        const colorBuff = 1; // 3種の数値の中で優位性を持たせるための乗算
        lab1[0] *= colorBuff;
        lab2[0] *= colorBuff;
        return (lab1[0] - lab2[0]) * (lab1[0] - lab2[0])
            + (lab1[1] - lab2[1]) * (lab1[1] - lab2[1])
            + (lab1[2] - lab2[2]) * (lab1[2] - lab2[2]);
    }
}
