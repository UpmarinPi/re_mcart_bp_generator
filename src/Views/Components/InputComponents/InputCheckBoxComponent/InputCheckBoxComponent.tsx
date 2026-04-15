import React, { type ChangeEvent } from "react";
import { InputBaseComponent } from "../InputBaseComponent.tsx";
import "./InputCheckBoxComponent.css";

// チェックボックス
export class InputCheckBoxComponent extends InputBaseComponent {

    private name: string;
    private _checked: boolean;
    public get checked(): boolean {
        return this._checked;
    }
    private set checked(value: boolean) {
        this._checked = value;
    }

    constructor(id: string, name: string = "") {
        super(id);
        this.type = "checkbox";
        this.name = name;
        this._checked = false;
    }

    protected override OnInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target) {
            return;
        }
        this.checked = event.target.checked;
        this.OnComponentChange(event.target.checked);
    }

    SetChecked(checked: boolean) {
        this.checked = checked;
        let element = this.GetMyRender() as HTMLInputElement;
        if (element) {
            element.checked = this.checked;
        }
        this.OnComponentChange(this.checked);
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={"input-check-box-component " + this.id}>
                <input
                    id={this.id}
                    type={this.type}
                    name={this.name}
                    defaultChecked={this.checked}
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
