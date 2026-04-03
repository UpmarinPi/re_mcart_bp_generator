import React from "react";
import { ViewBase } from "../ViewBase.tsx";
import "./ResultPreviewView.css";
import { ButtonComponent, ButtonStyle } from "../Components/ButtonComponent/ButtonComponent.tsx";
import { BlockPreviewComponent } from "../Components/BlockPreviewComponent/BlockPreviewComponent.tsx";
import { ResultPreviewSideBarComponent } from "./ResultPreviewSideBarComponent/ResultPreviewSideBarComponent.tsx";

namespace ViewResultPreviewIds {
    export const resultBlockPreviewId: string = "resultBlockPreview";
    export const backButtonId: string = "backButton";
    export const saveButtonId: string = "saveButton";
    export const resultPreviewSideBarComponentId: string = "resultPreviewSideBarComponent";
}

export class ResultPreviewView extends ViewBase {
    resultBlockPreview: BlockPreviewComponent;
    backButton: ButtonComponent;
    saveButton: ButtonComponent;
    resultPreviewSideBarComponent: ResultPreviewSideBarComponent;

    constructor() {
        super();
        this.backButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.backButtonId, "戻る", ButtonStyle.Back);
        this.saveButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.saveButtonId, "保存", ButtonStyle.Save);
        this.resultBlockPreview = this.CreateView(BlockPreviewComponent, ViewResultPreviewIds.resultBlockPreviewId);
        this.resultPreviewSideBarComponent = this.CreateView(ResultPreviewSideBarComponent, ViewResultPreviewIds.resultPreviewSideBarComponentId);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="result-preview-view">
                {this.backButton.GetRender()}
                {this.saveButton.GetRender()}
                {this.resultBlockPreview.GetRender()}
                <div className="result-preview-view right">
                    {this.resultPreviewSideBarComponent.GetRender()}
                </div>
            </div>
        );
    }
}