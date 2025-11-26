import {RGBColor} from "../Cores/Color.ts";
import {BlockData, BlockDataRepository} from "./Repositories/BlockDataRepository.ts";
import {ERepositoryIds, RepositoryManager} from "./Repositories/RepositoryManager.ts";
import type {ColorDataRepository} from "./Repositories/ColorDataRepository.ts";
import {Singleton} from "../Cores/Singleton.ts";

// 色情報(使用するブロック、使用予定のブロック)
export class BlockColorInfo {
    bIsSelected: boolean = false;
    colorId: string = "";
    usingBlockIndex: number = 0; //usablBlockIdsのblockの中で使用しているもののindex
    usableBlockIds: BlockData[] = [];
}

export class UsingColorsManager extends Singleton {
    constructor() {
        super();
        this.InitializeBlockColorInfos();
    }

    private InitializeBlockColorInfos() {
        this.colorDataRepository = RepositoryManager.get().GetRepository<ColorDataRepository>(ERepositoryIds.ColorData);
        this.blockDataRepository = RepositoryManager.get().GetRepository<BlockDataRepository>(ERepositoryIds.BlockData);
        if (!this.colorDataRepository) {
            return;
        }
        const colorIdList = this.colorDataRepository.GetColorIdList();

        colorIdList.forEach(colorId => {
            this.colorIdToBlockColorInfoMap.set(colorId, this.GenerateBlockColorInfosFromColorId(colorId));
        });
    }

    // colorIdを基にブロック情報を取得
    GetBlockColorInfoByColorId(colorId: string): BlockColorInfo {
        return this.GetBlockColorInfoByColorId(colorId);
    }

    // usingColorsManagerが持っている色のid一覧を取得
    // 外部側で色一覧を取得したい場合はcolorDataRepositoryから取得したほうが良い
    private GetColorIdList(): string[] {
        return Array.from(this.colorIdToBlockColorInfoMap.keys());
    }

    // usingColorsManagerが保持しているブロック・色情報を全取得
    GetBlockColorInfos(): BlockColorInfo[] {
        let blockColorInfos: BlockColorInfo[] = [];
        this.GetColorIdList().forEach(colorId => {
            const blockColorInfo = this.colorIdToBlockColorInfoMap.get(colorId);
            if (blockColorInfo) {
                blockColorInfos.push(blockColorInfo);
            }
        })
        return blockColorInfos;
    }

    private GenerateBlockColorInfosFromColorId(colorId: string): BlockColorInfo {
        if (!this.blockDataRepository) {
            return new BlockColorInfo();
        }


        let blockColorInfo: BlockColorInfo = new BlockColorInfo();
        blockColorInfo.bIsSelected = true;
        blockColorInfo.colorId = colorId;
        blockColorInfo.usableBlockIds = this.blockDataRepository.GetUsableBlocksFromColor(colorId);
        blockColorInfo.usingBlockIndex = 0;// todo: 初期値を0で固定しているため、拡張する必要あり

        return blockColorInfo;
    }

    colorIdToBlockColorInfoMap: Map<string, BlockColorInfo> = new Map();

    private colorDataRepository: ColorDataRepository | undefined = undefined;
    private blockDataRepository: BlockDataRepository | undefined = undefined;
}