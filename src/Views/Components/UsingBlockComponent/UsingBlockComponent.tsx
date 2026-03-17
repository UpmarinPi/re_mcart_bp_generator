import { ComponentBase } from "../ComponentBase";
import React from "react";
import { SelectColorItemComponent } from "./SelectColorItemComponent";
import "./UsingBlockComponent.css";

export class UsingBlockComponent extends ComponentBase {

    private selectColorItemComponents: SelectColorItemComponent[] = [];

    constructor(id: string) {
        super(id);
    }

    AddItem(id: string, colorId: string, blockList: string[]) {
        this.selectColorItemComponents.push(new SelectColorItemComponent(id, colorId, blockList));
    }
    GetRender(): React.JSX.Element {
        return (
            <div className={`using-block-component ${this.id}`}>
                <div className="using-block-component-scroll-area">
                    {this.selectColorItemComponents.map((selectColorItemComponent) => (
                        <div key={selectColorItemComponent.id}>{selectColorItemComponent.GetRender()}</div>
                    ))}
                </div>
            </div>
        );
    }
}
