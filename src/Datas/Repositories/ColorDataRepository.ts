import colorListJson from "../jsons/minecraft_colors.json";
import {RGBColor} from "../../Cores/Color.ts";
import {RepositoryBase} from "./RepositoryBase.ts";

class ColorData {
    constructor(isDefaultActive: boolean, defaultColor: RGBColor, lightColor: RGBColor, darkColor: RGBColor, darkestColor: RGBColor) {
        this.isDefaultActive = isDefaultActive;
        this.defaultColor = defaultColor;
        this.lightColor = lightColor;
        this.darkColor = darkColor;
        this.darkestColor = darkestColor;
    }

    isDefaultActive: boolean;
    defaultColor: RGBColor;
    lightColor: RGBColor;
    darkColor: RGBColor;
    darkestColor: RGBColor;

}

// 色情報を保持する
export class ColorDataRepository extends RepositoryBase {

    colorIdToColorDataMap: Map<string, ColorData> = new Map();

    constructor() {
        super();
        this.InitializeColorData();

    }

    GetColorList(isDetailMode: boolean = false): RGBColor[] {
        let colorList: RGBColor[] = [];
        this.colorIdToColorDataMap.forEach((value) => {
            colorList.push(value.defaultColor);
            if (isDetailMode) {
                colorList.push(value.darkColor);
                colorList.push(value.lightColor);
            }
        })
        return colorList;
    }

    GetColorIdList(): string[] {
        return Array.from(this.colorIdToColorDataMap.keys());
    }

    GetDefaultColor(colorId: string): RGBColor {
        const colorData = this.ColorIdToColorData(colorId);
        if (!colorData) {
            return new RGBColor();
        }
        return colorData.defaultColor;
    }

    GetLightColor(colorId: string): RGBColor {
        const colorData = this.ColorIdToColorData(colorId);
        if (!colorData) {
            return new RGBColor();
        }
        return colorData.lightColor;
    }

    GetDarkColor(colorId: string): RGBColor {
        const colorData = this.ColorIdToColorData(colorId);
        if (!colorData) {
            return new RGBColor();
        }
        return colorData.darkColor;
    }

    GetDarkestColor(colorId: string): RGBColor {
        const colorData = this.ColorIdToColorData(colorId);
        if (!colorData) {
            return new RGBColor();
        }
        return colorData.darkestColor;
    }

    GetColorIdByRGB(rgb: RGBColor): string | undefined {
        for (const [colorId, data] of this.colorIdToColorDataMap.entries()) {
            if (
                (data.defaultColor.r === rgb.r && data.defaultColor.g === rgb.g && data.defaultColor.b === rgb.b) ||
                (data.lightColor.r === rgb.r && data.lightColor.g === rgb.g && data.lightColor.b === rgb.b) ||
                (data.darkColor.r === rgb.r && data.darkColor.g === rgb.g && data.darkColor.b === rgb.b) ||
                (data.darkestColor.r === rgb.r && data.darkestColor.g === rgb.g && data.darkestColor.b === rgb.b)
            ) {
                return colorId;
            }
        }
        return undefined;
    }


    GetIsDefaultActive(colorId: string): boolean {
        const colorData = this.ColorIdToColorData(colorId);
        if (!colorData) {
            return false;
        }
        return colorData.isDefaultActive;
    }

    private InitializeColorData(): void {
        for (const color of colorListJson.minecraft_colors) {
            const colorId: string = color.color_id;
            const colorData = new ColorData(
                color.default_activate,
                new RGBColor(color.default_color.r, color.default_color.g, color.default_color.b),
                new RGBColor(color.light_color.r, color.light_color.g, color.light_color.b),
                new RGBColor(color.dark_color.r, color.dark_color.g, color.dark_color.b),
                new RGBColor(color.darkest_color.r, color.darkest_color.g, color.darkest_color.b),
            );
            this.colorIdToColorDataMap.set(colorId, colorData);
        }
    }

    private ColorIdToColorData(colorId: string): ColorData | undefined {
        const colorData: ColorData | undefined = this.colorIdToColorDataMap.get(colorId);
        if (!colorData) {
            return undefined;
        }
        return colorData;
    }
}
