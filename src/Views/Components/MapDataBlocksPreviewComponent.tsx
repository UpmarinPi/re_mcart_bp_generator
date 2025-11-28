import {ComponentBase} from "./ComponentBase.ts";
import React from "react";
import {MCMapData} from "../../Datas/MapData/MCMapData.ts";
import {ERepositoryIds, RepositoryManager} from "../../Datas/Repositories/RepositoryManager.ts";
import type {BlockDataRepository} from "../../Datas/Repositories/BlockDataRepository.ts";

export class MapDataBlocksPreviewComponent extends ComponentBase {
    mapData: MCMapData = new MCMapData();

    UpdateCanvas(){
        const canvas = this.GetMyRender() as HTMLCanvasElement;
        if (!canvas) {
            console.warn("no canvas");
            return;
        }
        const ctx = canvas.getContext("2d");
        if(!ctx){
            return;
        }

        // キャンバスを初期化
        ctx.clearRect(0, 0, canvas.width, canvas.height);



        const width = this.mapData.width;
        const height = this.mapData.height;
        canvas.width = width;
        canvas.height = height;

        // map dataが無効な値の場合、中身を作らずに削除
        if(this.mapData.width <= 0 || this.mapData.height <= 0){
            return;
        }

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dataNumber = this.mapData.map[y][x];
                const index = (y * width + x) * 4;
                let blockSrc: string |undefined = undefined;
                const blockId = this.mapData.mapToBlockId.get(dataNumber);
                if(this.mapData.mapToColorId && blockId) {
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

    private GetBlockSrcById(id: string): string | undefined{
        const blockDataRepository = RepositoryManager.get().GetRepository<BlockDataRepository>(ERepositoryIds.BlockData);
        if(!blockDataRepository){
            return undefined;
        }

        return blockDataRepository.GetBlockImageSrc(id);
    }
    override GetRender(): React.JSX.Element{
        return (
            <>
                <canvas id={this.id}/>
            </>
        );
    }
}