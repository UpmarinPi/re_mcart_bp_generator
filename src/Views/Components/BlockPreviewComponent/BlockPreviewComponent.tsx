import React from "react";
import { ComponentBase } from "../ComponentBase";
import "./BlockPreviewComponent.css";
import { BlockPreviewItemComponent } from "./BlockPreviewItemComponent/BlockPreviewItemComponent";
import type { BlockData } from "../../../Datas/Repositories/BlockDataRepository";

export class BlockPreviewComponent extends ComponentBase {

    private side: number = 16;
    private items: BlockPreviewItemComponent[] = [];

    constructor(id: string = "") {
        super(id);
        this.InitializeItems();
    }

    private InitializeItems() {
        this.items = [];
        const totalItems = this.side * this.side;
        for (let i = 0; i < totalItems; i++) {
            const item = this.CreateView(BlockPreviewItemComponent, `${this.id}-item-${i}`);
            this.items.push(item);
        }
    }

    UpdateSide(side: number): void {
        if (this.side === side) {
            return;
        }
        this.side = side;
        this.InitializeItems();
        this.requestsRenderUpdate.notify();
    }

    SetBlockDatas(blockDatas: BlockData[][]): void {
        console.log("----------------------------------------------");
        console.log(blockDatas);
        console.log("----------------------------------------------");
        const totalItems = this.side * this.side;
        for (let i = 0; i < totalItems; i++) {
            const item = this.items[i];
            const x = i % this.side;
            const y = Math.floor(i / this.side);
            item.SetBlockData(blockDatas[y][x]);
        }
        console.log("updated block to: " + blockDatas[0][0].image_src);
        this.requestsRenderUpdate.notify();
    }

    GetRender(): React.JSX.Element {
        return (
            <div
                className={`block-preview-component ${this.id}`}
                style={{
                    gridTemplateColumns: `repeat(${this.side}, var(--item-size, 32px))`,
                    gridTemplateRows: `repeat(${this.side}, var(--item-size, 32px))`
                }}
            >
                {this.items.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.GetRender()}
                    </React.Fragment>
                ))}
            </div>
        );
    }
}
