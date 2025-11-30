import {MCMapData} from "../Datas/MapData/MCMapData";

export class MapdataOutput{
    getData(mapData: MCMapData){
        const json = JSON.stringify(mapData, null, 2);
        const blob = new Blob([json],{type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const date = new Date().toISOString().replace(/[:.]/g, "-")
        a.href = url;
        a.download = `mapdata-${date}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}