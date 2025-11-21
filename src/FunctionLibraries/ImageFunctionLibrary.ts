export function ImageDataToImageURL(canvas: HTMLCanvasElement, image: ImageData): string | null {
    const ctx = canvas.getContext('2d');
    if(!ctx){
        return null;
    }
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.putImageData(image, 0,0);

    return canvas.toDataURL();
}

export function ImageCanvasToImageData(canvas: HTMLCanvasElement, image: HTMLImageElement): ImageData | null{
    // 読み込み終わってから処理すること
    if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
        console.error('Image not loaded or has zero size.');
        return null;
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = image.width;
    canvas.height = image.height;
    if(!ctx){
        return null;
    }
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

    return ctx.getImageData(0, 0, image.width, image.height);
}
