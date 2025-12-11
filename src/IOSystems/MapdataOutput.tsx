import {MCMapData} from "../Datas/MapData/MCMapData";
import pako from "pako";

export class MapdataOutput{
    getData(mapData: MCMapData){
        const serializable = {
            dimensionalMode: mapData.dimensionalMode,
            width: mapData.width,
            height: mapData.height,
            map: mapData.map,
            dimensionalMap: mapData.dimensionalMap,
            mapToColor: Array.from(mapData.mapToColorId.entries()),
            mapToBlock: Array.from(mapData.mapToBlockId.entries()),
        };

        const json = JSON.stringify(mapData, null, 2);
        const compressed = pako.deflate(json);
        const blob = new Blob([compressed],{type: "application/x-deflate"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const date = new Date().toISOString().replace(/[:.]/g, "-")
        a.href = url;
        a.download = `mapdata-${date}.bin`;
        a.click();
        URL.revokeObjectURL(url);
    }
}