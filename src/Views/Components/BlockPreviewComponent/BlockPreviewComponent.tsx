import React from "react";
import { ComponentBase } from "../ComponentBase";
import "./BlockPreviewComponent.css";
import { BlockPreviewItemComponent } from "./BlockPreviewItemComponent/BlockPreviewItemComponent";
import type { BlockData } from "../../../Datas/Repositories/BlockDataRepository";

export class BlockPreviewComponent extends ComponentBase {

    private side: number = 0;
    private items: BlockPreviewItemComponent[] = [];
    private blockDatas: BlockData[][] = [];

    constructor(id: string = "") {
        super(id);
        this.InitializeItems();
        this.postRender.Subscribe(() => {
            this.UpdateBlockDatas();
        });
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
        this.blockDatas = blockDatas;
        this.UpdateBlockDatas();
    }

    private UpdateBlockDatas(): void {
        if (this.blockDatas.length === 0) {
            return;
        }

        const totalItems: number = this.side * this.side;
        for (let i = 0; i < totalItems; ++i) {
            const item: BlockPreviewItemComponent = this.items[i];
            const x: number = i % this.side;
            const y: number = Math.floor(i / this.side);
            item.SetBlockData(this.blockDatas[y][x]);
        }

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
