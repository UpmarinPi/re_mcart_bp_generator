import React from "react";
import {ViewBase} from "../ViewBase.tsx";
import "./ResultPreviewView.css";
import {MapDataImagePreviewComponent} from "../Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import {ButtonComponent} from "../Components/ButtonComponent/ButtonComponent.tsx";

namespace ViewResultPreviewIds {
    export const resultImagePreviewId: string = "resultImagePreview";
    export const backButtonId: string = "backButton";
}

export class ResultPreviewView extends ViewBase{
    resultImagePreview: MapDataImagePreviewComponent;
    backButton: ButtonComponent;

    constructor() {
        super();
        this.backButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.backButtonId, "戻る");
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewResultPreviewIds.resultImagePreviewId);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="result-preview-view">
                {this.backButton.GetRender()}
                {this.resultImagePreview.GetRender()}
            </div>
        );
    }
}