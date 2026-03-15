import React, {type ChangeEvent} from "react";
import {InputBaseComponent} from "../InputBaseComponent.tsx";
import "./InputCheckBoxComponent.css";

// チェックボックス
export class InputCheckBoxComponent extends InputBaseComponent {

    name: string;
    constructor(id: string, name: string = "") {
        super(id);
        this.type = "checkbox";
        this.name = name;
    }

    protected override OnInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) {
            return;
        }
        this.OnComponentChange(event.target.checked);
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={"input-check-box-component " + this.id}>
                <input
                    id={this.id}
                    type={this.type}
                    name={this.name}
                    onChange={
                        (event) => {
                            this.OnInputChange(event);
                        }
                    }
                />
                <label>{this.name}</label>
            </div>
        );
    }
}
