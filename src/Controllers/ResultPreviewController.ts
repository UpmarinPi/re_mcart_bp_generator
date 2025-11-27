import {ControllerBase} from "./ControllerBase.ts";
import {ViewResultPreview} from "../Views/ViewResultPreview.tsx";
import {MCMapDataManager} from "../Datas/MapData/MCMapDataManager.ts";
import type {MapDataImagePreviewComponent} from "../Views/Components/MapDataImagePreviewComponent.tsx";
import type {ButtonComponent} from "../Views/Components/ButtonComponent.tsx";
import {SceneManager, SceneTypes} from "../Cores/SceneManager.ts";

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

    // result image preview

    InitializeResultImagePreview(resultImagePreview: MapDataImagePreviewComponent): void {
        if (!resultImagePreview) {
            console.error("ResultImagePreview must be defined");
            return;
        }

        resultImagePreview.SetMapData(MCMapDataManager.get().mapData);
    }

    constructor(view: ViewResultPreview) {
        super();
        this.InitializeResultImagePreview(view.resultImagePreview);
        this.InitializeBackButton(view.backButton);
    }
}