import React from "react";
import { ComponentBase } from "../../ComponentBase";
import "./BlockPreviewItemComponent.css";
import type { BlockData } from "../../../../Datas/Repositories/BlockDataRepository";

export class BlockPreviewItemComponent extends ComponentBase {
    private blockData: BlockData | undefined = undefined;

    constructor(id: string = "") {
        super(id);
    }

    SetBlockData(blockData: BlockData) {
        this.blockData = blockData;
    }

    SetInvalidBlockData() {
        this.blockData = undefined;
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={`block-preview-item-component ${this.id}`}>
                {this.blockData?.image_src ? (
                    <img src={this.blockData.image_src} alt={this.blockData.name} title={this.blockData.name} />
                ) : (
                    <span className={this.blockData ? "no-img-icon" : "no-data-icon"} />
                )}
            </div>
        );
    }
}
