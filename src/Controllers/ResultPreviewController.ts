import { ControllerBase } from "./ControllerBase.ts";
import { ResultPreviewView } from "../Views/ResultPreviewView/ResultPreviewView.tsx";
import { MCMapDataManager } from "../Datas/MapData/MCMapDataManager.ts";
import type { MapDataImagePreviewComponent } from "../Views/Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import type { ButtonComponent } from "../Views/Components/ButtonComponent/ButtonComponent.tsx";
import { SceneManager } from "../Cores/SceneManager.ts";
import { SceneTypes } from "../Scenes/SceneTypes.ts";
import { MapdataOutput } from "../IOSystems/MapdataOutput.tsx";
import type { ResultPreviewSideBarComponent } from "../Views/ResultPreviewView/ResultPreviewSideBarComponent/ResultPreviewSideBarComponent.tsx";
import { PreviewScaleManager } from "../ResultPreviews/PreviewScaleManager.ts";
import type { MCMapData } from "../Datas/MapData/MCMapData.ts";
import { BlockPreviewManager } from "../ResultPreviews/BlockPreviewManager.ts";
import type { BlockData } from "../Datas/Repositories/BlockDataRepository.ts";
import type { BlockPreviewComponent } from "../Views/Components/BlockPreviewComponent/BlockPreviewComponent.tsx";

export class ResultPreviewController extends ControllerBase {

    private resultPreviewView: ResultPreviewView | undefined = undefined;

    private blockPreviewComponent: BlockPreviewComponent | undefined = undefined;

    private InitializeBlockPreview(blockPreviewComponent: BlockPreviewComponent): void {
        if (!blockPreviewComponent) {
            console.error("blockPreview must be defined");
            return;
        }
        this.blockPreviewComponent = blockPreviewComponent;
        const blockPreviewManager = BlockPreviewManager.get();
        blockPreviewManager.onPreviewBlocksUpdated.Subscribe(
            (blockData: BlockData[][]) => {
                this.OnBlockPreviewUpdate(blockData);
            }
        );
        blockPreviewManager.onPreviewPosUpdated.Subscribe(
            (pos: [number, number, number]) => {
                this.OnBlockPreviewPosUpdate(pos);
            }
        );
        this.SetBlockPreviewComponentSide(blockPreviewManager.GetPreviewSize());
    }

    private OnBlockPreviewUpdate(blockData: BlockData[][]): void {
        this.blockPreviewComponent?.SetBlockDatas(blockData);
    }

    private OnBlockPreviewPosUpdate([xPos, yPos, size]: [number, number, number]): void {
        this.SetBlockPreviewComponentSide(size);
    }

    private SetBlockPreviewComponentSide(size: number): void {
        this.blockPreviewComponent?.UpdateSide(size);
    }

    override Reload(): void {
        super.Reload();
        this.ReloadResultImagePreview();
        this.OnMapDataUpdated(MCMapDataManager.get().mapData);
    }

    public OnMapDataUpdated(mapData: MCMapData): void {
        PreviewScaleManager.get().OnMapDataUpdated(mapData);
    }

    private ReloadResultImagePreview(): void {
        if (this.resultPreviewView) {
            this.resultPreviewView.resultPreviewSideBarComponent.resultImagePreview.SetMapData(MCMapDataManager.get().mapData);
        }
        if (this.blockPreviewComponent) {
            const blockPreviewManager = BlockPreviewManager.get();
            this.blockPreviewComponent.SetBlockDatas(blockPreviewManager.GetPreviewBlocks());
        }
    }

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
        PreviewScaleManager.get().onScaleChanged.Subscribe(
            ([scale, isZoomInMaxed, isZoomOutMaxed]: [number, boolean, boolean]) => {
                this.OnScaleChanged(scale, isZoomInMaxed, isZoomOutMaxed);
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

    // set one scale button

    private InitializeSetHundredPercentScaleButton(setHundredPercentScaleButton: ButtonComponent): void {
        if (!setHundredPercentScaleButton) {
            console.error("setHundredPercentScaleButton must be defined");
            return;
        }
        setHundredPercentScaleButton.onComponentChange.Subscribe(
            () => {
                this.OnSetHundredPercentScaleButtonPressed();
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
        this.InitializeSetHundredPercentScaleButton(resultPreviewSideBar.setHundredPercentScaleButton);
        this.InitializeToggleHideButton(resultPreviewSideBar.toggleHideButton);
    }

    private OnZoomInButtonPressed(): void {
        PreviewScaleManager.get().Zoomin();
    }

    private OnZoomOutButtonPressed(): void {
        PreviewScaleManager.get().Zoomout();
    }

    private OnFitScaleButtonPressed(): void {
        const width: number = this.resultPreviewView?.resultPreviewSideBarComponent.resultImagePreview.width ?? 0;
        PreviewScaleManager.get().FitScale(width);
    }

    private OnSetHundredPercentScaleButtonPressed(): void {
        PreviewScaleManager.get().SetScale(1.0);
    }

    private OnScaleChanged(scale: number, isZoomInMaxed: boolean, isZoomOutMaxed: boolean): void {
        this.resultPreviewView?.resultPreviewSideBarComponent.resultImagePreview.SetScale(scale);
        // this.resultPreviewView?.resultPreviewSideBarComponent.zoomInButton.SetDisabled(isZoomInMaxed);
        // this.resultPreviewView?.resultPreviewSideBarComponent.zoomOutButton.SetDisabled(isZoomOutMaxed);
    }

    private OnToggleHideButtonPressed(): void {
        this.resultPreviewView?.resultPreviewSideBarComponent.TogglePreviewContentVisibility();
    }

    constructor(view: ResultPreviewView) {
        super();
        this.resultPreviewView = view;
        this.InitializeBlockPreview(view.resultBlockPreview);
        this.InitializeBackButton(view.backButton);
        this.InitializeSaveButton(view.saveButton);
        this.InitializeResultPreviewSideBar(view.resultPreviewSideBarComponent);
    }
}