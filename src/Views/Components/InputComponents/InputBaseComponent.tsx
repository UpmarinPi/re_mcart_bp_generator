import {ComponentBase} from "../ComponentBase";
import React from "react";
import type {ChangeEvent} from "react";

export abstract class InputBaseComponent extends ComponentBase{
    protected constructor(id: string) {
        super(id);
    }
    protected type: string|undefined = undefined;
    protected accept: string | undefined = undefined;

    protected OnInputChange(event: ChangeEvent<HTMLInputElement>) {
        if(event.target.files && event.target.files[0]) {
            this.OnComponentChange(event.target.files[0]);
        }
        else{
            this.OnComponentChange(event.target.value);
        }
    }

    override Render(): React.JSX.Element {
        return (
            <div className={this.id}>
                <input
                    id={this.id} type={this.type} accept={this.accept}
                    onChange={
                        (event) => {
                            this.OnInputChange(event);
                        }
                    }
                />
            </div>
        );
    }
}
