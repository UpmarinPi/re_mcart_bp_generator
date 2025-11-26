import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {SceneManager} from "./Cores/SceneManager.ts";

function App() {
    const [, update] = useState({});

    const sceneManager = SceneManager.get();
    useEffect(() => {
        sceneManager.onUserEffectChange.Subscribe(
            () => {
                update({})
            }
        );

        return ()=>{
            unsubscribe();
        }
    }, []);

    const Scene = sceneManager.GetCurrentScene();
    if (!Scene) {
        return <>Loading...</>;
    }
    return (
        <>
            {Scene.GetRender()}
        </>
    );
}

export default App
