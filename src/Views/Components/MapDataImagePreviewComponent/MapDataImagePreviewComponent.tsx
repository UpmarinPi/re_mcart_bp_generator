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

    private gridColor: string = "#00000080";
    private navigatorColor: string = "#ff000080";
    private displayGrid: boolean = false;
    private displayNavigator: boolean = true;

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

        const width = this.mapData.width;
        const height = this.mapData.height;

        // 解像度をスケールに合わせて拡大し、CSSの表示サイズと一致させる
        const canvasWidth = Math.round(width * this.canvasScale);
        const canvasHeight = Math.round(height * this.canvasScale);
        navigatorCanvas.width = canvasWidth;
        navigatorCanvas.height = canvasHeight;

        // 16x16の格子を表示
        if (this.displayGrid) {
            ctx.strokeStyle = this.gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= width; x += 16) {
                // ピクセル境界にスナップさせるために + 0.5 する（にじみを防ぐ）
                const drawX = Math.floor(x * this.canvasScale) + 0.5;
                ctx.moveTo(drawX, 0);
                ctx.lineTo(drawX, canvasHeight);
            }
            for (let y = 0; y <= height; y += 16) {
                const drawY = Math.floor(y * this.canvasScale) + 0.5;
                ctx.moveTo(0, drawY);
                ctx.lineTo(canvasWidth, drawY);
            }
            ctx.stroke();
        }

        // navigatorを表示
        if (this.displayNavigator) {
            ctx.strokeStyle = this.navigatorColor;
            ctx.lineWidth = 1;
            const rectX = Math.floor(this.navigatorXPos * this.canvasScale) + 0.5;
            const rectY = Math.floor(this.navigatorYPos * this.canvasScale) + 0.5;
            const rectW = Math.round(this.navigatorWidth * this.canvasScale);
            const rectH = Math.round(this.navigatorHeight * this.canvasScale);
            ctx.strokeRect(rectX, rectY, rectW, rectH);
        }

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
