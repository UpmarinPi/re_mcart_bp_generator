import { SceneBase } from "./SceneBase";
import { InputParamsView } from "../Views/InputParamsView/InputParamsView.tsx";
import { InputParamsController } from "../Controllers/InputParamsController";

export class InputParamsScene extends SceneBase {

    GetScenePathName(): string {
        return "/";
    }

    constructor() {
        super();
        this.InitializeView(InputParamsView);
        this.controller = new InputParamsController(this.view as InputParamsView);
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