import React from "react";
import { ViewBase } from "../ViewBase.tsx";
import "./ResultPreviewView.css";
import { MapDataImagePreviewComponent } from "../Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import { ButtonComponent, ButtonStyle } from "../Components/ButtonComponent/ButtonComponent.tsx";

namespace ViewResultPreviewIds {
    export const resultImagePreviewId: string = "resultImagePreview";
    export const backButtonId: string = "backButton";
    export const saveButtonId: string = "saveButton";
}

export class ResultPreviewView extends ViewBase {
    resultImagePreview: MapDataImagePreviewComponent;
    backButton: ButtonComponent;
    saveButton: ButtonComponent;

    constructor() {
        super();
        this.backButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.backButtonId, "戻る", ButtonStyle.Back);
        this.saveButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.saveButtonId, "保存", ButtonStyle.Save);
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewResultPreviewIds.resultImagePreviewId);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="result-preview-view">
                <div className="result-preview-view-button-container">
                    {this.backButton.GetRender()}
                    {this.saveButton.GetRender()}
                </div>
                {this.resultImagePreview.GetRender()}
            </div>
        );
    }
}