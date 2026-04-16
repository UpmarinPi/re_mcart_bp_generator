import React, { type ChangeEvent } from "react";
import { ComponentBase } from "../../ComponentBase";
import "./InputCheckBoxListComponent.css";

export interface CheckBoxListItem {
    label: string;
    value: string;
    checked: boolean;
}

export class InputCheckBoxListComponent extends ComponentBase {
    private items: CheckBoxListItem[];

    constructor(id: string, items: CheckBoxListItem[] = []) {
        super(id);
        this.items = items;
    }

    public SetItems(items: CheckBoxListItem[]) {
        this.items = items;
    }

    public GetItems(): CheckBoxListItem[] {
        return this.items;
    }

    public GetSelectedValues(): string[] {
        const returnValues: string[] = [];
        this.items.forEach(item => {
            if (item.checked) {
                returnValues.push(item.value);
            }
        });
        return returnValues;
    }

    public SetSelectedValues(values: string[]) {
        this.items.forEach(item => {
            item.checked = values.includes(item.value);
        });
    }

    public AddItem(item: CheckBoxListItem) {
        this.items.push(item);
    }

    public AddItems(items: CheckBoxListItem[]) {
        this.items.push(...items);
    }

    protected OnInputChange(index: number, checked: boolean) {
        this.items[index].checked = checked;
        const selectedValues = this.items.filter(item => item.checked).map(item => item.value);
        this.OnComponentChange(selectedValues);
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={"input-check-box-list-component " + this.id}>
                {this.items.map((item, index) => {
                    const checkboxId = this.id + "_" + index.toString();
                    return (
                        <div key={checkboxId} className="check-box-list-item">
                            <input
                                id={checkboxId}
                                type="checkbox"
                                value={item.value}
                                defaultChecked={item.checked}
                                onChange={(event) => {
                                    this.OnInputChange(index, event.target.checked);
                                }}
                            />
                            <label htmlFor={checkboxId}>{item.label}</label>
                        </div>
                    );
                })}
            </div>
        );
    }
}
