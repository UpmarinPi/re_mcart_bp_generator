import {MCMapData} from "../Datas/MapData/MCMapData.ts";
import pako from "pako";

export class MapDataInput{
    private selectedFile: File | null = null;
    public importedMapData: MCMapData | null = null;

    setFile(file: File){
        this.selectedFile = file;
    }

    async loadSelectedFile(): Promise<void> {
        if(!this.selectedFile) throw "No file selected";
        const arrayBuffer = await this.selectedFile.arrayBuffer();
        const compressed = new Uint8Array(arrayBuffer);

        const inflated = pako.inflate(compressed);

        const json = new TextDecoder().decode(inflated);

        const obj = JSON.parse(json);

        const data = new MCMapData();
        data.dimensionalMode = obj.dimensionalMode;
        data.width = obj.width;
        data.height = obj.height;
        data.map = obj.map;
        data.dimensionalMap = obj.dimensionalMap;
        data.mapToColorId = new Map(obj.mapToColor);
        data.mapToBlockId = new Map(obj.mapToBlock);

        this.importedMapData = data;
    }
}