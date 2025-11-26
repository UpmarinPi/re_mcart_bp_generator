import {ViewBase} from "./ViewBase";
import React from "react";
import {DropdownComponent} from "./Components/DropdownComponent";
import {SelectImageComponent} from "./Components/InputComponents/SelectImageComponent";
import {ImagePreviewComponent} from "./Components/ImagePreviewComponent";
import {ButtonComponent} from "./Components/ButtonComponent";
import {MapDataImagePreviewComponent} from "./Components/MapDataImagePreviewComponent";
import {ProgressBarComponent} from "./Components/ProgressBarComponent";
import {SelectMapdataComponent} from "./Components/InputComponents/SelectMapdataComponent";
import {InputNumberComponent} from "./Components/InputComponents/InputNumberComponent";
import {InputCheckBoxComponent} from "./Components/InputComponents/InputCheckBoxComponent.tsx";

namespace ViewInputParamIds {
    export const convertModeDropdownId: string = "convertModeDropdown";
    export const selectBaseImageId: string = "selectBaseImageId";
    export const baseImagePreviewId: string = "baseImagePreview";
    export const usingBlockItemComponentId: string = "usingBlockItem";
    export const isDimensionalModeCheckboxId: string = "isDimensionalModeCheckbox";
    export const magnificationInputComponentId: string = "magnificationInputComponent";
    export const convertButtonId: string = "convertButton";
    export const progressBarId: string = "progressBar";
    export const resultImagePreviewId: string = "resultImagePreview";
    export const selectMapdataId: string = "selectMapdataId";
    export const imporButtonId: string = "importButton";
}

export class ViewInputParams extends ViewBase {
    convertModeDropdown: DropdownComponent;
    selectBaseImage: SelectImageComponent;
    baseImagePreview: ImagePreviewComponent;
    // usingBlockItemComponent: SelectColorItemComponent;
    isDimensionalModeCheckbox: InputCheckBoxComponent;
    magnificationInputComponent: InputNumberComponent;
    convertButtonComponent: ButtonComponent;
    progressBarComponent: ProgressBarComponent;
    resultImagePreview: MapDataImagePreviewComponent;
    selectMapdata: SelectMapdataComponent;
    importButtonComponent: ButtonComponent;

    constructor() {
        super();
        this.convertModeDropdown = this.CreateView(DropdownComponent, ViewInputParamIds.convertModeDropdownId);
        this.selectBaseImage = this.CreateView(SelectImageComponent, ViewInputParamIds.selectBaseImageId);
        this.baseImagePreview = this.CreateView(ImagePreviewComponent, ViewInputParamIds.baseImagePreviewId);
        // this.usingBlockItemComponent = this.CreateView(SelectColorItemComponent, ViewInputParamIds.usingBlockItemComponentId, "#ff0000");
        this.isDimensionalModeCheckbox = this.CreateView(InputCheckBoxComponent, ViewInputParamIds.isDimensionalModeCheckboxId, "詳細モード");
        this.selectMapdata = this.CreateView(SelectMapdataComponent, ViewInputParamIds.selectMapdataId);
        this.importButtonComponent = this.CreateView(ButtonComponent, ViewInputParamIds.imporButtonId, "インポート");
        this.magnificationInputComponent = this.CreateView(InputNumberComponent, ViewInputParamIds.magnificationInputComponentId, 100, "[拡大率]", "拡大率: ", "%");
        this.convertButtonComponent = this.CreateView(ButtonComponent, ViewInputParamIds.convertButtonId, "変換");
        this.progressBarComponent = this.CreateView(ProgressBarComponent, ViewInputParamIds.progressBarId);
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewInputParamIds.resultImagePreviewId);

        this.baseImagePreview.SetSize(0.2);

        
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <>
                {this.convertModeDropdown.GetRender()}
                {this.selectBaseImage.GetRender()}
                {this.baseImagePreview.GetRender()}
                {/*{this.usingBlockItemComponent.Render()}*/}
                {this.isDimensionalModeCheckbox.GetRender()}
                {this.selectMapdata.GetRender()}
                {this.importButtonComponent.GetRender()}
                {this.magnificationInputComponent.GetRender()}
                {this.convertButtonComponent.GetRender()}
                {this.progressBarComponent.GetRender()}
                {this.resultImagePreview.GetRender()}
            </>
        );
    }
}
