import requests
from bs4 import BeautifulSoup
import json
import re

url = 'https://minecraftjapan.miraheze.org/wiki/%E5%9C%B0%E5%9B%B3/%E8%A1%A8%E7%A4%BA%E8%89%B2'
normal_headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0.0.0 Safari/537.36"
}

def get_color_hex(tds):
    if not tds:
        return None
    if len(tds) < 2:
        return None
    text = tds[1].get_text().strip()
    if not text:
        return None

    rgb_pattern = re.compile(r"#([0-9a-fA-F]{6})")
    m = rgb_pattern.search(text)
    if m is None:
        return None

    return m.group(1)


def table_datas_to_rgb(tds):
    if not tds:
        return None
        # 右隣のセルが色データ
    if len(tds) < 2:
        return None
    text = tds[1].get_text().strip()
    if not text:
        return None

    color_style = tds[0].get_text()

    # RGB形式 "111,222,333"
    rgb_pattern = re.compile(r'(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})')
    m = rgb_pattern.search(text)
    if m is None:
        return None

    return map(int, m.groups())


def fetch_minecraft_colors(_url, headers):
    resp = requests.get(_url, headers=headers)
    soup = BeautifulSoup(resp.text, 'html.parser')

    data = []

    # テーブルごとに探索
    for table in soup.find_all('table', {'class': 'wikitable'}):
        trs = table.find_all('tr')
        i = 0
        while i < len(trs) - 1:
            i += 1  # 1行目は無視 且つ continue直前すべてに++iを置くのがめんどい

            has_rowspan: bool = False
            rowspan_count: int = 0
            for td in trs[i].find_all('td'):
                if td.has_attr('rowspan'):
                    has_rowspan = True
                    rowspan_count = int(td['rowspan'])
                    break

            if (not has_rowspan or rowspan_count != 4) or (i + 3 >= len(trs)):  # rowspanが条件を満たしていない or OUT OF ROW回避
                continue

            # print(i)
            # print(trs[i])
            light_rgb = table_datas_to_rgb(trs[i].find_all(['td', 'th']))
            default_rgb = table_datas_to_rgb(trs[i + 1].find_all(['td', 'th']))
            dark_rgb = table_datas_to_rgb(trs[i + 2].find_all(['td', 'th']))
            darkest_rgb = table_datas_to_rgb(trs[i + 3].find_all(['td', 'th']))

            if not light_rgb or not default_rgb or not dark_rgb or not darkest_rgb:
                continue

            color_id = get_color_hex(trs[i + 1].find_all(['td', 'th']))


            light_r, light_g, light_b = light_rgb
            default_r, default_g, default_b = default_rgb
            dark_r, dark_g, dark_b = dark_rgb
            darkest_r, darkest_g, darkest_b = darkest_rgb

            print(color_id)
            data.append({
                "color_id": color_id,
                "default_activate": True,
                "default_color": {
                    "r": default_r,
                    "g": default_g,
                    "b": default_b,
                },
                "light_color": {
                    "r": light_r,
                    "g": light_g,
                    "b": light_b,
                },
                "dark_color": {
                    "r": dark_r,
                    "g": dark_g,
                    "b": dark_b,
                },
                "darkest_color": {
                    "r": darkest_r,
                    "g": darkest_g,
                    "b": darkest_b,
                }
            })
            i += 3

    return {"minecraft_colors": data}


def main():
    colors = fetch_minecraft_colors(url, headers=normal_headers)
    with open('../src/Datas/jsons/minecraft_colors.json', 'w', encoding='utf-8') as f:
        json.dump(colors, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
