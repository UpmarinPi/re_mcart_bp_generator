export class RGBColor {
    r: number = 0;
    g: number = 0;
    b: number = 0;

    constructor(r: number = 0, g: number = 0, b: number = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public ToString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    static ColorCodeToRGB(value: string): RGBColor {
        const InvalidReturnValue: RGBColor = new RGBColor(255, 0, 255);
        const colorCodeRegex = /^#*([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/; // 正規変換(#あり・なし 両方対応)

        if (!colorCodeRegex.test(value)) {
            console.error(`INVALID VALUE(${value})`);
            return InvalidReturnValue;
        }
        const results = value.match(colorCodeRegex);
        if (results == null || results.length < 4) {
            console.error(`INVALID VALUE(${value})`);
            return InvalidReturnValue;
        }

        const r: number = parseInt(results[1], 16);
        const g: number = parseInt(results[2], 16);
        const b: number = parseInt(results[3], 16);

        return new RGBColor(r, g, b);
    }

    // rgbが同値であれば同じIDを返す
    static CreateColorId(color: RGBColor): number {

        return color.r * 65536 + color.g * 256 + color.b;
    }

    Tof32Vec4(): [number, number, number, number] {
        return [this.r / 256.0, this.g / 256.0, this.b / 256.0, 1.0];
    }
    Tou32Vec3(): [number, number, number] {
        return [this.r, this.g, this.b];
    }
}
