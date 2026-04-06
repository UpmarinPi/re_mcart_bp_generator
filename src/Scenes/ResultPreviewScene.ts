import { SceneBase } from "./SceneBase.ts";
import { ResultPreviewView } from "../Views/ResultPreviewView/ResultPreviewView.tsx";
import { ResultPreviewController } from "../Controllers/ResultPreviewController.ts";

export class ResultPreviewScene extends SceneBase {
    GetScenePathName(): string {
        return "/result";
    }

    constructor() {
        super();
        this.InitializeView(ResultPreviewView);
        this.controller = new ResultPreviewController(this.view as ResultPreviewView);
    }

    override NotifyToPostRender() {
        if (this.view) {
            this.view.postRender.notify();
        }
        if (this.controller) {
            this.controller.Reload();
        }
    }
}