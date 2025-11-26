import {ComponentBase} from "../ComponentBase";
import React from "react";
import {SelectColorItemComponent} from "./SelectColorItemComponent";

export class UsingBlockComponent extends ComponentBase{

    private selectColorItemComponents: SelectColorItemComponent[] = [];

    AddItem(id: string, colorId: string, blockList: string[]){
        this.selectColorItemComponents.push(new SelectColorItemComponent(id, colorId, blockList));
    }
    GetRender(): React.JSX.Element {
        return super.GetRender();
        // return (
        //     <div id={this.id}>
        //             // {
        //             // this.selectColorItemComponents.forEach((selectColorItemComponent)=>(
        //             // <dev>selectColorItemComponent.Render()</dev>
        //             // ))};
        //     </div>
        // );
    }
}
