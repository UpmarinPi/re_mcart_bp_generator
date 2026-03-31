import type { MCMapData } from "../../Datas/MapData/MCMapData";

export class MCMapDataToImage {
    static async Convert(mcMapData: MCMapData): Promise<ImageData> {
        const width = mcMapData.width;
        const height = mcMapData.height;
        const imageData = new ImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = mcMapData.mapToColorId.get(mcMapData.map[y][x]);
                if (!color) {
                    continue;
                }
                imageData.data[y * width * 4 + x * 4] = color.r;
                imageData.data[y * width * 4 + x * 4 + 1] = color.g;
                imageData.data[y * width * 4 + x * 4 + 2] = color.b;
                imageData.data[y * width * 4 + x * 4 + 3] = 255;
            }
        }
        return imageData;
    }
}