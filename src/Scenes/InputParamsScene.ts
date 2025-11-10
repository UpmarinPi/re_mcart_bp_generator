import {SceneBase} from "./SceneBase";
import {ViewInputParams} from "../Views/ViewInputParams";
import {InputParamsController} from "../Controllers/InputParamsController";

export class InputParamsScene extends SceneBase{

    constructor() {
        super();
        this.InitializeView(ViewInputParams);
        this._inputParamsController = new InputParamsController(this.view as ViewInputParams);
    }

    // controllers
    _inputParamsController: InputParamsController;
}