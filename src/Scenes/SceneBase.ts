import type {IViewBase} from "../Views/ViewBase";
import React from "react";

export abstract class SceneBase {
    view: IViewBase | undefined;

    GetRender(): React.JSX.Element | null{
        if(!this.view){
            return null;
        }
        return this.view.GetRender();
    }

    protected InitializeView<T extends IViewBase>
    (viewType: (new () => T)): void {
        if(this.view !== undefined) {
            console.warn("viewは既に初期化済みです");
            return;
        }
        this.view = new viewType();
    }
}
