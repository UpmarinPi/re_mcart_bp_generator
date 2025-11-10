import {MCMapData} from "../Datas/MapData/MCMapData";

export class MapdataOutput{
    getData(mapData: MCMapData){
        const json = JSON.stringify(mapData, null, 2);
        const blob = new Blob([json],{type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mapdata.txt";
        a.click();
        URL.revokeObjectURL(url);
    }
}