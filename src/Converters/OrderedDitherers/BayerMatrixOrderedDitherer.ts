import {OrderedDithererBase} from "./OrderedDithererBase";

export class BayerMatrixOrderedDitherer extends OrderedDithererBase {
    override GetThresholdMap(): [number, number, number[][]] {
        return [
            4, 4,
            [
                [0, 8, 2, 10],
                [12, 4, 14, 6],
                [3, 11, 1, 9],
                [15, 7, 13, 5]
            ]
        ];
    }
}
