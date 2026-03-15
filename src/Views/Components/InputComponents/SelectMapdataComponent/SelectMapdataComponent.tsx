import {InputBaseComponent} from "../InputBaseComponent";
import "./SelectMapdataComponent.css";

export class SelectMapdataComponent extends InputBaseComponent {

    constructor(id: string) {
        super(id);
        this.type = "file";
        this.accept = ".bin";
    }
}
