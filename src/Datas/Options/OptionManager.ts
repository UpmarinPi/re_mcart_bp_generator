import {Singleton} from "../../Cores/Singleton";
import {OptionData} from "./OptionData";
import {ObserverSubject} from "../../Cores/Observer";
import {RGBColor} from "../../Cores/Color";

export class OptionManager extends Singleton {

    optionData : OptionData = new OptionData();

    SetImage(img : ImageData) : void {
        this.optionData.baseImage = img;
        console.debug("Set image");
        this.onImageChange.notify(this.optionData.baseImage);
        this.onOptionChange.notify(this.optionData);
    }
    onImageChange : ObserverSubject<ImageData> = new ObserverSubject();

    SetMagnification(ratio: number){
        this.optionData.magnification = ratio;
        console.debug("Set ratio: ", ratio);
        this.onMagnificationChange.notify(this.optionData.magnification);
        this.onOptionChange.notify(this.optionData);
    }
    onMagnificationChange : ObserverSubject<number> = new ObserverSubject();

    SetConvertMode(value: string) : void {
        this.optionData.convertMode = value;
        console.debug("Set convert mode to " + value);
        this.onConvertModeChange.notify(this.optionData.convertMode);
        this.onOptionChange.notify(this.optionData);
    }
    onConvertModeChange : ObserverSubject<string> = new ObserverSubject();

    SetIsDimensionalMode(bIsDimensionalMode: boolean): void{
        this.optionData.bIsDimensionalMode = bIsDimensionalMode;
        console.debug("Set \"Is Dimensional Mode\" to " + bIsDimensionalMode);
        this.onIsDemensionalModeChange.notify(this.optionData.bIsDimensionalMode);
        this.onOptionChange.notify(this.optionData);
    }
    onIsDemensionalModeChange : ObserverSubject<boolean> = new ObserverSubject();

    SetUsingColors(colors : RGBColor[]) : void {
        this.optionData.usingColors = colors;
        console.debug("Updated color list");
        this.onUsingColorChange.notify(this.optionData.usingColors);
        this.onOptionChange.notify(this.optionData);
    }
    onUsingColorChange : ObserverSubject<RGBColor[]> = new ObserverSubject();
    // observer
    onOptionChange : ObserverSubject<OptionData> = new ObserverSubject();
}