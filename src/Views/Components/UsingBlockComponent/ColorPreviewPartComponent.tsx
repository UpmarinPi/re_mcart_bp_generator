import {ComponentBase} from "../ComponentBase";
import React from "react";
import {RGBColor} from "../../../Cores/Color";

export class ColorPreviewPartComponent extends ComponentBase {
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }
    color: RGBColor;
    private _width: number = 50;
    private _height: number = 50;
    constructor(id: string, color: RGBColor = new RGBColor(), width: number = 50, height: number = 50) {
        super(id);
        this.color = color;
        this.width = width;
        this.height = height;
    }

    Render(): React.JSX.Element {
        return (
            <div className={this.id}
                 style={{
                     background: this.color.ToString(),
                     width: this._width,
                     height: this._height,
                 }}>

            </div>
        );
    }
}