import {ComponentBase} from "../ComponentBase";
import React from "react";
import "./ButtonComponent.css";

export enum ButtonStyle {
    Default = "default",
    Back = "back",
    Convert = "convert",
    Import = "import",
    Save = "save"
}

export class ButtonComponent extends ComponentBase {
    displayText: string;
    buttonStyle: ButtonStyle;

    constructor(id: string, displayText: string, buttonStyle: ButtonStyle = ButtonStyle.Default) {
        super(id);
        this.displayText = displayText;
        this.buttonStyle = buttonStyle;
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={`button-component ${this.id} button-style-${this.buttonStyle}`}>
                <button
                    type={"button"} className={`${this.id}button button-style-${this.buttonStyle}`}
                    onClick={
                        (event) => {
                            this.OnComponentChange(event);
                        }
                    }
                >
                    {this.displayText}
                </button>
            </div>
        );
    }
}
