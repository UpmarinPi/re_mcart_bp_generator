import React from "react";
import {ComponentBase} from "./ComponentBase";

interface IOption {
    value: string;
    label: string;
}

export function ConstObjectToOption<T extends Record<string, string>>(obj: T): IOption[] {
    return Object.values(obj).map((v) => ({value: v, label: v}));
}

export function StringListToOption(_list: string[]): IOption[] {
    return [];// Object.values(list).map((v) => ({value: v, label: v}));
}

export class DropdownComponent extends ComponentBase {

    constructor(id: string = "", options: IOption[] = []) {
        super(id);
        this.options = options;
    }

    // 選択候補
    private _options: IOption[] = [];
    set options(value: IOption[]) {
        this._options = value;
        this.requestsRenderUpdate.notify();
    }

    private IsValidValue(value: string): boolean {
        let returnValue = false;
        this._options.forEach(option => {
            if (option.value == value) {
                returnValue = true;
                return;
            }
        });
        return returnValue;
    }

    // 選択項目を設定してから呼び出すこと
    SetIndex(index: number) {
        if (index >= this._options.length) {
            console.error(`Index is out of range\n ${index} / dropdownLength: ${this._options.length}`);
            return;
        }
        const indexValue: string = this._options[index].value;
        this.SetValue(indexValue);
    }

    // 選択項目を設定してから呼び出すこと
    SetValue(value: string) {
        if (!this.IsValidValue(value)) {
            console.error(`there has no value for ${value}`);
            return;
        }
        const myDropdown = this.GetMyRender() as HTMLSelectElement;
        if (!myDropdown) {
            console.error(`dropdown are not created yet`);
            return;
        }
        myDropdown.value = value;
        this.requestsRenderUpdate.notify();
        this.OnComponentChange(value);
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={this.id}>
                <select
                    id={this.id}
                    onChange={
                        (event) => this.OnComponentChange(event.target.value)
                    }
                >
                    {this._options.map((option: IOption) => (

                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}
