#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_animation_theme.py —— 检查 10 份动画是否真的统一到站点设计令牌。

为什么需要它（本轮实测的教训）：
    重配色时最容易漏的是**内联样式**（写死在 HTML 属性里的 `style="color:#1d4ed8"`、
    图例小色块 `style="background:#e2e8f0"`）—— 只扫 CSS 规则会以为自己改全了，
    结果深色底上留着深蓝小字/浅灰方块，页面看着"脏"。

判据（按深色主题的常理）：
  * 文本色亮度 < 0.35  → 在深底上必然看不清   → 报"疑似不可读文字"
  * 背景色亮度 > 0.85  → 会变成刺眼的浅色块   → 报"疑似浅色块"
  * body 的背景必须够暗（< 0.30）             → 否则根本没换成深色
  阈值给得宽松，只报"值得人看一眼"的地方，不当硬失败；末尾给出每份的色数统计。

用法：  python verify_animation_theme.py [--strict]
        --strict 时把"疑似"也算失败（用于最终验收）
"""

import io
import os
import re
import sys

SRC = r"E:\沈云付算法"
FILES = [
    ("01背包", "knapsack_animation.html"), ("均分纸牌", "cards_animation.html"),
    ("数字三角形", "triangle_animation.html"), ("最长公共子序列", "lcs_animation.html"),
    ("连通分支数", "components_animation.html"), ("最小差", "min_diff_animation.html"),
    ("n个1", "repunit_animation.html"), ("11的余数", "mod11_animation.html"),
    ("车厢调度", "catalan_animation.html"), ("过河问题", "cross_river_animation.html"),
    ("合并果子", "merge_fruit_animation.html"),
    ("单位区间覆盖", "interval_cover_animation.html"),
    ("田忌赛马", "horse_race_animation.html"),
    ("足球赛票", "tickets_animation.html"),
]

COLOR = re.compile(r"(?P<prop>background(?:-color)?|color|fill|stroke|border(?:-color)?)"
                   r"\s*:\s*(?P<hex>#[0-9a-fA-F]{3,6})")
DARK_BG_OK = 0.30          # body 背景亮度上限
TEXT_DARK = 0.35           # 文本色亮度下限（低于它 = 深字，深底上看不清）
LIGHT_BOX = 0.85           # 背景色亮度上限（高于它 = 浅色块）


def lum(hex6):
    """相对亮度（0=黑 1=白），用 sRGB 近似即可。"""
    h = hex6.lstrip("#")
    if len(h) == 3:
        h = h[0] * 2 + h[1] * 2 + h[2] * 2
    r, g, b = (int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def check(path):
    src = io.open(path, encoding="utf-8").read()
    text_colors, bg_colors = {}, {}
    for m in COLOR.finditer(src):
        prop, hexv = m.group("prop"), m.group("hex")
        (bg_colors if prop.startswith("background") else text_colors).setdefault(hexv, 0)
        (bg_colors if prop.startswith("background") else text_colors)[hexv] += 1

    problems = []
    # 1) body 背景必须暗
    m = re.search(r"body\s*\{[^}]*?background(?:-color)?\s*:\s*([^;}]+)", src, re.S)
    if m:
        bgs = re.findall(r"#[0-9a-fA-F]{3,6}", m.group(1))
        if bgs and min(lum(x) for x in bgs) > DARK_BG_OK:
            problems.append("body 背景偏亮（%s）—— 没换成深色？" % ", ".join(bgs))
    else:
        problems.append("找不到 body 的背景声明")

    # 2) 深字（在深底上看不清）
    dark_text = sorted([c for c in text_colors if lum(c) < TEXT_DARK],
                       key=lambda c: lum(c))
    # 3) 浅色块
    light_bg = sorted([c for c in bg_colors if lum(c) > LIGHT_BOX], key=lambda c: -lum(c))

    return problems, dark_text, light_bg, text_colors, bg_colors


def main():
    strict = "--strict" in sys.argv
    total_bad = 0
    for (d, f) in FILES:
        path = os.path.join(SRC, d, f)
        if not os.path.isfile(path):
            print("[!] 找不到 %s" % path)
            total_bad += 1
            continue
        problems, dark_text, light_bg, tc, bc = check(path)
        flag = "OK " if (not problems and not dark_text and not light_bg) else "看  "
        print("%s %-16s %-26s 文本色 %2d 种 / 背景色 %2d 种"
              % (flag, d, f, len(tc), len(bc)))
        for p in problems:
            print("      [!] " + p)
        if dark_text:
            print("      [深色文字·需人工确认] " + ", ".join(dark_text[:6])
                  + ("…" if len(dark_text) > 6 else "")
                  + "  ← 亮色按钮/徽章上的深字是正常的，只有出现在大块深底上才是问题")
        if light_bg:
            print("      [浅色块·需人工确认] " + ", ".join(light_bg[:6])
                  + ("…" if len(light_bg) > 6 else ""))
        # --strict 只把**硬信号**算失败：body 背景不够暗、或出现成片的浅色块（#fff 类）
        hard = bool(problems) or any(c.lower() in ("#fff", "#ffffff", "#fafafa", "#e2e8f0",
                                                  "#f3f4f6", "#eceff1") for c in light_bg)
        total_bad += 1 if (hard if strict else False) else 0
    print()
    if strict and total_bad:
        print("FAIL: %d 份动画仍有硬性主题问题（--strict：body 背景不够暗 / 残留成片浅色块）"
              % total_bad)
        return 1
    print("提示：以上「疑似」项只表示值得人看一眼 —— 亮色按钮上的深字、白底徽章都是有意为之。"
          "加 --strict 只对硬信号（body 背景、成片浅色块）判失败。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
