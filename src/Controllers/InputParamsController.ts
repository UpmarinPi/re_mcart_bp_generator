import {ViewInputParams} from "../Views/ViewInputParams";
import {ControllerBase} from "./ControllerBase";
import {ConstObjectToOption, DropdownComponent} from "../Views/Components/DropdownComponent";
import {ConvertModes} from "../Cores/Types";
import {OptionManager} from "../Datas/Options/OptionManager";
import {SelectImageComponent} from "../Views/Components/InputComponents/SelectImageComponent";
import {ImagePreviewComponent} from "../Views/Components/ImagePreviewComponent";
import {MapDataImagePreviewComponent} from "../Views/Components/MapDataImagePreviewComponent";
import {ProgressBarComponent} from "../Views/Components/ProgressBarComponent";
import {MCMapData} from "../Datas/MapData/MCMapData";
import {ImageCanvasToImageData} from "../FunctionLibraries/ImageFunctionLibrary";
import {MCMapDataManager} from "../Datas/MapData/MCMapDataManager";
import {InputParamsMediator} from "./Mediators/InputParamsMediator";
import {ButtonComponent} from "../Views/Components/ButtonComponent";
import {InputNumberComponent} from "../Views/Components/InputComponents/InputNumberComponent";
import type {SelectMapdataComponent} from "../Views/Components/InputComponents/SelectMapdataComponent.tsx";
import {MapDataInput} from "../IOSystems/MapdataInput.tsx";
import type {InputCheckBoxComponent} from "../Views/Components/InputComponents/InputCheckBoxComponent.tsx";
import {SceneManager, SceneTypes} from "../Cores/SceneManager.ts";
import {MapdataOutput} from "../IOSystems/MapdataOutput.tsx";

export class InputParamsController extends ControllerBase {

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

    // is Dimensional mode Checkbox

    InitializeIsDimensionalModeCheckbox(checkbox: InputCheckBoxComponent): void{
        if(!checkbox) {
            console.error("checkbox must be defined");
            return;
        }

        checkbox.onComponentChange.Subscribe((value)=>{
            if(typeof value != "boolean"){
                console.log("isDimensionalModeCheckbox value must be a boolean but: ", typeof value);
                return;
            }

            OptionManager.get().SetIsDimensionalMode(value);
        });
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

    // result image preview
    resultImagePreview: MapDataImagePreviewComponent | undefined = undefined;

    InitializeResultImagePreview(resultImagePreview: MapDataImagePreviewComponent): void {
        if (!resultImagePreview) {
            console.error("ResultImagePreview must be defined");
            return;
        }

        this.resultImagePreview = resultImagePreview;
        MCMapDataManager.get().onMapDataChange.Subscribe((mapData: MCMapData) => {
            this.OnMapDataChange(mapData);
        });
    }


    // InitializeOutputMapData(outputMapdata: ): void {
    //
    // }

    OnMapDataChange(mapData: MCMapData) {
        if (!this.resultImagePreview) {
            console.error("mapData must be defined");
            return;
        }

        // --- To mame: ここに処理あるのよくない ---
        const mapDataDownloader = new MapdataOutput;
        mapDataDownloader.getData(mapData)
        // -----------------------------
        SceneManager.get().SwitchScene(SceneTypes.ResultPreviewScene);
        // this.resultImagePreview.SetMapData(mapData);
    }

    InitializeSelectMapData(selectMapData: SelectMapdataComponent) :void {
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

    constructor(viewInputParams: ViewInputParams) {
        super();
        this.InitializeConvertModeDropdown(viewInputParams.convertModeDropdown);
        this.InitializeSelectBaseImage(viewInputParams.selectBaseImage);
        this.InitializeBaseImagePreview(viewInputParams.baseImagePreview);
        this.InitializeIsDimensionalModeCheckbox(viewInputParams.isDimensionalModeCheckbox);
        this.InitializeMagnification(viewInputParams.magnificationInputComponent);
        this.InitializeConvertButton(viewInputParams.convertButtonComponent);
        this.InitializeProgressBar(viewInputParams.progressBarComponent);
        this.InitializeResultImagePreview(viewInputParams.resultImagePreview);
        this.InitializeSelectMapData(viewInputParams.selectMapdata);
    }
}
