import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {SceneManager} from "./Cores/SceneManager.ts";
import type {SceneBase} from "./Scenes/SceneBase.ts";

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

    const scene: SceneBase | undefined = sceneManager.GetCurrentScene();
    if (!scene) {
        return <>Loading...</>;
    }

    useEffect(() => {
        sceneManager.onRenderFinished.notify();
    }, [scene]);
    return (
        <>
            {scene.GetRender()}
        </>
    );
}

export default App
