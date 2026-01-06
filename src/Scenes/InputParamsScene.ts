import {SceneBase} from "./SceneBase";
import {InputParamsView} from "../Views/InputParamsView.tsx";
import {InputParamsController} from "../Controllers/InputParamsController";

export class InputParamsScene extends SceneBase {

    constructor() {
        super();
        this.InitializeView(InputParamsView);
        this.controller = new InputParamsController(this.view as InputParamsView);
    }

    override NotifyToPostRender() {
        if(!this.view){
            return;
        }
        this.view.postRender.notify();
    }
}