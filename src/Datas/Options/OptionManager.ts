import {Singleton} from "../../Cores/Singleton";
import {OptionData} from "./OptionData";
import {ObserverSubject} from "../../Cores/Observer";
import {RGBColor} from "../../Cores/Color";

export class OptionManager extends Singleton {
    optionData : OptionData = new OptionData();

    constructor() {
        super();
        this.onOptionChange = new ObserverSubject<OptionData>();
    }

    SetImage(img : ImageData) : void {
        this.optionData.baseImage = img;
        console.debug("Set image");
        this.onOptionChange.notify(this.optionData);
    }

    SetMagnification(ratio: number){
        this.optionData.magnification = ratio;
        console.debug("Set ratio: ", ratio);
        this.onOptionChange.notify(this.optionData);
    }

    SetConvertMode(value: string) : void {
        this.optionData.convertMode = value;
        console.debug("Set convert mode to " + value);
        this.onOptionChange.notify(this.optionData);
    }

    SetUsingColors(colors : RGBColor[]) : void {
        this.optionData.usingColors = colors;
        console.debug("Set colors: " + colors);
        this.onOptionChange.notify(this.optionData);
    }
    // observer
    onOptionChange : ObserverSubject<OptionData>;
}