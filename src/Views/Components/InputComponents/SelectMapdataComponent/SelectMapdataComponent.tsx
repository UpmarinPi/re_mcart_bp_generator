import { InputBaseComponent } from "../InputBaseComponent";
import React from "react";
import "./SelectMapdataComponent.css";

export class SelectMapdataComponent extends InputBaseComponent {

    constructor(id: string) {
        super(id);
        this.type = "file";
        this.accept = ".bin";
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={`${this.id} select-mapdata-container`}>
                <label htmlFor={this.id} className="select-mapdata-label">
                    ファイルを選択
                </label>
                <input
                    className="select-mapdata-input-hidden"
                    id={this.id} type={this.type} accept={this.accept}
                    onChange={(event) => this.OnInputChange(event)}
                />
            </div>
        );
    }
}
