import { AppConfig } from "../AppConfig";

/**
 * アプリケーション起動時の初期化処理を担当するクラス
 */
export class AppInitializer {
    /**
     * アプリ起動時に1度だけ呼び出す初期化メソッド
     */
    static initialize() {
        // AppConfigの設定情報をブラウザの表示に適用する
        document.title = AppConfig.title;

        // ファビコンの設定情報を適用する
        const faviconLink = document.getElementById("favicon") as HTMLLinkElement | null;
        if (faviconLink) {
            faviconLink.href = AppConfig.favicon;
        }

        // 必要に応じて、他のグローバルな初期化処理（ログの設定、アナリティクスの初期化など）をここに追加します
    }
}
