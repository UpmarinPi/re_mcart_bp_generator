export enum PreviewDisplayTypes{
    Map,        // 地図で表示したときの想定画像
    Blocks,     // 各色をブロックに変換
}

export class PreviewOptionData {
    // 表示方法
    displayType: PreviewDisplayTypes = PreviewDisplayTypes.Map;

    // チャンクグリッド線。16x16分割
    showsChunkGrid: boolean = false;

    // 詳細なグリッド線。1x1分割
    showsDetailGrid: boolean = false;
}