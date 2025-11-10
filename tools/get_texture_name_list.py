import os
import argparse
import json
import sys

def list_png_files(folder_path, recursive=False):
    if recursive:
        png_files = []
        for root, _, files in os.walk(folder_path):
            for f in files:
                if f.lower().endswith(".png"):
                    png_files.append(f)  # ファイル名のみ（拡張子付き）
        return png_files
    else:
        return [
            f for f in os.listdir(folder_path)
            if f.lower().endswith(".png")
        ]

def main():
    parser = argparse.ArgumentParser(description="指定フォルダ内のPNGファイル一覧をJSON形式で保存（値は {\"name\": \"\"}）するツール")
    parser.add_argument("folder", help="PNGファイルを探すフォルダのパス")
    parser.add_argument(
        "-o", "--output", default="png_list.json",
        help="出力ファイル名（デフォルト: png_list.json）"
    )
    parser.add_argument(
        "-r", "--recursive", action="store_true",
        help="サブフォルダも含めて検索する"
    )
    args = parser.parse_args()

    if not os.path.isdir(args.folder):
        print(f"エラー: フォルダが存在しません: {args.folder}")
        sys.exit(1)

    # PNGファイル一覧取得
    png_files = list_png_files(args.folder, recursive=args.recursive)

    # JSONデータ作成（拡張子なしをキーにして値を {"name": ""} にする）
    data = {}
    for fname in png_files:
        basename, _ = os.path.splitext(fname)
        data[basename] = {"name": ""}

    # JSONとして保存（UTF-8、日本語をそのまま出力）
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"{len(png_files)} 件のPNGファイル名を {args.output} にJSON形式で保存しました")

if __name__ == "__main__":
    main()