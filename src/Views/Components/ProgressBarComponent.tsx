import {ComponentBase} from "./ComponentBase";
import React from "react";

export class ProgressBarComponent extends ComponentBase {
    get maxProgress(): number {
        return this._maxProgress;
    }

    set maxProgress(value: number) {
        this._maxProgress = value;
        this.requestsRenderUpdate.notify();
    }

    get currentProgress(): number {
        return this._currentProgress;
    }

    set currentProgress(value: number) {
        this._currentProgress = value;
        this.requestsRenderUpdate.notify();
    }

    private _currentProgress: number = 0;
    private _maxProgress: number = 1;

    private percentage: number = 0;


    constructor(id: string) {
        super(id);
    }

    GetRender(): React.JSX.Element {
        let percentage = 0;
        if (this._maxProgress > 0) {
            const basePercentage = this._currentProgress / this._maxProgress * 10000;
            percentage = Math.trunc(basePercentage) / 100;
            if (percentage > 100) {
                percentage = 100;
            }
        } else {
            percentage = 100;
        }
        this.percentage = percentage;
        return (
            <p>
                {this.percentage}%
            </p>
        );
    }
}
