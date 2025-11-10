import {Singleton} from "./Singleton";
import {SceneManager} from "./SceneManager";

export class AsynchronousSystem extends Singleton {

    // while, for文などのループ回数の同期処理許容量
    private static renderLoopCapacity: number = 10000;

    async RequestUpdatingRender(loopCount: number){
        // ループ回数が規定値以下の場合は描画更新を行わない
        if(loopCount % AsynchronousSystem.renderLoopCapacity !== 0){
            return;
        }
        await this.UpdateRender();
    }

    async UpdateRender() {
        const currentScene = SceneManager.get().scene;
        if (!currentScene) {
            return;
        }

        currentScene.UpdateRender();
        await new Promise(requestAnimationFrame);
    }
}
