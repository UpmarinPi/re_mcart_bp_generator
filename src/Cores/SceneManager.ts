import { Singleton } from "./Singleton";
import { SceneBase } from "../Scenes/SceneBase";
import { InputParamsScene } from "../Scenes/InputParamsScene.ts";
import { ObserverSubject } from "./Observer.ts";
import { ResultPreviewScene } from "../Scenes/ResultPreviewScene.ts";
import { AppConfig } from "../AppConfig.ts";
import { SceneTypes } from "../Scenes/SceneTypes.ts";

export class SceneManager extends Singleton {
    onUserEffectChange: ObserverSubject = new ObserverSubject();
    onRenderFinished: ObserverSubject = new ObserverSubject();
    currentSceneType: SceneTypes = SceneTypes.InputParamsScene;
    SceneTypeToScene: Map<SceneTypes, SceneBase> = new Map();
    SceneHashToSceneType: Map<string, SceneTypes> = new Map();

    // scene登録
    private RegisterScenes() {
        // input params scene
        let inputParamsScene = new InputParamsScene();
        this.SceneTypeToScene.set(SceneTypes.InputParamsScene, inputParamsScene);
        this.SceneHashToSceneType.set(inputParamsScene.GetScenePathName(), SceneTypes.InputParamsScene);

        // result preview scene
        let resultPreviewScene = new ResultPreviewScene();
        this.SceneTypeToScene.set(SceneTypes.ResultPreviewScene, resultPreviewScene);
        this.SceneHashToSceneType.set(resultPreviewScene.GetScenePathName(), SceneTypes.ResultPreviewScene);
    }

    private constructor() {
        super();
        this.RegisterScenes();

        // 期待されるSceneをURLハッシュから判定する
        const currentHash = window.location.hash || "#/";
        this.currentSceneType = AppConfig.initialSceneType;

        const sceneType = this.SceneHashToSceneType.get(currentHash);
        if (sceneType !== undefined) {
            this.currentSceneType = sceneType;
        }

        // popstateイベントでブラウザの戻る進むボタンに対応
        window.addEventListener("popstate", (e) => {
            if (e.state && e.state.sceneType !== undefined) {
                this.StartScene(e.state.sceneType, false);
            }
        });

        // 初期状態をHistory APIに登録
        const initialScenePath = this.SceneTypeToScene.get(this.currentSceneType)?.GetScenePathName() || "/";
        window.history.replaceState({ sceneType: this.currentSceneType }, "", "#" + initialScenePath);

        this.StartScene(this.currentSceneType, false);
        this.onRenderFinished.Subscribe(() => {
            const scene = this.SceneTypeToScene.get(this.currentSceneType);
            if (!scene) {
                return;
            }
            scene.NotifyToPostRender();
        });
    }

    StartScene(sceneType: SceneTypes, pushHistory: boolean = true): void {
        this.currentSceneType = sceneType;
        if (pushHistory) {
            const scene = this.SceneTypeToScene.get(sceneType);
            if (scene) {
                window.history.pushState({ sceneType }, "", "#" + scene.GetScenePathName());
            }
        }

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