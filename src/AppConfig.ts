import { SceneTypes } from "./Scenes/SceneTypes.ts";
import faviconPath from "./assets/fletching_table_top.svg";

/**
 * アプリケーション全体の設定項目を一元管理するファイル
 */
export const AppConfig = {
    // ブラウザタイトル
    title: "MC BP Generator",
    initialSceneType: SceneTypes.InputParamsScene,
    previewDefaultSize: 16, // プレビューの一辺のサイズ。チャンク数に設定
    favicon: faviconPath,
} as const;
