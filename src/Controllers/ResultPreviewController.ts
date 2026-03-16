import { ControllerBase } from "./ControllerBase.ts";
import { ResultPreviewView } from "../Views/ResultPreviewView/ResultPreviewView.tsx";
import { MCMapDataManager } from "../Datas/MapData/MCMapDataManager.ts";
import type { MapDataImagePreviewComponent } from "../Views/Components/MapDataImagePreviewComponent/MapDataImagePreviewComponent.tsx";
import type { ButtonComponent } from "../Views/Components/ButtonComponent/ButtonComponent.tsx";
import { SceneManager, SceneTypes } from "../Cores/SceneManager.ts";
import { MapdataOutput } from "../IOSystems/MapdataOutput.tsx";

export class ResultPreviewController extends ControllerBase {

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

    constructor(view: ResultPreviewView) {
        super();
        this.InitializeResultImagePreview(view.resultImagePreview);
        this.InitializeBackButton(view.backButton);
        this.InitializeSaveButton(view.saveButton);
    }
}