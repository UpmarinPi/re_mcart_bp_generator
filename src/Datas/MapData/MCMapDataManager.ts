import {Singleton} from "../../Cores/Singleton";
import {ObserverSubject} from "../../Cores/Observer";
import {MCMapData} from "./MCMapData";

export class MCMapDataManager extends Singleton {
    private mapData : MCMapData = new MCMapData();

    constructor() {
        super();
        this.onMapDataChange = new ObserverSubject<MCMapData>();
    }

    SetMapData(mapData : MCMapData) : void {
        this.mapData = mapData;
        this.onMapDataChange.notify(this.mapData);
    }

    // observer
    onMapDataChange : ObserverSubject<MCMapData>;
}