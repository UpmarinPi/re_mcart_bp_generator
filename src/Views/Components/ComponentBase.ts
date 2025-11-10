import {ViewBase} from "../ViewBase";
import {ObserverSubject} from "../../Cores/Observer";

export abstract class ComponentBase extends ViewBase {

    protected constructor(id: string) {
        super();
        this.id = id;
        this.onComponentChange = new ObserverSubject<any>();
    }

    get id(): string {
        return this._id;
    }

    protected set id(value: string) {
        this._id = value;
    }

    private _id: string = "";

    // on change
    //
    onComponentChange: ObserverSubject<any>;

    protected OnComponentChange(value: any) {
        this.onComponentChange.notify(value);
    }

    protected GetMyRender(): HTMLElement | null {
        return document.getElementById(this._id);
    }
}
