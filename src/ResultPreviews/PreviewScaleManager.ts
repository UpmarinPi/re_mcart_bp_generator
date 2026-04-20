import { ObserverSubject } from "../Cores/Observer";
import scaleListJson from "./preview_scale_list.json";
import { Singleton } from "../Cores/Singleton";
import type { MCMapData } from "../Datas/MapData/MCMapData";

export class PreviewScaleManager extends Singleton {
    private _scale: number = 1.0;
    private _scaleList: number[] = [];
    private mapWidth: number = 0;
    private mapHeight: number = 0;

    // [scale, isZoomInMaxed, isZoomOutMaxed]
    public onScaleChanged: ObserverSubject<[number, boolean, boolean]> = new ObserverSubject<[number, boolean, boolean]>();

    private constructor() {
        super();
        this.InitializeScaleList();
    }

    public OnMapDataUpdated(mapData: MCMapData): void {
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;
    }

    private InitializeScaleList(): void {
        this.LoadScaleList();
        this.SortScaleList();
    }

    private LoadScaleList(): void {
        this._scaleList = scaleListJson.scale_list;
    }

    private SortScaleList(): void {
        this._scaleList.sort((a, b) => a - b);
    }

    public get scale(): number {
        return this._scale;
    }

    public SetScale(scale: number): void {
        this._scale = scale;
        console.debug("SetScale: ", this.scale);
        this.onScaleChanged.notify([this.scale, this.GetIsZoomInMaxed(), this.GetIsZoomOutMaxed()]);
    }

    private GetCurrentScaleIndex(): number {
        for (let i = 0; i < this._scaleList.length - 1; i++) {
            if (this._scaleList[i] <= this.scale && this.scale < this._scaleList[i + 1]) {
                return i;
            }
        }

        if (this._scaleList[this._scaleList.length - 1] <= this.scale) {
            return this._scaleList.length - 1;
        }
        return -1;
    }

    public Zoomin(): void {
        if (this.GetIsZoomInMaxed()) {
            return;
        }
        const index = this.GetCurrentScaleIndex();
        if (index < this._scaleList.length - 1) {
            this.SetScale(this._scaleList[index + 1]);
        }
    }

    public Zoomout(): void {
        if (this.GetIsZoomOutMaxed()) {
            return;
        }
        const index = this.GetCurrentScaleIndex();
        if (index > 0) {
            this.SetScale(this._scaleList[index - 1]);
        }
    }

    public FitScale(width: number): void {
        const scale = width / this.mapWidth;
        this.SetScale(scale);
    }

    private GetIsZoomInMaxed(): boolean {
        return this.scale >= this._scaleList[this._scaleList.length - 1];
    }

    private GetIsZoomOutMaxed(): boolean {
        return this.scale <= this._scaleList[0];
    }
}