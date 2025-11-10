import {MediatorBase} from "./MediatorBase";
import {OptionManager} from "../../Datas/Options/OptionManager";
import {ConverterFactory} from "../../Converters/ConverterFactory";
import {MCMapData} from "../../Datas/MapData/MCMapData";
import {MCMapDataManager} from "../../Datas/MapData/MCMapDataManager";
import {DithererBase} from "../../Converters/DithererBase";
import {ColorDataRepository} from "../../Datas/ColorDataRepository";

export class InputParamsMediator extends MediatorBase {
    constructor() {
        super();
        let optionData = OptionManager.get().optionData;
        optionData.usingColors = ColorDataRepository.get().GetColorList(true);
    }

    convertMode: DithererBase | undefined = undefined;

    RequestToConverting(){
        const optionData = OptionManager.get().optionData;
        this.convertMode = ConverterFactory.get().GetConverter(optionData.convertMode);
        if (!this.convertMode) {
            console.error("There has no converter mode in ConverterFactory");
            return;
        }
        this.convertMode.Convert(optionData).then((mapData: MCMapData) => {
            this.OnConvertCompleted(mapData);
        });
    }

    OnConvertCompleted(mapData: MCMapData) {
        MCMapDataManager.get().SetMapData(mapData);
    }
}