import {SceneBase} from "./SceneBase";
import {ViewInputParams} from "../Views/ViewInputParams";
import {InputParamsController} from "../Controllers/InputParamsController";

export class InputParamsScene extends SceneBase {

    constructor() {
        super();
        this.InitializeView(ViewInputParams);
        this.controller = new InputParamsController(this.view as ViewInputParams);
    }

    override NotifyToPostRender() {
        if(!this.view){
            return;
        }
        this.view.postRender.notify();
    }
}