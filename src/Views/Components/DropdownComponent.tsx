import React from "react";
import {ComponentBase} from "./ComponentBase";

interface IOption {
    value: string;
    label: string;
}

export function ConstObjectToOption<T extends Record<string, string>>(obj: T): IOption[] {
    return Object.values(obj).map((v) => ({value: v, label: v}));
}

export function StringListToOption(_list: string[]): IOption[]{
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
        this._options.forEach(option => {
            if (option.value === value) {
                return true;
            }
        });
        return false;
    }

    // 選択項目を設定してから呼び出すこと
    SetIndex(index: number){
        if(index >= this._options.length){
            return;
        }
        const myDropdown = this.GetMyRender() as HTMLSelectElement;
        myDropdown.selectedIndex = index;
        this.requestsRenderUpdate.notify();
    }

    // 選択項目を設定してから呼び出すこと
    SetValue(value: string){
        if(!this.IsValidValue(value)){
            return;
        }
        const myDropdown = this.GetMyRender() as HTMLSelectElement;
        myDropdown.value = value;
        this.requestsRenderUpdate.notify();
    }

    Render(): React.JSX.Element {
        return (
            <div className={this.id}>
                <select
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
