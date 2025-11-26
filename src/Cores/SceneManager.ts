import {Singleton} from "./Singleton";
import {SceneBase} from "../Scenes/SceneBase";
import {InputParamsScene} from "../Scenes/InputParamsScene.ts";
import {ObserverSubject} from "./Observer.ts";
import {ResultPreviewScene} from "../Scenes/ResultPreviewScene.ts";

export enum SceneTypes {
    InputParamsScene,
    ResultPreviewScene,
}
export class SceneManager extends Singleton {
    onUserEffectChange: ObserverSubject = new ObserverSubject();
    currentSceneType: SceneTypes = SceneTypes.InputParamsScene;
    SceneTypeToScene: Map<SceneTypes, SceneBase> = new Map();

    // scene登録
    private RegisterScenes(){
        this.SceneTypeToScene.set(SceneTypes.InputParamsScene, new InputParamsScene());
        this.SceneTypeToScene.set(SceneTypes.ResultPreviewScene, new ResultPreviewScene());
    }

    constructor() {
        super();
        this.RegisterScenes();
        this.StartScene(SceneTypes.InputParamsScene);
    }

    StartScene(sceneType: SceneTypes): void {
        this.currentSceneType = sceneType;
        this.onUserEffectChange.notify();
    }

    // start sceneと同じ
    SwitchScene(sceneType: SceneTypes): void {
        this.StartScene(sceneType);
    }

    GetCurrentScene(): SceneBase | undefined {
        return this.SceneTypeToScene.get(this.currentSceneType);
    }


}