import {SceneBase} from "./SceneBase.ts";
import {ViewResultPreview} from "../Views/ViewResultPreview.tsx";
import {ResultPreviewController} from "../Controllers/ResultPreviewController.ts";

export class ResultPreviewScene extends SceneBase{
    constructor() {
        super();
        this.InitializeView(ViewResultPreview);
        this._resultPreviewController = new ResultPreviewController(this.view as ViewResultPreview);
    }

    // controllers
    _resultPreviewController: ResultPreviewController;
}