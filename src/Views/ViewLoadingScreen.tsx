import {ViewBase} from "./ViewBase";
import React from "react";

export class ViewLoadingScreen extends ViewBase {
    GetRender(): React.JSX.Element {
        super.GetRender();
        return (
            <>
                <h2>
                    Now Loading...
                </h2>
            </>
        );
    }
}
