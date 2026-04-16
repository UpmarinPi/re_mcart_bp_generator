import { ComponentBase } from "../ComponentBase";
import React from "react";
import { ImageDataToImageURL } from "../../../FunctionLibraries/ImageFunctionLibrary";
import "./ImagePreviewComponent.css";

export class ImagePreviewComponent extends ComponentBase {

    canvas: HTMLCanvasElement;
    img: ImageData | null = null;

    SetImage(img: ImageData | null) {
        this.img = img;
        this.UpdateImage();
    }

    ClearImage() {
        this.img = null;
        this.OnComponentChange(null);
    }

    private UpdateImage(): void {
        const myImageElement = this.GetMyRender() as HTMLImageElement;
        if (!myImageElement || !this.img) {
            return;
        }
        if (!this.img) {
            myImageElement.src = '';
            myImageElement.style.display = "none";
            return;
        }
        const imageURL = ImageDataToImageURL(this.canvas, this.img);
        if (!imageURL) {
            return;
        }
        // 画像ソース設定
        myImageElement.src = imageURL;
        myImageElement.style.display = "block";

        // 幅・高さ設定
        const width = this.img.width;
        const height = this.img.height;
    }

    constructor(id: string) {
        super(id);
        this.canvas = document.createElement('canvas');
        // 描画して
        this.requestsRenderUpdate.Subscribe(() => {
            this.UpdateImage();
        });
        this.postRender.Subscribe(() => {
            this.UpdateImage();
        });
    }

    GetRender(): React.JSX.Element {
        return (
            <div className={"image-preview-component " + this.id}>
                <img
                    id={this.id}
                    alt={this.id}
                />
            </div>
        );
    }
}
