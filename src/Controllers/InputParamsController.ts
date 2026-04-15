import { InputParamsView } from "../Views/InputParamsView/InputParamsView.tsx";
import { ControllerBase } from "./ControllerBase";
import { ConstObjectToOption, DropdownComponent } from "../Views/Components/DropdownComponent/DropdownComponent";
import { ConvertModes } from "../Cores/Types";
import { OptionManager } from "../Datas/Options/OptionManager";
import { SelectImageComponent } from "../Views/Components/InputComponents/SelectImageComponent/SelectImageComponent";
import { ImagePreviewComponent } from "../Views/Components/ImagePreviewComponent/ImagePreviewComponent";
import { MapDataImagePreviewComponent } from "../Views/Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent";
import { ProgressBarComponent } from "../Views/Components/ProgressBarComponent/ProgressBarComponent";
import { MCMapData } from "../Datas/MapData/MCMapData";
import { ImageCanvasToImageData } from "../FunctionLibraries/ImageFunctionLibrary";
import { MCMapDataManager } from "../Datas/MapData/MCMapDataManager";
import { InputParamsMediator } from "./Mediators/InputParamsMediator";
import { ButtonComponent } from "../Views/Components/ButtonComponent/ButtonComponent";
import { UsingBlockComponent } from "../Views/Components/UsingBlockComponent/UsingBlockComponent.tsx";
import { InputNumberComponent } from "../Views/Components/InputComponents/InputNumberComponent/InputNumberComponent";
import type { SelectMapdataComponent } from "../Views/Components/InputComponents/SelectMapdataComponent/SelectMapdataComponent.tsx";
import { MapDataInput } from "../IOSystems/MapdataInput.tsx";
import type { InputCheckBoxComponent } from "../Views/Components/InputComponents/InputCheckBoxComponent/InputCheckBoxComponent.tsx";
import type { InputCheckBoxListComponent } from "../Views/Components/InputComponents/InputCheckBoxListComponent/InputCheckBoxListComponent.tsx";
import type { BlockBulkSettingComponent } from "../Views/Components/BlockBulkSettingComponent/BlockBulkSettingComponent.tsx";

export class InputParamsController extends ControllerBase {

    private viewInputParams: InputParamsView;

    override Reload(): void {
        super.Reload();
        this.ReloadIsDimensionalModeCheckbox();
        this.ReloadBaseImagePreview();
        this.ReloadMagnification();
        this.ReloadConvertModeDropdown();
        this.ReloadBGeneratesSimpleDitherIntermediateCheckbox();
        this.ReloadSimpleDitherColorCutPowInputComponent();
    }

    OnInputParamChange(value: string): void {
        OptionManager.get().SetConvertMode(value);
    }

    // mediator
    inputParamsMediator: InputParamsMediator = new InputParamsMediator();

    // select base image
    canvas: HTMLCanvasElement = document.createElement('canvas');

    InitializeSelectBaseImage(selectBaseImage: SelectImageComponent): void {
        if (!selectBaseImage) {
            console.error("SelectImageComponent must be defined");
            return;
        }
        selectBaseImage.onComponentChange.Subscribe(
            (value: Blob) => {
                this.OnSelectBaseImageChange(value);
            });
    }

