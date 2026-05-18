import { ComponentBase } from "../ComponentBase";
import { MCMapData } from "../../../Datas/MapData/MCMapData";
import React from "react";
import { RGBColor } from "../../../Cores/Color";
import "./MapDataImagePreviewComponent.css";

export class MapDataImagePreviewComponent extends ComponentBase {
    private mapData: MCMapData = new MCMapData();
    private resultCanvasId: string;
    private navigatorCanvasId: string;

    private _width: number = 600;
    private canvasScale: number = 1.0;

    get width(): number {
        return this._width;
    }

    constructor(id: string) {
        super(id);
        this.resultCanvasId = `${id}-resultCanvas`;
        this.navigatorCanvasId = `${id}-navigatorCanvas`;

        this.postRender.Subscribe(() => {
            this.UpdateCanvas();
            this.UpdateNavigator();
        });
    }

    SetMapData(data: MCMapData): void {
        this.mapData = data;
        this.UpdateCanvas();
        this.UpdateNavigator();
    }

    SetWidth(width: number): void {
        this._width = width;
        this.requestsRenderUpdate.notify();
    }

    SetScale(scale: number): void {
        this.canvasScale = scale;
        this.requestsRenderUpdate.notify();
    }

    UpdateCanvas() {
        if (!this.mapData) {
            console.warn("no map data");
            return;
        }

        const resultCanvas = document.getElementById(this.resultCanvasId) as HTMLCanvasElement;
        if (!resultCanvas) {
            console.warn("no canvas");
            return;
        }
        const ctx = resultCanvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
            console.warn("no context");
            return;
        }

        // キャンバスを初期化
        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);



        const width = this.mapData.width;
        const height = this.mapData.height;
        resultCanvas.width = width;
        resultCanvas.height = height;

        // map dataが無効な値の場合、中身を作らずに削除
        if (this.mapData.width <= 0 || this.mapData.height <= 0) {
            console.warn("invalid map data");
            return;
        }

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dataNumber = this.mapData.map[y][x];
                const index = (y * width + x) * 4;
                let color: RGBColor | undefined = undefined;
                if (this.mapData.mapToColorId && this.mapData.mapToColorId.has(dataNumber)) {
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

        this.requestsRenderUpdate.notify();
    }

    // navigator params
    private navigatorXPos: number = 0;
    private navigatorYPos: number = 0;
    private navigatorWidth: number = 100;
    private navigatorHeight: number = 100;

    OnPreviewPosUpdated([xPos, yPos, size]: [number, number, number]): void {
        this.navigatorXPos = xPos;
        this.navigatorYPos = yPos;
        this.navigatorWidth = size;
        this.navigatorHeight = size;
        this.UpdateNavigator();
    }

    UpdateNavigator() {
        const navigatorCanvas = document.getElementById(this.navigatorCanvasId) as HTMLCanvasElement;
        if (!navigatorCanvas) {
            console.warn("no navigatorCanvas");
            return;
        }
        const ctx = navigatorCanvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
            console.warn("no context");
            return;
        }

        // キャンバスを初期化
        ctx.clearRect(0, 0, navigatorCanvas.width, navigatorCanvas.height);
        const width = this.mapData.width;
        const height = this.mapData.height;
        navigatorCanvas.width = width;
        navigatorCanvas.height = height;

        // navigatorを表示
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.navigatorXPos - 1, this.navigatorYPos - 1, this.navigatorWidth + 2, this.navigatorHeight + 2);

        this.requestsRenderUpdate.notify();
    }

    GetRender(): React.JSX.Element {
        const style: React.CSSProperties = {};

        const canvasStyle: React.CSSProperties = {};
        if (this.mapData) {
            canvasStyle.width = `${this.mapData.width * this.canvasScale}px`;
            canvasStyle.height = `${this.mapData.height * this.canvasScale}px`;
            style.width = this.width;
            style.height = this.width * (this.mapData.height / this.mapData.width);
            if (this.canvasScale >= 1.0) {
                canvasStyle.imageRendering = "pixelated";
            }
            else {
                canvasStyle.imageRendering = "auto";
            }
        }

        return (
            <div id={this.id} className={"map-data-image-preview-component"} style={style}>
                <div className="map-data-canvas-wrapper">
                    <canvas id={this.resultCanvasId} className="result-canvas" style={canvasStyle} />
                    <canvas id={this.navigatorCanvasId} className="navigator-canvas" style={canvasStyle} />
                </div>
            </div>
        );
    }
}
