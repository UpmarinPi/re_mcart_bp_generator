import {ComponentBase} from "./ComponentBase";
import React from "react";
import {ImageDataToImageURL} from "../../FunctionLibraries/ImageFunctionLibrary";

export class ImagePreviewComponent extends ComponentBase {

    canvas: HTMLCanvasElement;
    img: ImageData | null = null;
    imgSize: number = 1;

    SetImage(img: ImageData | null) {
        this.img = img;
        this.UpdateImage();
    }

    SetSize(size: number) {
        this.imgSize = size;
        this.UpdateImage();
    }

    SetHeight(height: number) {
        if (!this.img) {
            return;
        }
        const naturalHeight = this.img.height;
        const size = height / naturalHeight;

        this.SetSize(size);
    }

    SetWidth(width: number) {
        if (!this.img) {
            return;
        }
        const naturalWidth = this.img.width;
        const size = width / naturalWidth;

        this.SetSize(size);
    }

    ClearImage() {
        this.img = null;
        this.requestsRenderUpdate.notify();
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
        if(!imageURL) {
            return;
        }
        // 画像ソース設定
        myImageElement.src = imageURL;
        myImageElement.style.display = "block";

        // 幅・高さ設定
        const width = this.img.width;
        const height = this.img.height;

        myImageElement.style.width = `${width * this.imgSize}px`;
        myImageElement.style.height = `${height * this.imgSize}px`;
    }

    constructor(id: string) {
        super(id);
        this.canvas = document.createElement('canvas');
        // 描画して
        this.requestsRenderUpdate.Subscribe(() => {
            this.UpdateImage();
        });
    }

    Render(): React.JSX.Element {
        return (
            <div className={this.id}>
                <img
                    id={this.id}
                    alt={this.id}
                />
            </div>
        );
    }
}
