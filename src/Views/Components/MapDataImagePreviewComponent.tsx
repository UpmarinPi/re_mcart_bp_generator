import {ComponentBase} from "./ComponentBase";
import {MCMapData} from "../../Datas/MapData/MCMapData";
import React from "react";
import {RGBColor} from "../../Cores/Color";

export class MapDataImagePreviewComponent extends ComponentBase {
    mapData: MCMapData = new MCMapData();

    constructor(id: string) {
        super(id);

        this.requestsRenderUpdate.Subscribe(() => {
            this.UpdateCanvas();
        })


    }

    SetMapData(data: MCMapData): void {
        this.mapData = data;
        this.requestsRenderUpdate.notify();
    }

    UpdateCanvas() {
        if(!this.mapData){
            return;
        }
        const canvas = this.GetMyRender() as HTMLCanvasElement;
        const ctx = canvas.getContext("2d")!;

        const width = this.mapData.width;
        const height = this.mapData.height;
        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dataNumber = this.mapData.map[y][x];
                const index = (y * width + x) * 4;
                let color: RGBColor|undefined = undefined;
                if(this.mapData.mapToColor && this.mapData.mapToColor.has(dataNumber)) {
                    color = this.mapData.mapToColor.get(dataNumber);
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
            <canvas id={this.id} width="200%" height="200%"/>
        );
    }
}
