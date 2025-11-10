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

namespace ViewInputParamIds {
    export const convertModeDropdownId: string = "convertModeDropdown";
    export const selectBaseImageId: string = "selectBaseImageId";
    export const baseImagePreviewId: string = "baseImagePreview";
    export const usingBlockItemComponentId: string = "usingBlockItem";
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
        this.selectMapdata = this.CreateView(SelectMapdataComponent, ViewInputParamIds.selectMapdataId);
        this.importButtonComponent = this.CreateView(ButtonComponent, ViewInputParamIds.imporButtonId, "インポート");
        this.magnificationInputComponent = this.CreateView(InputNumberComponent, ViewInputParamIds.magnificationInputComponentId, 100, "[拡大率]", "拡大率: ", "%");
        this.convertButtonComponent = this.CreateView(ButtonComponent, ViewInputParamIds.convertButtonId, "変換");
        this.progressBarComponent = this.CreateView(ProgressBarComponent, ViewInputParamIds.progressBarId);
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewInputParamIds.resultImagePreviewId);

        this.baseImagePreview.SetSize(0.2);

        
    }

    Render(): React.JSX.Element {
        super.Render();
        return (
            <>
                {this.convertModeDropdown.Render()}
                {this.selectBaseImage.Render()}
                {this.baseImagePreview.Render()}
                {/*{this.usingBlockItemComponent.Render()}*/}
                {this.selectMapdata.Render()}
                {this.importButtonComponent.Render()}
                {this.magnificationInputComponent.Render()}
                {this.convertButtonComponent.Render()}
                {this.progressBarComponent.Render()}
                {this.resultImagePreview.Render()}
            </>
        );
    }
}
