import { Singleton } from "./Singleton";
import { SceneBase } from "../Scenes/SceneBase";
import { InputParamsScene } from "../Scenes/InputParamsScene.ts";
import { ObserverSubject } from "./Observer.ts";
import { ResultPreviewScene } from "../Scenes/ResultPreviewScene.ts";
import { AppConfig } from "../AppConfig.ts";
import { SceneTypes } from "../Scenes/SceneTypes.ts";

export class SceneManager extends Singleton {
    // 画面の再描画リクエスト
    onUserEffectChange: ObserverSubject = new ObserverSubject();
    // 画面の再描画完了通知
    onRenderFinished: ObserverSubject = new ObserverSubject();
    // 画面の再描画完了待機フラグ
    pendingRenderFinished: boolean = false;
    currentSceneType: SceneTypes = SceneTypes.InputParamsScene;
    SceneTypeToScene: Map<SceneTypes, SceneBase> = new Map();
    SceneHashToSceneType: Map<string, SceneTypes> = new Map();

    // scene登録
    private RegisterSceneHashes() {
        // パス名とSceneTypeのマッピングだけを先に行う
        this.SceneHashToSceneType.set("/", SceneTypes.InputParamsScene);
        this.SceneHashToSceneType.set("/result", SceneTypes.ResultPreviewScene);
    }

    // 遅延初期化: Sceneが必要になったときに初めてインスタンス化する
    private GetOrCreateScene(sceneType: SceneTypes): SceneBase {
        if (this.SceneTypeToScene.has(sceneType)) {
            return this.SceneTypeToScene.get(sceneType)!;
        }

        let newScene: SceneBase;
        switch (sceneType) {
            case SceneTypes.InputParamsScene:
                newScene = new InputParamsScene();
                break;
            case SceneTypes.ResultPreviewScene:
                newScene = new ResultPreviewScene();
                break;
            default:
                throw new Error("Unknown SceneType: " + sceneType);
        }

        if (newScene.view) {
            newScene.view.requestsRenderUpdate.Subscribe(() => {
                this.onUserEffectChange.notify();
            });
        }
        this.SceneTypeToScene.set(sceneType, newScene);
        return newScene;
    }

    private constructor() {
        super();
        this.RegisterSceneHashes();

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
        const initialScenePath = this.GetOrCreateScene(this.currentSceneType).GetScenePathName();
        window.history.replaceState({ sceneType: this.currentSceneType }, "", "#" + initialScenePath);

        this.onRenderFinished.Subscribe(() => {
            const scene = this.GetOrCreateScene(this.currentSceneType);
            scene.NotifyToPostRender();
        });
        this.StartScene(this.currentSceneType, false);
    }

    StartScene(sceneType: SceneTypes, pushHistory: boolean = true): void {
        this.currentSceneType = sceneType;
        const scene = this.GetOrCreateScene(sceneType);
        if (scene) {
            scene.ReloadScene();
            if (pushHistory) {
                window.history.pushState({ sceneType }, "", "#" + scene.GetScenePathName());
            }
        }

        console.log("StartScene", sceneType);

        this.pendingRenderFinished = true;
        this.onUserEffectChange.notify();
    }

    // start sceneと同じ
    SwitchScene(sceneType: SceneTypes): void {
        this.StartScene(sceneType);
    }

    GetCurrentScene(): SceneBase | undefined {
        return this.GetOrCreateScene(this.currentSceneType);
    }


}