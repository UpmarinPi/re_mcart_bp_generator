from PIL import Image
import sys

def color_multiply(image_path, hex_color):
    # 画像を開く（RGBAで統一）
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()

    # 16進カラーコード → RGB値（0〜255）
    r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    # ピクセルごとにカラー乗算
    for y in range(img.height):
        for x in range(img.width):
            pr, pg, pb, pa = pixels[x, y]
            # モノクロの明るさを0〜1に正規化
            brightness = pr / 255.0
            # 乗算して再構成
            nr = int(r * brightness)
            ng = int(g * brightness)
            nb = int(b * brightness)
            pixels[x, y] = (nr, ng, nb, pa)

    # 出力ファイル名（例：input_colored.png）
    output_path = image_path.rsplit('.', 1)[0] + "_colored.png"
    img.save(output_path)
    print(f"保存完了: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("使い方: python color_multiply.py <画像ファイル> <カラーコード(例: 48B518)>")
        sys.exit(1)
    color_multiply(sys.argv[1], sys.argv[2])