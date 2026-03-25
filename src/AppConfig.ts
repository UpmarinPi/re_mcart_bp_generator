import { SceneTypes } from "./Scenes/SceneTypes.ts";

/**
 * アプリケーション全体の設定項目を一元管理するファイル
 */
export const AppConfig = {
    // ブラウザタイトル
    title: "hogehoge",
    initialSceneType: SceneTypes.InputParamsScene,
} as const;
