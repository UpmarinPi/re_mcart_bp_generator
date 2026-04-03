import { ControllerBase } from "./ControllerBase.ts";
import { ResultPreviewView } from "../Views/ResultPreviewView/ResultPreviewView.tsx";
import { MCMapDataManager } from "../Datas/MapData/MCMapDataManager.ts";
import type { MapDataImagePreviewComponent } from "../Views/Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import type { ButtonComponent } from "../Views/Components/ButtonComponent/ButtonComponent.tsx";
import { SceneManager } from "../Cores/SceneManager.ts";
import { SceneTypes } from "../Scenes/SceneTypes.ts";
import { MapdataOutput } from "../IOSystems/MapdataOutput.tsx";
import type { ResultPreviewSideBarComponent } from "../Views/ResultPreviewView/ResultPreviewSideBarComponent/ResultPreviewSideBarComponent.tsx";

export class ResultPreviewController extends ControllerBase {

    private resultPreviewView: ResultPreviewView | undefined = undefined;

    // back button
    InitializeBackButton(backButton: ButtonComponent): void {
        if (!backButton) {
            console.error("backButton must be defined");
            return;
        }
        backButton.onComponentChange.Subscribe(
            () => {
                this.OnBackButtonPressed();
            }
        );
    }

    private OnBackButtonPressed(): void {
        // 直打ちせずに、"戻る"用のscene操作は必要？
        SceneManager.get().SwitchScene(SceneTypes.InputParamsScene);
    }

    // save button
    InitializeSaveButton(saveButton: ButtonComponent): void {
        if (!saveButton) {
            console.error("saveButton must be defined");
            return;
        }
        saveButton.onComponentChange.Subscribe(
            () => {
                this.OnSaveButtonPressed();
            }
        );
    }

    private OnSaveButtonPressed(): void {
        const mapData = MCMapDataManager.get().mapData;
        if (!mapData) return;
        const mapDataDownloader = new MapdataOutput();
        mapDataDownloader.getData(mapData);
    }

    // result image preview

    InitializeResultImagePreview(resultImagePreview: MapDataImagePreviewComponent): void {
        if (!resultImagePreview) {
            console.error("ResultImagePreview must be defined");
            return;
        }

        resultImagePreview.SetMapData(MCMapDataManager.get().mapData);
    }

    // toggle hide button

    private InitializeToggleHideButton(toggleHideButton: ButtonComponent): void {
        if (!toggleHideButton) {
            console.error("toggleHideButton must be defined");
            return;
        }
        toggleHideButton.onComponentChange.Subscribe(
            () => {
                this.OnToggleHideButtonPressed();
            }
        );
    }

    // zoom in button

    private InitializeZoomInButton(zoomInButton: ButtonComponent): void {
        if (!zoomInButton) {
            console.error("zoomInButton must be defined");
            return;
        }
        zoomInButton.onComponentChange.Subscribe(
            () => {
                this.OnZoomInButtonPressed();
            }
        );
    }

    // zoom out button

    private InitializeZoomOutButton(zoomOutButton: ButtonComponent): void {
        if (!zoomOutButton) {
            console.error("zoomOutButton must be defined");
            return;
        }
        zoomOutButton.onComponentChange.Subscribe(
            () => {
                this.OnZoomOutButtonPressed();
            }
        );
    }

    // fit scale button

    private InitializeFitScaleButton(fitScaleButton: ButtonComponent): void {
        if (!fitScaleButton) {
            console.error("fitScaleButton must be defined");
            return;
        }
        fitScaleButton.onComponentChange.Subscribe(
            () => {
                this.OnFitScaleButtonPressed();
            }
        );
    }

    // result preview side bar

    private resultPreviewSideBar: ResultPreviewSideBarComponent | undefined = undefined;

    InitializeResultPreviewSideBar(resultPreviewSideBar: ResultPreviewSideBarComponent): void {
        if (!resultPreviewSideBar) {
            console.error("ResultPreviewSideBar must be defined");
            return;
        }
        this.InitializeResultImagePreview(resultPreviewSideBar.resultImagePreview);
        this.InitializeZoomInButton(resultPreviewSideBar.zoomInButton);
        this.InitializeZoomOutButton(resultPreviewSideBar.zoomOutButton);
        this.InitializeFitScaleButton(resultPreviewSideBar.fitScaleButton);
        this.InitializeToggleHideButton(resultPreviewSideBar.toggleHideButton);
    }

    private OnZoomInButtonPressed(): void {
        // this.resultPreviewView?.resultPreviewSideBarComponent.resultImagePreview.ZoomIn();
    }

    private OnZoomOutButtonPressed(): void {
        // this.resultPreviewView?.resultPreviewSideBarComponent.resultImagePreview.ZoomOut();
    }

    private OnFitScaleButtonPressed(): void {
        this.resultPreviewView?.resultPreviewSideBarComponent.resultImagePreview.FitScale();
    }

    private OnToggleHideButtonPressed(): void {
        this.resultPreviewView?.resultPreviewSideBarComponent.TogglePreviewContentVisibility();
    }

    constructor(view: ResultPreviewView) {
        super();
        this.resultPreviewView = view;
        this.InitializeBackButton(view.backButton);
        this.InitializeSaveButton(view.saveButton);
        this.InitializeResultPreviewSideBar(view.resultPreviewSideBarComponent);
    }
}