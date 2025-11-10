import {DithererBase} from "./DithererBase";
import {ConvertModes} from "../Cores/Types";
import {RawDitherer} from "./RawDitherer";
import {BayerMatrixOrderedDitherer} from "./OrderedDitherers/BayerMatrixOrderedDitherer";
import {DynamicBayerMatrixOrderedDitherer} from "./OrderedDitherers/DynamicBayerMatrixOrderedDitherer";
import {Singleton} from "../Cores/Singleton";

export class ConverterFactory extends Singleton{
    private convertModeToDitherSystem: Map<string, DithererBase>;
    constructor() {
        super();
        this.convertModeToDitherSystem = new Map();
        this.convertModeToDitherSystem.set(ConvertModes.RawDither, new RawDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.BayerMatrixOrderedDither, new BayerMatrixOrderedDitherer());
        this.convertModeToDitherSystem.set(ConvertModes.DynamicBayerMatrixOrderedDither, new DynamicBayerMatrixOrderedDitherer());
    }
    GetConverter(convertType: string): DithererBase | undefined {
        return this.convertModeToDitherSystem.get(convertType);
    }
}