import { DithererBase } from "./DithererBase";
import { ConvertModes } from "../Cores/Types";
import { RawDitherer } from "./RawDitherer";
import { BayerMatrixOrderedDitherer } from "./OrderedDitherers/BayerMatrixOrderedDitherer";
import { DynamicBayerMatrixOrderedDitherer } from "./OrderedDitherers/DynamicBayerMatrixOrderedDitherer";
import { Singleton } from "../Cores/Singleton";
import { SpiralMatrixOrderedDitherer } from "./OrderedDitherers/SpiralMatrixOrderedDitherer";
import { DynamicSpiralMatrixOrderedDitherer } from "./OrderedDitherers/DynamicSpiralMatrixOrderedDitherer";
import { HalftoneMatrixOrderedDitherer } from "./OrderedDitherers/HalftoneMatrixOrderedDitherer";

export class ConverterFactory extends Singleton {
    private convertModeToDitherSystem: Map<string, DithererBase>;
    constructor() {
        super();
        this.convertModeToDitherSystem = new Map();
        this.convertModeToDitherSystem.set(ConvertModes.RawDither, new RawDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.BayerMatrixOrderedDither, new BayerMatrixOrderedDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.DynamicBayerMatrixOrderedDither, new DynamicBayerMatrixOrderedDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.SpiralMatrixOrderedDither, new SpiralMatrixOrderedDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.DynamicSpiralMatrixOrderedDither, new DynamicSpiralMatrixOrderedDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.HalftoneMatrixOrderedDither, new HalftoneMatrixOrderedDitherer());
    }
    GetConverter(convertType: string): DithererBase | undefined {
        return this.convertModeToDitherSystem.get(convertType);
    }
}