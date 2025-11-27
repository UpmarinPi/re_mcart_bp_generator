import {InputBaseComponent} from "./InputBaseComponent";
import React from "react";
import type {ChangeEvent} from "react";

export class InputNumberComponent extends InputBaseComponent {
    title: string;
    value: number;
    displayPreInput: string;
    displayPostInput: string;

    constructor(id: string, defaultValue: number = 0, title: string = "", displayPreInput: string = "", displayPostInput: string = "") {
        super(id);
        this.type = "number";
        this.value = defaultValue;
        this.title = title;
        this.displayPreInput = displayPreInput;
        this.displayPostInput = displayPostInput;

        this.onComponentChange.Subscribe((value: number) => {
            this.value = value;
        });
    }

    protected override OnInputChange(event: ChangeEvent<HTMLInputElement>) {
        const eventValue = Number(event.target.value);
        this.OnComponentChange(eventValue);
    }

    // 想定
    // TITLE
    // {PRE} Input {POST}

    // タイトル
    // 表示物: {Input} %

    override GetRender(): React.JSX.Element {
        return (
            <div id={this.id}>
                <p>{this.title}</p>
                <span>{this.displayPreInput}</span>
                <input
                    id={"numberInput"} type={this.type} accept={this.accept}
                    defaultValue={this.value}
                    onChange={
                        (event) => {
                            this.OnInputChange(event);
                        }
                    }
                />
                <span>{this.displayPostInput}</span>
            </div>
        );
    }
}
