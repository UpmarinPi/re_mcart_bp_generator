import {Singleton} from "./Singleton";
import {SceneBase} from "../Scenes/SceneBase";

export class SceneManager extends Singleton{
    private set scene(value: SceneBase | undefined) {
        this._scene = value;
    }
    get scene(): SceneBase | undefined {
        return this._scene;
    }
    private _scene: SceneBase | undefined;


    StartScene<T extends SceneBase>(sceneType: new () => T): void{
        this.scene = new sceneType();
    }
    SwitchScene<T extends SceneBase>(sceneType: new () => T): void{
        this.scene = new sceneType();
    }
}