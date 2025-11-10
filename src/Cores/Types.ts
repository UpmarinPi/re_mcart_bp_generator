export const ConvertModes =  {
    RawDither: "RawDither",
    BayerMatrixOrderedDither: "BayerMatrixOrderedDither",
    DynamicBayerMatrixOrderedDither: "DynamicBayerMatrixOrderedDither",
} as const;

type ConvertMode = typeof ConvertModes[keyof typeof ConvertModes];

export function StringToConvertMode(value: string): ConvertMode | undefined {
    return (Object.values(ConvertModes) as string[]).includes(value)
        ? (value as ConvertMode)
        : undefined;
}

// 次元モード
// 明暗による色数を増やす
export enum EDimensionalMode {
    Flat,   // 高さを持たない。単純な分使用できる色が少ない
    Shape,  // 高さを持つ。明暗を用いて色数を増やしている
}
