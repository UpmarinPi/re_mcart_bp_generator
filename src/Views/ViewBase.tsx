import React from "react";
import {ObserverSubject} from "../Cores/Observer";

export interface IViewBase {
    requestsRenderUpdate: ObserverSubject;
    postRender: ObserverSubject;

    GetRender(): React.JSX.Element;
}

export abstract class ViewBase implements IViewBase {
    // 描画を更新したくなったらコイツをnotify
    requestsRenderUpdate: ObserverSubject;

    // render直後に呼び出される
    // Renderの中身をいじりたくなったときに
    postRender: ObserverSubject;

    constructor() {
        this.requestsRenderUpdate = new ObserverSubject();
        this.postRender = new ObserverSubject();
    }

    GetRender(): React.JSX.Element {
        this.updateTitle("hogehoge")
        return (<></>);
    }

    CreateView<T extends ViewBase, TArgs extends any[]>(viewType: (new (...args: TArgs) => T), ...args: TArgs): T {
        let view: T;
        view = new viewType(...args);
        view.requestsRenderUpdate.Subscribe(() => {
            this.requestsRenderUpdate.notify();
        });
        this.postRender.Subscribe(() => {
            view.postRender.notify();
        })

        return view;
    }

    updateTitle(title: string) {
        document.title = title;
    }
}
