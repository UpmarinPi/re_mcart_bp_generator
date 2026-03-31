import { OrderedDithererBase } from "./OrderedDithererBase";

export class SpiralMatrixOrderedDitherer extends OrderedDithererBase {
    override GetThresholdMap(): [number, number, number[][]] {
        return [
            4, 4,
            [
                [6, 7, 8, 9],
                [5, 0, 1, 10],
                [4, 3, 2, 11],
                [15, 14, 13, 12]
            ]
        ];
    }
}
