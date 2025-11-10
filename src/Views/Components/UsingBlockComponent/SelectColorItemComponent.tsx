import {ComponentBase} from "../ComponentBase";
import React from "react";
import {ColorPreviewPartComponent} from "./ColorPreviewPartComponent";
import {RGBColor} from "../../../Cores/Color";
import {SelectUsingBlockPartComponent} from "./SelectUsingBlockPartComponent";
import {StringListToOption} from "../DropdownComponent";

export interface ISelectColorItemComponentParams {
    colorId: string;
    blockList: string[]; // todo: 後々 HTMLSelectElement になる予定
    isAvailable: boolean;
}

export class SelectColorItemComponent extends ComponentBase {
    colorId: string = "#000000";
    colorPreviewComponent: ColorPreviewPartComponent;
    usingBlockComponent: SelectUsingBlockPartComponent;
    blockList: string[] = []; // todo: 後々 HTMLSelectElement になる予定
    isAvailable: boolean = true;

    constructor(id: string, colorId: string, blockList: string[]) {
        const actualId: string = `${id}${colorId}`;
        super(actualId);
        this.colorPreviewComponent = new ColorPreviewPartComponent(actualId + "ColorPreview");
        this.blockList = blockList;

        this.usingBlockComponent = new SelectUsingBlockPartComponent(actualId);
        this.usingBlockComponent.options = StringListToOption(this.blockList);
    }
    Set(params: ISelectColorItemComponentParams): void{
        this.colorId = params.colorId;
        this.blockList = params.blockList;
        this.isAvailable = params.isAvailable;

        this.colorPreviewComponent.color = RGBColor.ColorCodeToRGB(this.colorId);
    }

    Render(): React.JSX.Element {
        return (
            <div className={this.id}>
                {this.colorPreviewComponent.Render()}
                {this.usingBlockComponent.Render()}
            </div>
        );
    }
}
