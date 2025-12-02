import {ComponentBase} from "./ComponentBase.ts";
import React from "react";
import {MCMapData} from "../../Datas/MapData/MCMapData.ts";
import {ERepositoryIds, RepositoryManager} from "../../Datas/Repositories/RepositoryManager.ts";
import type {BlockDataRepository} from "../../Datas/Repositories/BlockDataRepository.ts";
import {RGBColor} from "../../Cores/Color.ts";

export class MapDataBlocksPreviewComponent extends ComponentBase {
    mapData: MCMapData = new MCMapData();

    // mapdataBlocksPreviewの一辺の長さ
    // 実際は上下左右に隣のブロックをプレビューで足すので+2になる
    previewMapLength: number = 16;
    // プレビューしたい座標の左上座標
    previewTopLeftCoords: [number, number] = [0, 0];

    // 16px想定
    texSize: number = 16;

    UpdateCanvas() {
        const canvas = this.GetMyRender() as HTMLCanvasElement;
        if (!canvas) {
            console.warn("no canvas");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }


        const canvasSize = (this.previewMapLength + 2) * this.texSize;
        const width = canvasSize;
        const height = canvasSize;
        canvas.width = width;
        canvas.height = height;

        // キャンバスを初期化
        ctx.clearRect(0, 0, width, height);

        // map dataが無効な値の場合、中身を作らずに削除
        if (this.mapData.width <= 0 || this.mapData.height <= 0) {
            return;
        }

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dataNumber = this.mapData.map[y][x];
                const index = (y * width + x) * 4;
                let blockSrc: string | undefined = undefined;
                const blockId = this.mapData.mapToBlockId.get(dataNumber);
                if (this.mapData.mapToColorId && blockId) {
                    blockSrc = this.GetBlockSrcById(blockId);
                }
                if (!blockSrc) {
                    blockSrc = "";
                }

                // todo: block画像を16x16想定で挿入してみよう
                // data[index] = color.r;      // r
                // data[index + 1] = color.g;  // g
                // data[index + 2] = color.b;  // b
                // data[index + 3] = 255;      // a
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    private async DrawImage(ctx: CanvasRenderingContext2D, [x, y]: [number, number], drawSrc: string) {
        const image = new Image();
        image.src = drawSrc;
        image.onload = () => {
            ctx.drawImage(image, this.texSize * x, this.texSize * y, this.texSize, this.texSize);
        }
    }

    private async DrawEmptyImage(ctx: CanvasRenderingContext2D, [x, y]: [number, number]) {
        const color: RGBColor = new RGBColor(255, 255, 255);
        ctx.fillStyle = color.ToRgb256String();
        ctx.fillRect(this.texSize * x, this.texSize * y, this.texSize, this.texSize);
    }

    private GetBlockSrcById(id: string): string | undefined {
        const blockDataRepository = RepositoryManager.get().GetRepository<BlockDataRepository>(ERepositoryIds.BlockData);
        if (!blockDataRepository) {
            return undefined;
        }

        return blockDataRepository.GetBlockImageSrc(id);
    }

    private GetCanViewBeyondLeft(): boolean {
        return (this.previewTopLeftCoords[0] > 0);
    }

    private GetCanViewBeyondTop(): boolean {
        return (this.previewTopLeftCoords[1] > 0);
    }

    private GetCanViewBeyondRight(): boolean {
        const mapDataWidth: number = this.mapData.width;
        const previewRightCoord: number = this.previewTopLeftCoords[0] + this.previewMapLength - 1;
        return (previewRightCoord < mapDataWidth);
    }

    private GetCanViewBeyondBottom(): boolean {
        const mapDataHeight: number = this.mapData.height;
        const previewBottomCoord: number = this.previewTopLeftCoords[1] + this.previewMapLength - 1;
        return (previewBottomCoord < mapDataHeight);
    }

    override GetRender(): React.JSX.Element {
        return (
            <>
                <canvas id={this.id}/>
            </>
        );
    }
}