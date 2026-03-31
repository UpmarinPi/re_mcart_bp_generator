import React from "react";
import { ViewBase } from "../ViewBase.tsx";
import "./ResultPreviewView.css";
import { MapDataImagePreviewComponent } from "../Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import { ButtonComponent, ButtonStyle } from "../Components/ButtonComponent/ButtonComponent.tsx";
import { BlockPreviewComponent } from "../Components/BlockPreviewComponent/BlockPreviewComponent.tsx";

namespace ViewResultPreviewIds {
    export const resultImagePreviewId: string = "resultImagePreview";
    export const resultBlockPreviewId: string = "resultBlockPreview";
    export const backButtonId: string = "backButton";
    export const saveButtonId: string = "saveButton";
}

export class ResultPreviewView extends ViewBase {
    resultImagePreview: MapDataImagePreviewComponent;
    resultBlockPreview: BlockPreviewComponent;
    backButton: ButtonComponent;
    saveButton: ButtonComponent;

    constructor() {
        super();
        this.backButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.backButtonId, "戻る", ButtonStyle.Back);
        this.saveButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.saveButtonId, "保存", ButtonStyle.Save);
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewResultPreviewIds.resultImagePreviewId);
        this.resultBlockPreview = this.CreateView(BlockPreviewComponent, ViewResultPreviewIds.resultBlockPreviewId);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="result-preview-view">
                {this.backButton.GetRender()}
                {this.saveButton.GetRender()}
                {this.resultBlockPreview.GetRender()}
                <div className="result-preview-view right">
                    {this.resultImagePreview.GetRender()}
                </div>
            </div>
        );
    }
}