import { OrderedDithererBase } from "./OrderedDithererBase";

export class DynamicSpiralMatrixOrderedDitherer extends OrderedDithererBase {
    override GetThresholdMap(): [number, number, number[][]] {
        return [
            8, 8,
            [
                [42, 43, 44, 45, 46, 47, 48, 49],
                [41, 20, 21, 22, 23, 24, 25, 50],
                [40, 19, 6, 7, 8, 9, 26, 51],
                [39, 18, 5, 0, 1, 10, 27, 52],
                [38, 17, 4, 3, 2, 11, 28, 53],
                [37, 16, 15, 14, 13, 12, 29, 54],
                [36, 35, 34, 33, 32, 31, 30, 55],
                [63, 62, 61, 60, 59, 58, 57, 56],
            ]
        ];
    }
}
