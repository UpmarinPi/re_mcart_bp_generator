import { MediatorBase } from "./MediatorBase";
import { MCMapData } from "../../Datas/MapData/MCMapData";
import { MCMapDataManager } from "../../Datas/MapData/MCMapDataManager";


export class ResultPreviewMediator extends MediatorBase {
    constructor() {
        super();
        this.InitializeMapDataBinding();
    }

    private InitializeMapDataBinding() {
        MCMapDataManager.get().onMapDataChange.Subscribe(
            (mapData: MCMapData) => {
                this.OnMapDataUpdated(mapData);
            }
        );
    }

    private OnMapDataUpdated(mapData: MCMapData) {

    }
}
