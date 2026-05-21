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
    export const moveAboveChunkButtonId: string = "moveAboveChunkButton";
    export const moveBelowChunkButtonId: string = "moveBelowChunkButton";
    export const moveLeftChunkButtonId: string = "moveLeftChunkButton";
    export const moveRightChunkButtonId: string = "moveRightChunkButton";
    export const resultPreviewSideBarComponentId: string = "resultPreviewSideBarComponent";
}

export class ResultPreviewView extends ViewBase {
    resultBlockPreview: BlockPreviewComponent;
    backButton: ButtonComponent;
    saveButton: ButtonComponent;
    moveAboveChunkButton: ButtonComponent;
    moveBelowChunkButton: ButtonComponent;
    moveLeftChunkButton: ButtonComponent;
    moveRightChunkButton: ButtonComponent;
    resultPreviewSideBarComponent: ResultPreviewSideBarComponent;

    constructor() {
        super();
        this.backButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.backButtonId, "戻る", ButtonStyle.Back);
        this.saveButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.saveButtonId, "保存", ButtonStyle.Save);
        this.moveAboveChunkButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.moveAboveChunkButtonId, "\u2191", ButtonStyle.Default);
        this.moveBelowChunkButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.moveBelowChunkButtonId, "\u2193", ButtonStyle.Default);
        this.moveLeftChunkButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.moveLeftChunkButtonId, "\u2190", ButtonStyle.Default);
        this.moveRightChunkButton = this.CreateView(ButtonComponent, ViewResultPreviewIds.moveRightChunkButtonId, "\u2192", ButtonStyle.Default);
        this.resultBlockPreview = this.CreateView(BlockPreviewComponent, ViewResultPreviewIds.resultBlockPreviewId);
        this.resultPreviewSideBarComponent = this.CreateView(ResultPreviewSideBarComponent, ViewResultPreviewIds.resultPreviewSideBarComponentId);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="result-preview-view">
                <div className="result-preview-view-option-buttons">
                    {this.backButton.GetRender()}
                    {this.saveButton.GetRender()}
                </div>
                <div className="result-preview-view-preview">
                    <div className="preview-nav-top">{this.moveAboveChunkButton.GetRender()}</div>
                    <div className="preview-nav-left">{this.moveLeftChunkButton.GetRender()}</div>
                    <div className="preview-content">{this.resultBlockPreview.GetRender()}</div>
                    <div className="preview-nav-right">{this.moveRightChunkButton.GetRender()}</div>
                    <div className="preview-nav-bottom">{this.moveBelowChunkButton.GetRender()}</div>
                </div>
                <div className="result-preview-view right">
                    {this.resultPreviewSideBarComponent.GetRender()}
                </div>
            </div>
        );
    }
}