import { useEffect, useState } from 'react'
import './App.css'
import { SceneManager } from "./Cores/SceneManager.ts";
import type { SceneBase } from "./Scenes/SceneBase.ts";

function App() {
    const [, update] = useState({});

    const sceneManager = SceneManager.get();
    useEffect(() => {
        sceneManager.onUserEffectChange.Subscribe(
            () => {
                update({});
            }
        );
    }, []);

    // 毎回のレンダー確定後に実行され、SceneManagerに開始要求があれば発火させる
    useEffect(() => {
        if (sceneManager.pendingRenderFinished) {
            sceneManager.pendingRenderFinished = false;
            sceneManager.onRenderFinished.notify();
        }
    });

    const scene: SceneBase | undefined = sceneManager.GetCurrentScene();
    if (!scene) {
        return <>Loading...</>;
    }

    return (
        <>
            {scene.GetRender()}
        </>
    );
}

export default App
