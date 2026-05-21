import { AppConfig } from "../AppConfig";
import { ObserverSubject } from "../Cores/Observer";
import { Singleton } from "../Cores/Singleton";
import { MCMapData } from "../Datas/MapData/MCMapData";
import type { BlockData, BlockDataRepository } from "../Datas/Repositories/BlockDataRepository";
import { ERepositoryIds, RepositoryManager } from "../Datas/Repositories/RepositoryManager";

export class BlockPreviewManager extends Singleton {
    private xPos: number = 0;
    private yPos: number = 0;
    private previewSize: number = AppConfig.previewDefaultSize;
    private mapData: MCMapData = new MCMapData();
    private blockList: (BlockData | undefined)[][] = [];
    private previewBlocks: (BlockData | undefined)[][] = [];

    public onPreviewBlocksUpdated: ObserverSubject<(BlockData | undefined)[][]> = new ObserverSubject<(BlockData | undefined)[][]>();
    // [x, y, width, height]
    public onPreviewPosUpdated: ObserverSubject<[number, number, number]> = new ObserverSubject<[number, number, number]>();

    public SetMapData(mapData: MCMapData): void {
        this.mapData = mapData;
        this.UpdateBlockList();
    }

    public GetMapData(): MCMapData {
        return this.mapData;
    }

    public GetXPos(): number {
        return this.xPos;
    }

    public GetYPos(): number {
        return this.yPos;
    }

    public GetPreviewSize() {
        return this.previewSize;
    }

    public GetPreviewBlocks(): (BlockData | undefined)[][] {
        return this.previewBlocks;
    }

    constructor() {
        super();
    }

    private UpdateBlockList(): void {
        this.blockList = [];
        const blockDataRepository = RepositoryManager.get().GetRepository<BlockDataRepository>(ERepositoryIds.BlockData);
        if (!blockDataRepository) {
            return;
        }
        for (let y = 0; y < this.mapData.height; y++) {
            this.blockList[y] = [];
            for (let x = 0; x < this.mapData.width; x++) {
                const mapId = this.mapData.map[y][x];
                const blockId = this.mapData.mapToBlockId.get(mapId);
                if (blockId && blockId.length > 0) {
                    const blockData = blockDataRepository.GetBlockData(blockId);
                    this.blockList[y][x] = blockData;
                } else {
                    this.blockList[y][x] = undefined;
                }
            }
        }
        this.UpdatePreviewBlocks();
    }

    private UpdatePreviewBlocks(): void {
        this.previewBlocks = [];
        for (let y = 0; y < this.previewSize; y++) {
            this.previewBlocks[y] = [];
            for (let x = 0; x < this.previewSize; x++) {
                const yPos = y + this.yPos;
                const xPos = x + this.xPos;
                if (yPos >= 0 && yPos < this.mapData.height && xPos >= 0 && xPos < this.mapData.width) {
                    const blockData = this.blockList[yPos][xPos];
                    this.previewBlocks[y][x] = blockData;
                } else {
                    this.previewBlocks[y][x] = undefined;
                }
            }
        }

        this.onPreviewBlocksUpdated.notify(this.previewBlocks);
    }

    MoveUp(): void {
        this.SetPos(this.xPos, this.yPos - 1);
    }

    MoveAboveChunk(): void {
        this.SetPos(this.xPos, this.yPos - this.previewSize);
    }

    MoveDown(): void {
        this.SetPos(this.xPos, this.yPos + 1);
    }

    MoveBelowChunk(): void {
        this.SetPos(this.xPos, this.yPos + this.previewSize);
    }

    MoveLeft(): void {
        this.SetPos(this.xPos - 1, this.yPos);
    }

    MoveLeftChunk(): void {
        this.SetPos(this.xPos - this.previewSize, this.yPos);
    }

    MoveRight(): void {
        this.SetPos(this.xPos + 1, this.yPos);
    }

    MoveRightChunk(): void {
        this.SetPos(this.xPos + this.previewSize, this.yPos);
    }

    SetPos(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;
        this.ConvertToCorrectPos();

        this.onPreviewPosUpdated.notify([this.xPos, this.yPos, this.previewSize]);
        this.UpdatePreviewBlocks();
    }

    private ConvertToCorrectPos(): void {
        if (this.xPos < 0) {
            this.xPos = 0;
        }
        if (this.xPos >= this.mapData.width - 1) {
            this.xPos = this.mapData.width - 1;
        }
        if (this.yPos < 0) {
            this.yPos = 0;
        }
        if (this.yPos >= this.mapData.height - 1) {
            this.yPos = this.mapData.height - 1;
        }
    }

}