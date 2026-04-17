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

    GetRender(): React.JSX.Element {
        return (
            <div className={`block-preview-item-component ${this.id}`}>
                {/* Add view elements for BlockPreviewItemComponent here */}
            </div>
        );
    }
}
