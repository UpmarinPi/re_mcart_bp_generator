import {ViewBase} from "../ViewBase";
import React from "react";
import "./LoadingScreenView.css";

export class LoadingScreenView extends ViewBase {
    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <div className="loading-screen-view">
                <h2>
                    Now Loading...
                </h2>
            </div>
        );
    }
}
