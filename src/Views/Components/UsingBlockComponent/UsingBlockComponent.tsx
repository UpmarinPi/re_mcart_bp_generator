import { ComponentBase } from "../ComponentBase";
import React from "react";
import { SelectColorItemComponent } from "./SelectColorItemComponent";
import "./UsingBlockComponent.css";

export class UsingBlockComponent extends ComponentBase {

    private selectColorItemComponents: SelectColorItemComponent[] = [];
    private colorToSelectColorItemMap: Map<string, SelectColorItemComponent> = new Map<string, SelectColorItemComponent>();

    constructor(id: string) {
        super(id);
        this.selectColorItemComponents.forEach((selectColorItemComponent) => {
            selectColorItemComponent.onComponentChange.Subscribe(() => {
                this.onComponentChange.notify(this.GetColorIdToBlockMap());
            });
        });
    }

    GetColorIdToBlockMap(): Map<string, string> {
        const colorIdToBlockMap = new Map<string, string>();
        this.selectColorItemComponents.forEach((selectColorItemComponent) => {
            if (selectColorItemComponent.GetIsSelected()) {
                colorIdToBlockMap.set(selectColorItemComponent.colorId, selectColorItemComponent.usingBlockComponent.GetCurrentSelect());
            }
        });
        return colorIdToBlockMap;
    }

    Select(colorId: string): void {
        const selectColorItemComponent = this.colorToSelectColorItemMap.get(colorId);
        if (selectColorItemComponent) {
            selectColorItemComponent.Select();
        }
    }

    UnSelect(colorId: string): void {
        const selectColorItemComponent = this.colorToSelectColorItemMap.get(colorId);
        if (selectColorItemComponent) {
            selectColorItemComponent.UnSelect();
        }
    }

    SetBlockId(colorId: string, blockId: string): void {
        const selectColorItemComponent = this.colorToSelectColorItemMap.get(colorId);
        if (selectColorItemComponent) {
            selectColorItemComponent.SelectBlockId(blockId);
        }
    }

    SelectAll() {
        this.selectColorItemComponents.forEach((selectColorItemComponent) => {
            selectColorItemComponent.Select();
        });
    }

    UnSelectAll() {
        this.selectColorItemComponents.forEach((selectColorItemComponent) => {
            selectColorItemComponent.UnSelect();
        });
    }


    AddItem(id: string, colorId: string, blockList: string[]) {
        const newItem = new SelectColorItemComponent(id, colorId, blockList);
        newItem.onComponentChange.Subscribe(() => {
            this.onComponentChange.notify(this.GetColorIdToBlockMap());
        });
        this.selectColorItemComponents.push(newItem);
        this.colorToSelectColorItemMap.set(colorId, newItem);
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
