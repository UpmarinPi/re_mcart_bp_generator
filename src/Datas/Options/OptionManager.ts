import { Singleton } from "../../Cores/Singleton";
import { OptionData } from "./OptionData";
import { ObserverSubject } from "../../Cores/Observer";
import { RGBColor } from "../../Cores/Color";
import type { ColorDataRepository } from "../Repositories/ColorDataRepository";

export class OptionManager extends Singleton {

    private optionData: OptionData = new OptionData();

    public GetOptionData(): OptionData {
        return this.optionData;
    }

    public SetOptionData(optionData: OptionData): void {
        this.optionData = optionData;
        this.onOptionChange.notify(this.optionData);
        this.onImageChange.notify(this.optionData.baseImage);
        this.onMagnificationChange.notify(this.optionData.magnification);
        this.onConvertModeChange.notify(this.optionData.convertMode);
        this.onIsDemensionalModeChange.notify(this.optionData.bIsDimensionalMode);
        this.onUsingColorChange.notify(this.optionData.usingColors);
        this.onColorsToBlocksChange.notify(this.optionData.colorsToBlocks);
        this.onBGeneratesSimpleDitherIntermediateChange.notify(this.optionData.bGeneratesSimpleDitherIntermediate);
        this.onSimpleDitherColorCutChange.notify(this.optionData.simpleDitherColorCutPow);
    }

    SetImage(img: ImageData): void {
        this.optionData.baseImage = img;
        console.debug("Set image");
        this.onImageChange.notify(this.optionData.baseImage);
        this.onOptionChange.notify(this.optionData);
    }
    onImageChange: ObserverSubject<ImageData> = new ObserverSubject();

    SetMagnification(ratio: number) {
        this.optionData.magnification = ratio;
        console.debug("Set ratio: ", ratio);
        this.onMagnificationChange.notify(this.optionData.magnification);
        this.onOptionChange.notify(this.optionData);
    }
    onMagnificationChange: ObserverSubject<number> = new ObserverSubject();

    SetConvertMode(value: string): void {
        this.optionData.convertMode = value;
        console.debug("Set convert mode to " + value);
        this.onConvertModeChange.notify(this.optionData.convertMode);
        this.onOptionChange.notify(this.optionData);
    }
    onConvertModeChange: ObserverSubject<string> = new ObserverSubject();

    SetIsDimensionalMode(bIsDimensionalMode: boolean): void {
        this.optionData.bIsDimensionalMode = bIsDimensionalMode;
        console.debug("Set \"Is Dimensional Mode\" to " + bIsDimensionalMode);
        this.onIsDemensionalModeChange.notify(this.optionData.bIsDimensionalMode);
        this.onOptionChange.notify(this.optionData);
    }
    onIsDemensionalModeChange: ObserverSubject<boolean> = new ObserverSubject();

    SetUsingColors(colors: RGBColor[]): void {
        this.optionData.usingColors = colors;
        console.debug("Updated color list");
        this.onUsingColorChange.notify(this.optionData.usingColors);
        this.onOptionChange.notify(this.optionData);
    }
    onUsingColorChange: ObserverSubject<RGBColor[]> = new ObserverSubject();

    SetColorsToBlocks(colorsToBlocks: Map<RGBColor, string>): void {
        this.optionData.colorsToBlocks = colorsToBlocks;
        console.debug("Updated color to block map");
        this.onColorsToBlocksChange.notify(this.optionData.colorsToBlocks);
        this.onOptionChange.notify(this.optionData);
    }
    onColorsToBlocksChange: ObserverSubject<Map<RGBColor, string>> = new ObserverSubject();

    UpdateColorsAndBlocks(colorIdToBlockMap: Map<string, string>, colorRepository: ColorDataRepository): void {
        const optionManager = OptionManager.get();
        const bIsDimensionalMode = optionManager.GetOptionData().bIsDimensionalMode;
        let usingColors: RGBColor[] = [];
        const colorToBlockmap: Map<RGBColor, string> = new Map();

        if (!colorRepository) {
            return;
        }
        colorIdToBlockMap.forEach((value, key) => {
            const color = colorRepository.GetDefaultColor(key);
            if (color) {
                usingColors.push(color);
                colorToBlockmap.set(color, value);
            }
            if (bIsDimensionalMode) {
                const lightColor = colorRepository.GetLightColor(key);
                if (lightColor) {
                    usingColors.push(lightColor);
                    colorToBlockmap.set(lightColor, value);
                }
                const darkColor = colorRepository.GetDarkColor(key);
                if (darkColor) {
                    usingColors.push(darkColor);
                    colorToBlockmap.set(darkColor, value);
                }
            }
        });
        optionManager.SetUsingColors(usingColors);
        optionManager.SetColorsToBlocks(colorToBlockmap);
    }

    SetBGeneratesSimpleDitherIntermediate(bGeneratesSimpleDitherIntermediate: boolean): void {
        this.optionData.bGeneratesSimpleDitherIntermediate = bGeneratesSimpleDitherIntermediate;
        console.debug("Set \"Generates Simple Dither Intermediate\" to " + bGeneratesSimpleDitherIntermediate);
        this.onBGeneratesSimpleDitherIntermediateChange.notify(this.optionData.bGeneratesSimpleDitherIntermediate);
        this.onOptionChange.notify(this.optionData);
    }
    onBGeneratesSimpleDitherIntermediateChange: ObserverSubject<boolean> = new ObserverSubject();

    SetSimpleDitherColorCutPow(simpleDitherColorCutPow: number): void {
        this.optionData.simpleDitherColorCutPow = simpleDitherColorCutPow;
        console.debug("Set \"Simple Dither Color Cut\" to " + simpleDitherColorCutPow);
        this.onSimpleDitherColorCutChange.notify(this.optionData.simpleDitherColorCutPow);
        this.onOptionChange.notify(this.optionData);
    }
    onSimpleDitherColorCutChange: ObserverSubject<number> = new ObserverSubject();
    // observer
    onOptionChange: ObserverSubject<OptionData> = new ObserverSubject();
}