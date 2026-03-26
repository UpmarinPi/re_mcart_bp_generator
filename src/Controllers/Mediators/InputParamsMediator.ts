import { MediatorBase } from "./MediatorBase";
import { OptionManager } from "../../Datas/Options/OptionManager";
import { ConverterFactory } from "../../Converters/ConverterFactory";
import { MCMapData } from "../../Datas/MapData/MCMapData";
import { MCMapDataManager } from "../../Datas/MapData/MCMapDataManager";
import { DithererBase } from "../../Converters/DithererBase";
import { ColorDataRepository } from "../../Datas/Repositories/ColorDataRepository.ts";
import { ERepositoryIds, RepositoryManager } from "../../Datas/Repositories/RepositoryManager.ts";
import { BlockDataRepository } from "../../Datas/Repositories/BlockDataRepository.ts";
import { UsingBlockTemplateRepository } from "../../Datas/Repositories/UsingBlockTemplateRepository.ts";

export class InputParamsMediator extends MediatorBase {
    constructor() {
        super();
        this.InitializeOptionData();
        this.InitializeOptionManagerBinding();
    }

    convertMode: DithererBase | undefined = undefined;

    private InitializeOptionData() {
        this.UpdateUsingColorsOfOptionData();
    }

    private InitializeOptionManagerBinding() {
        const optionManager = OptionManager.get();
        optionManager.onIsDemensionalModeChange.Subscribe(() => {
            this.OnIsDemensionalModeChange();
        });
    }

    private OnIsDemensionalModeChange(): void {
        this.UpdateUsingColorsOfOptionData();
    }

    private UpdateUsingColorsOfOptionData() {
        const optionManager = OptionManager.get();
        const ColorDataRepo = RepositoryManager.get().GetRepository<ColorDataRepository>(ERepositoryIds.ColorData);
        if (!optionManager || !ColorDataRepo) {
            return;
        }
        optionManager.SetUsingColors(ColorDataRepo.GetColorList(optionManager.optionData.bIsDimensionalMode));
    }

    RequestToConverting() {
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

    GetUsingBlockItemData(): { id: string, colorId: string, blockList: string[] }[] {
        const blockRepo = RepositoryManager.get().GetRepository<BlockDataRepository>(ERepositoryIds.BlockData);
        const colorRepo = RepositoryManager.get().GetRepository<ColorDataRepository>(ERepositoryIds.ColorData);

        if (!blockRepo || !colorRepo) {
            return [];
        }

        const result: { id: string, colorId: string, blockList: string[] }[] = [];
        const colorToBlocks = blockRepo.GetColorToBlockIdList();

        colorToBlocks.forEach((blocks, colorId) => {
            result.push({
                id: colorId,
                colorId: colorId,
                blockList: blocks
            });
        });

        return result;
    }

    GetUsingBlockTemplateData(): { id: string, name: string }[] {
        const usingBlockTemplateRepo = RepositoryManager.get().GetRepository<UsingBlockTemplateRepository>(ERepositoryIds.UsingBlockTemplateData);
        if (!usingBlockTemplateRepo) {
            console.error("There has no using block template repository");
            return [];
        }
        console.log("usingBlockTemplateRepo", usingBlockTemplateRepo.GetTemplateList());
        return usingBlockTemplateRepo.GetTemplateList();
    }
}