    OnSelectBaseImageChange(value: Blob): void {
        if (!value) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const imageData = ImageCanvasToImageData(this.canvas, image);
                if (imageData) {
                    OptionManager.get().SetImage(imageData);
                }
            }
            image.src = reader.result as string;
        }
        reader.readAsDataURL(value);
    }

    // base image preview

    InitializeBaseImagePreview(baseImage: ImagePreviewComponent): void {
        if (!baseImage) {
            console.error("baseImage must be defined");
            return;
        }
        OptionManager.get().onImageChange.Subscribe(
            (image: ImageData) => {
                baseImage.SetImage(image);
            }
        );
    }

    ReloadBaseImagePreview(): void {
        this.viewInputParams.baseImagePreview.SetImage(OptionManager.get().optionData.baseImage);
    }

    // is Dimensional mode Checkbox

    InitializeIsDimensionalModeCheckbox(checkbox: InputCheckBoxComponent): void {
        if (!checkbox) {
            console.error("checkbox must be defined");
            return;
        }

        checkbox.onComponentChange.Subscribe((value) => {
            if (typeof value != "boolean") {
                console.log("isDimensionalModeCheckbox value must be a boolean but: ", typeof value);
                return;
            }

            OptionManager.get().SetIsDimensionalMode(value);
        });
    }

    ReloadIsDimensionalModeCheckbox(): void {
        const optionData = OptionManager.get().optionData;
        this.viewInputParams.isDimensionalModeCheckbox.SetChecked(optionData.bIsDimensionalMode);
    }

    //magnificationInputComponent
    InitializeMagnification(magnificationInputComponent: InputNumberComponent): void {
        if (!magnificationInputComponent) {
            console.error("magnificationInputComponent must be defined");
            return;
        }

        magnificationInputComponent.onComponentChange.Subscribe((value) => {
            if (typeof value != "number") {
                console.log("magnificationInputComponent must be a number: ", typeof value);
                return;
            }
            // % to ratio
            const ratio = value / 100;
            OptionManager.get().SetMagnification(ratio);
        })
    }

    ReloadMagnification(): void {
        const optionData = OptionManager.get().optionData;
        this.viewInputParams.magnificationInputComponent.value = optionData.magnification * 100;
    }

    // convert button
    InitializeConvertButton(convertButton: ButtonComponent): void {
        if (!convertButton) {
            console.error("convertButton must be defined");
            return;
        }
        convertButton.onComponentChange.Subscribe((event) => {
            this.inputParamsMediator.RequestToConverting();
        })
    }


    // convert mode dropdown

    InitializeConvertModeDropdown(convertModeDropdown: DropdownComponent): void {
        if (!convertModeDropdown) {
            console.error("ViewInputParams must be defined");
            return;
        }
        convertModeDropdown.options = ConstObjectToOption(ConvertModes);
        convertModeDropdown.onComponentChange.Subscribe(
            (value: string) => {
                this.OnInputParamChange(value);
            });
    }

    ReloadConvertModeDropdown(): void {
        const optionData = OptionManager.get().optionData;
        this.viewInputParams.convertModeDropdown.defaultValue = optionData.convertMode;
    }

    // progress bar
    progressBar: ProgressBarComponent | undefined = undefined;

    InitializeProgressBar(progressBar: ProgressBarComponent): void {
        if (!progressBar) {
            console.error("ProgressBarComponent must be defined");
            return;
        }
        this.progressBar = progressBar;

        // this.inputParamsMediator.onProgressChange.Subscribe(([currentProgress, maxProgress]) => {
        //     if (!this.progressBar) {
        //         return;
        //     }
        //     progressBar.currentProgress = currentProgress;
        //     progressBar.maxProgress = maxProgress;
        // });
    }

    InitializeSelectMapData(selectMapData: SelectMapdataComponent): void {
        if (!selectMapData) {
            console.error("mapData must be defined");
            return;
        }
        selectMapData.onComponentChange.Subscribe(
            (value: File) => {
                this.OnSelectedFileChange(value);
            })
    }

    OnSelectedFileChange(value: File) {
        if (!value) {
            return;
        }

        const mapDataReader = new MapDataInput();
        mapDataReader.setFile(value);
        mapDataReader.loadSelectedFile();
    }

    // using block component
    private usingBlockItemComponent: UsingBlockComponent | undefined = undefined;

    InitializeUsingBlockItem(usingBlockItemComponent: UsingBlockComponent): void {
        if (!usingBlockItemComponent) {
            console.error("usingBlockItemComponent must be defined");
            return;
        }
        this.usingBlockItemComponent = usingBlockItemComponent;

        const usingBlockDataList = this.inputParamsMediator.GetUsingBlockItemData();
        usingBlockDataList.forEach(data => {
            usingBlockItemComponent.AddItem(data.id, data.colorId, data.blockList);
        });
    }

    // using block template

    private blockBulkSetting: BlockBulkSettingComponent | undefined = undefined;

    InitializeBlockBulkSetting(blockBulkSettingComponent: BlockBulkSettingComponent): void {
        if (!blockBulkSettingComponent) {
            console.error("blockBulkSettingComponent must be defined");
            return;
        }
        this.blockBulkSetting = blockBulkSettingComponent;

        this.InitializeBlockBulkSettingCheckboxList(blockBulkSettingComponent.inputCheckBoxList);
        this.InitializeBlockBulkSettingApplyButton(blockBulkSettingComponent.applyChecksButton);
        this.InitializeBlockBulkSettingSelectAllButton(blockBulkSettingComponent.selectAllButton);
        this.InitializeBlockBulkSettingDeselectAllButton(blockBulkSettingComponent.deselectAllButton);
    }

    private inputCheckBoxList: InputCheckBoxListComponent | undefined = undefined;

    InitializeBlockBulkSettingCheckboxList(inputCheckBoxListComponent: InputCheckBoxListComponent): void {
        if (!inputCheckBoxListComponent) {
            console.error("inputCheckBoxListComponent must be defined");
            return;
        }
        this.inputCheckBoxList = inputCheckBoxListComponent;

        const usingBlockTemplateDataList = this.inputParamsMediator.GetUsingBlockTemplateData();
        usingBlockTemplateDataList.forEach(data => {
            inputCheckBoxListComponent.AddItem({ label: data.name, value: data.id, checked: false });
        });

        inputCheckBoxListComponent.onComponentChange.Subscribe((value) => {
            if (typeof value != "boolean") {
                console.log("blockBulkSettingCheckbox value must be a boolean but: ", typeof value);
                return;
            }
        });
    }

    InitializeBlockBulkSettingApplyButton(applyChecksButton: ButtonComponent): void {
        if (!applyChecksButton) {
            console.error("applyChecksButton must be defined");
            return;
        }

        applyChecksButton.onComponentChange.Subscribe((value) => {
            if (typeof value != "boolean") {
                console.log("applyChecksButton value must be a boolean but: ", typeof value);
                return;
            }
        });
    }

    InitializeBlockBulkSettingSelectAllButton(selectAllButton: ButtonComponent): void {
        if (!selectAllButton) {
            console.error("selectAllButton must be defined");
            return;
        }

        selectAllButton.onComponentChange.Subscribe((value) => {
            this.OnSelectAllButtonChange();
        });
    }
    private OnSelectAllButtonChange() {
        if (!this.usingBlockItemComponent) {
            console.error("blockBulkSettingCheckboxList must be defined");
            return;
        }
        this.usingBlockItemComponent.SelectAll();
    }

    InitializeBlockBulkSettingDeselectAllButton(deselectAllButton: ButtonComponent): void {
        if (!deselectAllButton) {
            console.error("deselectAllButton must be defined");
            return;
        }

        deselectAllButton.onComponentChange.Subscribe((value) => {
            this.OnDeselectAllButtonChange();
        });
    }

    private OnDeselectAllButtonChange() {
        if (!this.usingBlockItemComponent) {
            console.error("blockBulkSettingCheckboxList must be defined");
            return;
        }
        this.usingBlockItemComponent.UnSelectAll();
    }

    // bGeneratesSimpleDitherIntermediateCheckbox
    InitializeBGeneratesSimpleDitherIntermediateCheckbox(checkbox: InputCheckBoxComponent): void {
        if (!checkbox) {
            console.error("checkbox must be defined");
            return;
        }

        checkbox.onComponentChange.Subscribe((value) => {
            if (typeof value != "boolean") {
                console.log("bGeneratesSimpleDitherIntermediateCheckbox value must be a boolean but: ", typeof value);
                return;
            }

            OptionManager.get().SetBGeneratesSimpleDitherIntermediate(value);
        });
    }

    ReloadBGeneratesSimpleDitherIntermediateCheckbox(): void {
        const optionData = OptionManager.get().optionData;
        this.viewInputParams.bGeneratesSimpleDitherIntermediateCheckbox.SetChecked(optionData.bGeneratesSimpleDitherIntermediate);
    }

    // simpleDitherColorCutPowInputComponent
    InitializeSimpleDitherColorCutPowInputComponent(inputNumberComponent: InputNumberComponent): void {
        if (!inputNumberComponent) {
            console.error("inputNumberComponent must be defined");
            return;
        }

        inputNumberComponent.onComponentChange.Subscribe((value) => {
            if (typeof value != "number") {
                console.log("simpleDitherColorCutInputComponent value must be a number but: ", typeof value);
                return;
            }

            OptionManager.get().SetSimpleDitherColorCutPow(value);
        });
    }

    ReloadSimpleDitherColorCutPowInputComponent(): void {
        const optionData = OptionManager.get().optionData;
        this.viewInputParams.simpleDitherColorCutPowInputComponent.value = optionData.simpleDitherColorCutPow;
    }

    constructor(viewInputParams: InputParamsView) {
        super();
        this.viewInputParams = viewInputParams;
        this.InitializeConvertModeDropdown(viewInputParams.convertModeDropdown);
        this.InitializeSelectBaseImage(viewInputParams.selectBaseImage);
        this.InitializeBaseImagePreview(viewInputParams.baseImagePreview);
        this.InitializeUsingBlockItem(viewInputParams.usingBlockItemComponent);
        this.InitializeIsDimensionalModeCheckbox(viewInputParams.isDimensionalModeCheckbox);
        this.InitializeBGeneratesSimpleDitherIntermediateCheckbox(viewInputParams.bGeneratesSimpleDitherIntermediateCheckbox);
        this.InitializeSimpleDitherColorCutPowInputComponent(viewInputParams.simpleDitherColorCutPowInputComponent);
        this.InitializeMagnification(viewInputParams.magnificationInputComponent);
        this.InitializeConvertButton(viewInputParams.convertButtonComponent);
        this.InitializeProgressBar(viewInputParams.progressBarComponent);
        this.InitializeSelectMapData(viewInputParams.selectMapdata);
        this.InitializeBlockBulkSetting(viewInputParams.blockBulkSettingComponent);
        this.Reload();
    }
}
