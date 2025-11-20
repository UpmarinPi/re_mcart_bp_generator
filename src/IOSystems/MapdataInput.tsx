import {MCMapData} from "../Datas/MapData/MCMapData.ts";

export class MapDataInput{
    private selectedFile: File | null = null;
    public importedMapData: string | null = null;

    setFile(file: File){
        this.selectedFile = file;
    }

    async loadSelectedFile(): Promise<void> {
        if(!this.selectedFile) throw "No file selected";
        this.importedMapData = await this.selectedFile.text();
    }
}