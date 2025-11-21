import {RGBColor} from "../Cores/Color";

export function rgbToTuple(rgb: RGBColor): [number, number, number] {
    return [rgb.r, rgb.g, rgb.b];
}

export function rgbToLab(color: RGBColor): [number, number, number] {
    let [r, g, b] = [color.r, color.g, color.b];
    // 0–1 に正規化
    r /= 255;
    g /= 255;
    b /= 255;

    // ガンマ補正（sRGB → 線形RGB）
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // RGB → XYZ 変換（D65参照白）
    const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const y = (r * 0.2126 + g * 0.7152 + b * 0.0722);// / 1.00000;
    const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    // XYZ → Lab 変換
    const f = (t: number) =>
        t > 0.008856 ? Math.cbrt(t) : (t * 903.3 + 16) / 116;

    const fx = f(x);
    const fy = f(y);
    const fz = f(z);

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bVal = 200 * (fy - fz);

    return [L, a, bVal];
}

export function dot(a: [number, number, number], b: [number, number, number]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function sub(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function addScaled(a: [number, number, number], b: [number, number, number], alpha: number): [number, number, number] {
    return [alpha * a[0] + (1 - alpha) * b[0], alpha * a[1] + (1 - alpha) * b[1], alpha * a[2] + (1 - alpha) * b[2]];
}

export function norm2(a: [number, number, number]): number {
    return dot(a, a);
}

export function DistSq(a: [number, number, number], b: [number, number, number]): number {
    return norm2(sub(a, b));
}