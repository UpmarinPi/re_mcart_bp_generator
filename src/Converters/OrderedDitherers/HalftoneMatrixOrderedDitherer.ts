import { OrderedDithererBase } from "./OrderedDithererBase";

export class HalftoneMatrixOrderedDitherer extends OrderedDithererBase {
    override GetThresholdMap(): [number, number, number[][]] {
        return [
            4, 4,
            [
                [0, 2, 14, 12],
                [8, 10, 5, 7],
                [15, 13, 1, 3],
                [4, 6, 9, 11]
            ]
        ];
    }
}
