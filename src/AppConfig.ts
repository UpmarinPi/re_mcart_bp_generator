import { SceneTypes } from "./Scenes/SceneTypes.ts";

/**
 * アプリケーション全体の設定項目を一元管理するファイル
 */
export const AppConfig = {
    // ブラウザタイトル
    title: "hogehoge",
    initialSceneType: SceneTypes.InputParamsScene,
    previewDefaultSize: 16, // プレビューの一辺のサイズ。チャンク数に設定
} as const;
