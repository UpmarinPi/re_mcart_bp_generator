import {ComponentBase} from "../ComponentBase";
import React from "react";
import "./ButtonComponent.css";

export class ButtonComponent extends ComponentBase {
    displayText: string;

    constructor(id: string, displayText: string) {
        super(id);
        this.displayText = displayText;
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={"button-component " + this.id}>
                <button
                    type={"button"} className={this.id + "button"}
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
