import React from "react";
import { ComponentBase } from "../../ComponentBase";
import "./BlockPreviewItemComponent.css";

export class BlockPreviewItemComponent extends ComponentBase {
    private blockId: string;

    constructor(id: string = "") {
        super(id);
        this.blockId = id;
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={`block-preview-item-component ${this.id}`}>
                {/* Add view elements for BlockPreviewItemComponent here */}
            </div>
        );
    }
}
