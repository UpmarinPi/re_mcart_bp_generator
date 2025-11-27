import {Singleton} from "../../Cores/Singleton";
import {ObserverSubject} from "../../Cores/Observer";
import {MCMapData} from "./MCMapData";

export class MCMapDataManager extends Singleton {
    get mapData(): MCMapData {
        return this._mapData;
    }
    private _mapData : MCMapData = new MCMapData();

    constructor() {
        super();
        this.onMapDataChange = new ObserverSubject<MCMapData>();
    }

    SetMapData(mapData : MCMapData) : void {
        this._mapData = mapData;
        this.onMapDataChange.notify(this._mapData);
    }

    // observer
    onMapDataChange : ObserverSubject<MCMapData>;
}