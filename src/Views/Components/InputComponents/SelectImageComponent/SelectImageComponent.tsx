import {InputBaseComponent} from "../InputBaseComponent";
import "./SelectImageComponent.css";

export class SelectImageComponent extends InputBaseComponent {

    constructor(id: string) {
        super(id);
        this.type = "file";
        this.accept = "image/*";
    }
}
