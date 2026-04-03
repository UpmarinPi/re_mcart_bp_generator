import { ButtonComponent, ButtonStyle } from "../../Components/ButtonComponent/ButtonComponent";
import { ComponentBase } from "../../Components/ComponentBase";
import { MapDataImagePreviewComponent } from "../../Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent";
import "./ResultPreviewSideBarComponent.css";

namespace ViewResultPreviewSideBarComponentIds {
    export const resultImagePreviewId: string = "resultImagePreview";
    export const zoomInButtonId: string = "zoomInButton";
    export const zoomOutButtonId: string = "zoomOutButton";
    export const fitScaleButtonId: string = "fitScaleButton";
    export const toggleHideButtonId: string = "toggleHideButton";
}

export class ResultPreviewSideBarComponent extends ComponentBase {
    resultImagePreview: MapDataImagePreviewComponent;
    zoomInButton: ButtonComponent;
    zoomOutButton: ButtonComponent;
    fitScaleButton: ButtonComponent;
    setHundredPercentScaleButton: ButtonComponent;
    toggleHideButton: ButtonComponent;

    constructor(id: string) {
        super(id);
        this.resultImagePreview = this.CreateView(MapDataImagePreviewComponent, ViewResultPreviewSideBarComponentIds.resultImagePreviewId);
        this.zoomInButton = this.CreateView(ButtonComponent, ViewResultPreviewSideBarComponentIds.zoomInButtonId, "+", ButtonStyle.ZoomIn);
        this.zoomOutButton = this.CreateView(ButtonComponent, ViewResultPreviewSideBarComponentIds.zoomOutButtonId, "-", ButtonStyle.ZoomOut);
        this.fitScaleButton = this.CreateView(ButtonComponent, ViewResultPreviewSideBarComponentIds.fitScaleButtonId, "[]", ButtonStyle.Default);
        this.setHundredPercentScaleButton = this.CreateView(ButtonComponent, ViewResultPreviewSideBarComponentIds.fitScaleButtonId, "100%", ButtonStyle.Default);
        this.toggleHideButton = this.CreateView(ButtonComponent, ViewResultPreviewSideBarComponentIds.toggleHideButtonId, "隠す", ButtonStyle.Default);
    }

    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className={`result-preview-side-bar-component ${this.isPreviewContentVisible ? "" : "hidden"}`}>
                <div className="result-preview-side-bar-component-content">
                    {this.resultImagePreview.GetRender()}
                    <div className="result-preview-side-bar-component-buttons">
                        {this.zoomInButton.GetRender()}
                        {this.zoomOutButton.GetRender()}
                        {this.fitScaleButton.GetRender()}
                        {this.setHundredPercentScaleButton.GetRender()}
                    </div>
                </div>
                {this.toggleHideButton.GetRender()}
            </div>
        );
    }

    private isPreviewContentVisible: boolean = true;

    public TogglePreviewContentVisibility() {
        this.isPreviewContentVisible = !this.isPreviewContentVisible;
        this.toggleHideButton.displayText = this.isPreviewContentVisible ? "隠す" : "開く";
        this.requestsRenderUpdate.notify();
        console.log("toggle");
    }
}