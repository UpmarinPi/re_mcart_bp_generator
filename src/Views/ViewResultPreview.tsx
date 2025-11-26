import React from "react";
import {ViewBase} from "./ViewBase.tsx";
import {MapDataImagePreviewComponent} from "./Components/MapDataImagePreviewComponent.tsx";
import {ButtonComponent} from "./Components/ButtonComponent.tsx";

namespace ViewResultPreviewIds {
    export const resultImagePreviewId: string = "resultImagePreview";
    export const backButtonId: string = "backButton";
}

export class ViewResultPreview extends ViewBase{
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
            <>
                {this.backButton.GetRender()}
                {this.resultImagePreview.GetRender()}
            </>
        );
    }
}