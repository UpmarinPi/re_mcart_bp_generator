import { ComponentBase } from "../ComponentBase";
import React from "react";
import { ColorPreviewPartComponent } from "./ColorPreviewPartComponent";
import { RGBColor } from "../../../Cores/Color";
import { SelectUsingBlockPartComponent } from "./SelectUsingBlockPartComponent";
import { InputCheckBoxComponent } from "../InputComponents/InputCheckBoxComponent/InputCheckBoxComponent";
import "./SelectColorItemComponent.css";

export interface ISelectColorItemComponentParams {
    colorId: string;
    blockList: string[];
    isAvailable: boolean;
}

export class SelectColorItemComponent extends ComponentBase {
    colorId: string = "#000000";
    colorPreviewComponent: ColorPreviewPartComponent;
    usingBlockComponent: SelectUsingBlockPartComponent;
    checkBoxComponent: InputCheckBoxComponent;
    blockList: string[] = [];
    isAvailable: boolean = true;

    constructor(id: string, colorId: string, blockList: string[]) {
        const actualId: string = `${id}${colorId}`;
        super(actualId);
        this.colorPreviewComponent = new ColorPreviewPartComponent(actualId + "ColorPreview");
        this.blockList = blockList;

        this.usingBlockComponent = new SelectUsingBlockPartComponent(actualId);
        this.usingBlockComponent.SetBlockIds(blockList);

        this.checkBoxComponent = new InputCheckBoxComponent(actualId + "CheckBox");
    }
    Set(params: ISelectColorItemComponentParams): void {
        this.colorId = params.colorId;
        this.blockList = params.blockList;
        this.isAvailable = params.isAvailable;

        this.colorPreviewComponent.color = RGBColor.ColorCodeToRGB(this.colorId);
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={`select-color-item-component ${this.id}`}>
                {this.checkBoxComponent.GetRender()}
                {this.colorPreviewComponent.GetRender()}
                {this.usingBlockComponent.GetRender()}
            </div>
        );
    }
}
