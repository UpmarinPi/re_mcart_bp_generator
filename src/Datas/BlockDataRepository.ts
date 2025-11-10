import {Singleton} from "../Cores/Singleton";

// jsonファイル
import blockInfoListJson from "./jsons/block_info_list.json";
import colorBlockMapJson from "./jsons/color_block_map.json";

const texturePath: string = "../assets/block_textures";

interface IBlockData {
    name: string;
    image_src: string;
}

class BlockData implements IBlockData {
    constructor(name: string = "", image_src: string = "") {
        this.name = name;
        this.image_src = image_src;
    }

    name: string;
    image_src: string;
}

interface IBlockDataRepository {

    // ブロックの名前を取得
    GetBlockName(blockId: string): string;

    // ブロックの画像を取得
    GetBlockImageSrc(blockId: string): string;
}

// ブロック情報を保持する。色→使用可能なブロックID群, ブロックID→ブロック情報 に変換可能
export class BlockDataRepository extends Singleton implements IBlockDataRepository {

    private blockIdToDataMap: Map<string, BlockData>;
    private colorIdToBlockIdMap: Map<string, string[]>;

    constructor() {
        super();
        this.blockIdToDataMap = new Map();
        this.InitializeBlockIdToData();

        this.colorIdToBlockIdMap = new Map();
        this.InitializeColorIdToBlockIdMap();
    }

    InitializeBlockIdToData() {
        this.blockIdToDataMap.clear();
        for (const [id, {name}] of Object.entries(blockInfoListJson)) {
            const img_src: string = `${texturePath}/${name}.png`;
            const blockData: BlockData = new BlockData(name, img_src);

            this.blockIdToDataMap.set(id, blockData);
        }
    }

    InitializeColorIdToBlockIdMap() {
        this.colorIdToBlockIdMap.clear();
        for (const item of colorBlockMapJson.color_block_map) {
            this.colorIdToBlockIdMap.set(item.color_id, item.blocks);
        }
    }

    GetBlockIds(): string[] {
        return Array.from(this.blockIdToDataMap.keys());
    }

    GetColorToBlockIdList(): Map<string, string[]> {
        return this.colorIdToBlockIdMap;
    }

    GetBlockName(blockId: string): string {
        return this.GetBlockData(blockId).name;
    }

    GetBlockImageSrc(blockId: string): string {

        return this.GetBlockData(blockId).image_src;
    }

    GetBlockDataFromColor(colorId: string): BlockData {
        const blockId = this.colorIdToBlockIdMap.get(colorId);
        if(!blockId || blockId.length <= 0){
            return new BlockData();
        }
        return this.GetBlockData(blockId[0]);
    }

    private GetBlockData(blockId: string): BlockData {
        const blockData: BlockData | undefined = this.blockIdToDataMap.get(blockId);
        if (!blockData) {
            return new BlockData();
        }
        return blockData;
    }

}
