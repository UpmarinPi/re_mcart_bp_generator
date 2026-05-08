import { ObserverSubject } from "../Cores/Observer";
import { Singleton } from "../Cores/Singleton";
import { MCMapData } from "../Datas/MapData/MCMapData";
import type { BlockData, BlockDataRepository } from "../Datas/Repositories/BlockDataRepository";
import { ERepositoryIds, RepositoryManager } from "../Datas/Repositories/RepositoryManager";

export class BlockPreviewManager extends Singleton {
    private xPos: number = 0;
    private yPos: number = 0;
    private previewSize: number = 16;
    private mapData: MCMapData = new MCMapData();
    private blockList: BlockData[][] = [];
    private previewBlocks: BlockData[][] = [];

    public onPreviewBlocksUpdated: ObserverSubject<BlockData[][]> = new ObserverSubject<BlockData[][]>();
    // [x, y, width, height]
    public onPreviewPosUpdated: ObserverSubject<[number, number, number, number]> = new ObserverSubject<[number, number, number, number]>();

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
                if (blockId) {
                    const blockData = blockDataRepository.GetBlockData(blockId);
                    this.blockList[y][x] = blockData;
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
                const blockData = this.blockList[y + this.yPos][x + this.xPos];
                this.previewBlocks[y][x] = blockData;
            }
        }

        this.onPreviewBlocksUpdated.notify(this.previewBlocks);
    }

    MoveUp(): void {
        this.SetPos(this.xPos, this.yPos - 1);
    }

    MoveDown(): void {
        this.SetPos(this.xPos, this.yPos + 1);
    }

    MoveLeft(): void {
        this.SetPos(this.xPos - 1, this.yPos);
    }

    MoveRight(): void {
        this.SetPos(this.xPos + 1, this.yPos);
    }

    SetPos(xPos: number, yPos: number): void {
        this.xPos = xPos;
        this.yPos = yPos;
        this.ConvertToCorrectPos();

        this.onPreviewPosUpdated.notify([this.xPos, this.yPos, this.previewSize, this.previewSize]);
        this.UpdatePreviewBlocks();
    }

    private ConvertToCorrectPos(): void {
        if (this.xPos < 0) {
            this.xPos = 0;
        }
        if (this.xPos >= this.mapData.width - this.previewSize) {
            this.xPos = this.mapData.width - this.previewSize - 1;
        }
        if (this.yPos < 0) {
            this.yPos = 0;
        }
        if (this.yPos >= this.mapData.height - this.previewSize) {
            this.yPos = this.mapData.height - this.previewSize - 1;
        }
    }

}