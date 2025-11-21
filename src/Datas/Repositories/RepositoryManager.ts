import {Singleton} from "../../Cores/Singleton.ts";
import type {RepositoryBase} from "./RepositoryBase.ts";
import {ColorDataRepository} from "./ColorDataRepository.ts";
import {BlockDataRepository} from "./BlockDataRepository.ts";

export enum ERepositoryIds {
     ColorData,
    BlockData,

}

export class RepositoryManager extends Singleton {

    private IdToRepositoryMap: Map<ERepositoryIds, RepositoryBase> = new Map();

    GetRepository<T extends RepositoryBase>(Id: ERepositoryIds): T | undefined {
        return this.IdToRepositoryMap.get(Id) as T;
    }

    // repository登録
    private SubscribeRepositories(){
        this.SubscribeRepository(ERepositoryIds.ColorData, ColorDataRepository);
        this.SubscribeRepository(ERepositoryIds.BlockData, BlockDataRepository);
    }


    private SubscribeRepository<T extends RepositoryBase, TArgs extends any[]>(Id: ERepositoryIds, T: (new (...args: TArgs) => T), ...args:TArgs){
        this.IdToRepositoryMap.set(Id, new T(...args));
    }

    constructor() {
        super();
        this.SubscribeRepositories();
    }
}