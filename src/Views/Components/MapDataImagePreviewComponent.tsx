import {ComponentBase} from "./ComponentBase";
import {MCMapData} from "../../Datas/MapData/MCMapData";
import React from "react";
import {RGBColor} from "../../Cores/Color";

export class MapDataImagePreviewComponent extends ComponentBase {
    mapData: MCMapData = new MCMapData();
    resultCanvasId: string = "resultCanvas";

    gridCanvasId: string = "gridCanvas";

    constructor(id: string) {
        super(id);

        this.postRender.Subscribe(() => {
            this.UpdateCanvas();
        })
    }

    SetMapData(data: MCMapData): void {
        this.mapData = data;
        this.UpdateCanvas();
    }

    UpdateCanvas() {
        if (!this.mapData) {
            return;
        }

        const resultCanvas = document.getElementById(this.resultCanvasId) as HTMLCanvasElement;
        if (!resultCanvas) {
            console.warn("no canvas");
            return;
        }
        const ctx = resultCanvas.getContext("2d");
        if(!ctx){
            return;
        }

        // キャンバスを初期化
        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);



        const width = this.mapData.width;
        const height = this.mapData.height;
        resultCanvas.width = width;
        resultCanvas.height = height;

        // map dataが無効な値の場合、中身を作らずに削除
        if(this.mapData.width <= 0 || this.mapData.height <= 0){
            return;
        }

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dataNumber = this.mapData.map[y][x];
                const index = (y * width + x) * 4;
                let color: RGBColor|undefined = undefined;
                if(this.mapData.mapToColorId && this.mapData.mapToColorId.has(dataNumber)) {
                    color = this.mapData.mapToColorId.get(dataNumber);
                }
                if (!color) {
                    color = new RGBColor();
                }
                data[index] = color.r;      // r
                data[index + 1] = color.g;  // g
                data[index + 2] = color.b;  // b
                data[index + 3] = 255;      // a
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    GetRender(): React.JSX.Element {
        return (
            <div id={this.id}>
                <canvas id={this.resultCanvasId} width="200%" height="200%"/>
                <canvas id={this.gridCanvasId} width="200%" height="200%"/>
            </div>
        );
    }
}
