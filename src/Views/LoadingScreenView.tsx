import {ViewBase} from "./ViewBase";
import React from "react";

export class LoadingScreenView extends ViewBase {
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
