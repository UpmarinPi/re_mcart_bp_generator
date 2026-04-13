import type { IViewBase } from "../Views/ViewBase";
import React from "react";
import type { ControllerBase } from "../Controllers/ControllerBase.ts";

export abstract class SceneBase {
    view: IViewBase | undefined;

    abstract GetScenePathName(): string;

    GetRender(): React.JSX.Element | null {
        if (!this.view) {
            return null;
        }
        return this.view.GetRender();
    }

    InitializeView<T extends IViewBase>
        (viewType: (new () => T)): void {
        if (this.view !== undefined) {
            return;
        }
        this.view = new viewType();
    }

    ReloadScene(): void {
        this.InitializeView(this.view?.constructor as new () => IViewBase);
    }

    NotifyToPostRender() {
        this.controller?.Reload();
    }

    // controllers
    protected controller: ControllerBase | null = null;
}
