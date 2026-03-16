import { InputBaseComponent } from "../InputBaseComponent";
import React from "react";
import "./SelectImageComponent.css";

export class SelectImageComponent extends InputBaseComponent {

    constructor(id: string) {
        super(id);
        this.type = "file";
        this.accept = "image/*";
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={`${this.id} select-image-container`}>
                <label htmlFor={this.id} className="select-image-label">
                    画像を選択
                </label>
                <input
                    className="select-image-input-hidden"
                    id={this.id} type={this.type} accept={this.accept}
                    onChange={(event) => this.OnInputChange(event)}
                />
            </div>
        );
    }
}
