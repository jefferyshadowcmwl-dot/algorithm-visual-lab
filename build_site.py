#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_site.py —— 从 E:\\沈云付算法 生成静态站点内容。

用法：  python build_site.py            （在仓库根目录跑）
输出：
  assets/data.js                 每题的元数据 + 渲染好的详解 HTML
  problems/<slug>/animation.html 动画（原样拷贝，都是自包含单文件、无外链）
  problems/<slug>/sources.js     可复制源码（**去注释版** + 原版，各若干文件）

设计取舍：
  * 站点外壳（index.html / assets/style.css / assets/app.js / README.md）是**手写文件**，
    本脚本只重新生成"内容"三件套 —— 这样重跑构建不会把手写的样式冲掉。
  * 源码用 `tokenize`（Python）/ 状态机（C）去注释，**不靠正则**：
    `#` 在字符串里、`//` 在 C 的字符串里都不能误伤（本仓库陷阱 13 同族）。
  * 详解 md → HTML 用自带的极小转换器（只吃这 10 份文档用到的语法），
    不引第三方库、不联外网，保证离线可用。
"""

import ast
import io
import json
import os
import re
import shutil
import sys
import tokenize

import wiki_data as WD

SRC_ROOT = r"E:\沈云付算法"
OUT_ROOT = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- 题目清单
# (slug, 目录名, 标题, 分类, 复杂度, 判题格式, 一句话摘要)
PROBLEMS = [
    ("cross-river", "过河问题", "过河问题", "贪心 + DP", "O(n log n)", "待核",
     "N 个人一条船、最多载 2 人，求全部过河的最短总时间。"),
    ("cards", "均分纸牌", "均分纸牌", "贪心", "O(n)", "多组 · EOF 结束",
     "相邻两堆之间搬牌，最少几步能让每堆一样多。"),
    ("triangle", "数字三角形", "数字三角形", "动态规划", "O(H^2)", "多组 · H=0 哨兵结束",
     "从顶走到底，每步只能走正下方或右下方，路径和最大。"),
    ("lcs", "最长公共子序列", "最长公共子序列", "动态规划", "O(mn)", "给定 T 组",
     "两个序列的最长公共子序列长度（不要求连续）。"),
    ("knapsack", "01背包", "0/1 背包", "动态规划", "O(nc)", "多组 · EOF 结束",
     "每件物品要么整件拿走要么不拿，容量有限，价值最大。"),
    ("components", "连通分支数", "连通分支数", "并查集", "O(e·α(n))", "多组 · EOF 结束（图之间空一行）",
     "数一个无向图被分成几坨，孤立顶点各自算一坨。"),
    ("min-diff", "最小差", "最小差", "排序 + 双指针", "O(n log n)", "多组 · EOF 结束",
     "两个数组各取一个元素，使差的绝对值最小，要求 O(n log n)。"),
    ("repunit", "n个1", "n 个 1", "数论 · 秦九韶", "O(n)", "给定 T 组",
     "求最小的 n，使 11…1（n 个 1）能被 m 整除。"),
    ("mod11", "11的余数", "11 的余数", "数论 · 逐位取模", "O(位数)", "给定 T 组",
     "80 位的大数求 mod 11 —— 绝不把它转成整数。"),
    ("catalan", "车厢调度", "车厢调度", "组合数学 · Catalan", "O(1) 每组", "多组 · EOF 结束",
     "1..n 依次进站、任意时刻可出站，问出站顺序共有多少种（等价于第 n 个卡特兰数，预处理查表后每组 O(1)）。"),
]

# 每题要展示的源码：标签 → (目录内文件名, 类型)
SOURCES = [
    ("提交版（OJ 用）", "{main}.py", "py"),
    ("详细版（本地学习）", "{main}_detailed.py", "py"),
    ("C 实现", "{main}.c", "c"),
]

# main 名与 slug 的对应（提交版文件名的前缀）
MAIN_NAME = {
    "cross-river": "cross_river", "cards": "cards", "triangle": "triangle",
    "lcs": "lcs", "knapsack": "knapsack", "components": "components",
    "min-diff": "min_diff", "repunit": "repunit", "mod11": "mod11",
    "catalan": "catalan",
}

# 概念关键词：正文里出现这些词，就把它链到对应概念页（每篇文档只链第一次）。
# 这些词同时也是"这篇文档真的讲了那个概念吗"的判据 —— 用来反向核对
# wiki_data 里手写的反链，免得两边各说各话（对不上会在构建时打印出来）。
KEYWORDS = {
    "eof": ["EOF"],
    "sentinel": ["哨兵"],
    "t-cases": ["T 组", "Case i"],
    "blank-line": ["空一行"],
    "reader": ["readline", "make_reader", "读取器"],
    "batch-output": ["一起输出", "一次性输出"],
    "tail-newline": ["行尾"],
    "no-bigint": ["大数", "4300 位", "80 位", "long long", "大整数"],
    "mod-9m": ["9m"],
    "minimality": ["最小性"],
    "negative-pile": ["负数堆"],
    "reverse-capacity": ["倒序"],
    "self-loop": ["自环"],
    "out-of-range": ["越界", "伪答案"],
    "negative-value": ["负数"],
    "index-independent": ["下标独立", "下标互相独立"],
    "two-pointers": ["双指针"],
    "loop-bound": ["上界"],
    "small-preprocess": ["预处理", "Cat("],
    "mutation-testing": ["变异测试"],
    "adversarial-audit": ["审计"],
}

SPLIT_CODE = re.compile(r"(<pre[\s\S]*?</pre>|<code>[\s\S]*?</code>)", re.I)


def concept_of_problem(slug):
    """按 wiki_data.CATEGORIES 反查题目的主分类（分类表是唯一真源）。"""
    for (cid, _name, _desc, slugs) in WD.CATEGORIES:
        if slug in slugs:
            return cid
    return None


def plain_text(html):
    """把渲染好的 HTML 剥成纯文本，用于"这篇到底讲没讲这个"的核对。

    【为什么要脱标签】上一版直接拿 linkify 的命中来核对，结果**被代码格式误导**：
    `readline()` 这种词出现在反引号里（<code>），而 linkify 有意跳过代码段，
    于是"讲过了"被判成"没讲" ✗。核对就该在纯文本上做。
    """
    txt = re.sub(r"<[^>]+>", "", html)
    for a, b in (("&lt;", "<"), ("&gt;", ">"), ("&amp;", "&"), ("&quot;", '"')):
        txt = txt.replace(a, b)
    return txt


def linkify(html, curated_ids):
    """把正文里第一次出现的概念关键词变成指向概念页的链接。

    只链**人工反链里已认可**的概念（`curated_ids`）：
    关键词命中只当"这篇有没有提到它"的粗筛，正文里出现"不是 EOF"这种对比句时
    不该被链走 —— 那是错的联动。准确性优先于覆盖率。

    另外只在**代码块之外**替换（`<pre>` / `<code>` 里的词是示例代码，链走容易误点）。
    """
    hit = []
    parts = SPLIT_CODE.split(html)
    for idx in range(0, len(parts), 2):            # 偶数位 = 非代码片段
        seg = parts[idx]
        if not seg:
            continue
        for cid in curated_ids:
            if cid in hit:
                continue
            for w in KEYWORDS.get(cid, []):
                pos = seg.find(w)
                if pos < 0:
                    continue
                # 已经处在标签属性里（如 href="..."）就不动，避免破坏 HTML
                if seg.rfind("<", 0, pos) > seg.rfind(">", 0, pos):
                    continue
                seg = (seg[:pos] + '<a class="kw" href="#/k/' + cid + '" title="概念：'
                       + cid + '">' + w + "</a>" + seg[pos + len(w):])
                hit.append(cid)
                break
        parts[idx] = seg
    return "".join(parts)


def related_problems(slug, concepts_by_problem, all_slugs, top=3):
    """相关题目：先按"共享概念数"排，再看是否同分类。"""
    mine = set(concepts_by_problem.get(slug, []))
    my_cat = concept_of_problem(slug)
    scored = []
    for other in all_slugs:
        if other == slug:
            continue
        shared = len(mine & set(concepts_by_problem.get(other, [])))
        same_cat = 1 if concept_of_problem(other) == my_cat else 0
        scored.append((shared * 2 + same_cat, shared, same_cat, other))
    scored.sort(key=lambda x: (-x[0], x[3]))
    return [o for (sc, sh, ca, o) in scored[:top] if sc > 0]


# ---------------------------------------------------------------- 去注释
def strip_comments_py(src):
    """去掉 Python 的 # 注释与文档字符串，其余保持原样。

    用 tokenize 定位注释（不是正则）：`"#"` 这种字符串里的 # 不能误伤。
    文档字符串用 ast 精确定位（模块/函数/类体里的第一条字符串语句）。
    """
    src = src.replace("\r\n", "\n")
    lines = src.split("\n")

    # ① 行尾/整行注释：记下每行的注释起始列，裁掉
    cut = {}                      # 行号(1-based) -> 注释起始列
    try:
        for tok in tokenize.generate_tokens(io.StringIO(src).readline):
            if tok.type == tokenize.COMMENT:
                cut[tok.start[0]] = min(cut.get(tok.start[0], 10 ** 9), tok.start[1])
    except (tokenize.TokenError, IndentationError):
        pass

    # ② 文档字符串：整块删掉
    doc_lines = set()
    try:
        tree = ast.parse(src)
    except SyntaxError:
        tree = None
    if tree is not None:
        for node in ast.walk(tree):
            body = getattr(node, "body", None)
            if not body or not isinstance(node, (ast.Module, ast.FunctionDef,
                                                 ast.AsyncFunctionDef, ast.ClassDef)):
                continue
            first = body[0]
            if (isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant)
                    and isinstance(first.value.value, str)):
                end = getattr(first, "end_lineno", first.lineno)
                for ln in range(first.lineno, end + 1):
                    doc_lines.add(ln)

    out = []
    for i, line in enumerate(lines, 1):
        if i in doc_lines:
            continue
        if i in cut:
            line = line[:cut[i]].rstrip()
        out.append(line.rstrip())

    # ③ 收拾空行：连续 3 行以上空白压成 1 行；文件末尾留一个换行
    cleaned = []
    blank = 0
    for line in out:
        if line == "":
            blank += 1
            if blank > 2:
                continue
        else:
            blank = 0
        cleaned.append(line)
    text = "\n".join(cleaned).strip("\n") + "\n"
    # 去掉刚被删空后残留的"空函数体行"前的多余空白行
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def strip_comments_c(src):
    """去掉 C 的 /* */ 与 // 注释。状态机，认字符串/字符字面量（别误伤 "//" 里的斜杠）。"""
    src = src.replace("\r\n", "\n")
    out = []
    i, n = 0, len(src)
    while i < n:
        ch = src[i]
        nxt = src[i + 1] if i + 1 < n else ""
        if ch == '"' or ch == "'":                     # 字符串 / 字符字面量
            quote = ch
            out.append(ch)
            i += 1
            while i < n:
                out.append(src[i])
                if src[i] == "\\" and i + 1 < n:       # 转义字符吃掉下一个
                    out.append(src[i + 1])
                    i += 2
                    continue
                if src[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if ch == "/" and nxt == "*":                   # 块注释
            i += 2
            while i + 1 < n and not (src[i] == "*" and src[i + 1] == "/"):
                if src[i] == "\n":
                    out.append("\n")                   # 保留换行，别把行合并了
                i += 1
            i += 2
            continue
        if ch == "/" and nxt == "/":                   # 行注释
            while i < n and src[i] != "\n":
                i += 1
            continue
        out.append(ch)
        i += 1
    text = "".join(out)
    lines = [ln.rstrip() for ln in text.split("\n")]
    cleaned = []
    blank = 0
    for line in lines:
        if line == "":
            blank += 1
            if blank > 2:
                continue
        else:
            blank = 0
        cleaned.append(line)
    return "\n".join(cleaned).strip("\n") + "\n"


# ---------------------------------------------------------------- markdown → HTML
def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def inline(s):
    """行内语法：**粗体**、`代码`、[文字](链接)、[[引用]]。"""
    s = esc(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\[\[([^\]]+)\]\]", r'<span class="ref">\1</span>', s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2" rel="noopener">\1</a>', s)
    return s


def md_to_html(md):
    """这 10 份文档用到的语法子集：标题/表格/围栏代码/引用/列表/分隔线/行内。"""
    lines = md.replace("\r\n", "\n").split("\n")
    out = []
    i = 0
    sec_ids = []          # 已产出的 h2/h3 锚点序号（供右侧目录用）

    def flush_para(buf):
        if buf:
            out.append("<p>" + inline(" ".join(buf)) + "</p>")
            buf[:] = []

    para = []
    while i < len(lines):
        line = lines[i]

        # 围栏代码块
        m = re.match(r"^```(\w*)\s*$", line)
        if m:
            flush_para(para)
            lang = m.group(1)
            i += 1
            code = []
            while i < len(lines) and not re.match(r"^```\s*$", lines[i]):
                code.append(lines[i])
                i += 1
            i += 1
            cls = " class=\"code " + lang + "\"" if lang else " class=\"code\""
            out.append("<pre" + cls + "><code>" + esc("\n".join(code)) + "</code></pre>")
            continue

        # 分隔线
        if re.match(r"^-{3,}\s*$", line):
            flush_para(para)
            out.append("<hr>")
            i += 1
            continue

        # 标题（给 h2/h3 加锚点 id，右侧目录要用它跳转）
        m = re.match(r"^(#{1,4})\s+(.*)$", line)
        if m:
            flush_para(para)
            lvl = len(m.group(1))
            text = m.group(2)
            anchor = ""
            if lvl in (2, 3):
                # 锚点用序号，稳：中文标题直接当 id 容易踩编码/重复的坑
                sec_ids.append(len(sec_ids) + 1)
                anchor = ' id="sec-%d"' % sec_ids[-1]
            out.append("<h%d%s>%s</h%d>" % (lvl, anchor, inline(text), lvl))
            i += 1
            continue

        # 表格
        if line.strip().startswith("|") and i + 1 < len(lines) and \
                re.match(r"^\s*\|[\s:\-|]+\|\s*$", lines[i + 1]):
            flush_para(para)

            def joined(j):
                """把"单元格里换了行"的表格行接回一整行。

                【注意】md 里一个单元格写成两行（没以 | 结尾）时，naive 的按行切分
                会把那一行撑破、后半截变成游离文本（本站第一版就这样，实拍才看出来）。
                """
                buf = lines[j].strip()
                while not buf.endswith("|") and j + 1 < len(lines) and \
                        lines[j + 1].strip() and not lines[j + 1].strip().startswith("|"):
                    j += 1
                    buf += lines[j].strip()
                return buf, j

            headline, _ = joined(i)
            head = [c.strip() for c in headline.strip().strip("|").split("|")]
            i += 2
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rowline, i_next = joined(i)
                rows.append([c.strip() for c in rowline.strip().strip("|").split("|")])
                i = i_next + 1
            t = ["<div class=\"tablewrap\"><table><thead><tr>"]
            for c in head:
                t.append("<th>" + inline(c) + "</th>")
            t.append("</tr></thead><tbody>")
            for r in rows:
                t.append("<tr>")
                for c in r:
                    t.append("<td>" + inline(c) + "</td>")
                t.append("</tr>")
            t.append("</tbody></table></div>")
            out.append("".join(t))
            continue

        # 引用块
        if line.strip().startswith(">"):
            flush_para(para)
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            out.append("<blockquote>" + inline(" ".join(buf)) + "</blockquote>")
            continue

        # 列表
        m = re.match(r"^\s*[-*]\s+(.*)$", line)
        m2 = re.match(r"^\s*\d+\.\s+(.*)$", line)
        if m or m2:
            flush_para(para)
            ordered = bool(m2)
            items = []
            while i < len(lines):
                mm = re.match(r"^\s*\d+\.\s+(.*)$", lines[i]) if ordered else \
                     re.match(r"^\s*[-*]\s+(.*)$", lines[i])
                if not mm:
                    break
                items.append(mm.group(1))
                i += 1
            tag = "ol" if ordered else "ul"
            out.append("<" + tag + ">")
            for it in items:
                out.append("<li>" + inline(it) + "</li>")
            out.append("</" + tag + ">")
            continue

        # 普通段落
        if line.strip() == "":
            flush_para(para)
        else:
            para.append(line.strip())
        i += 1

    flush_para(para)
    return "\n".join(out)


# ---------------------------------------------------------------- 组装
def build():
    data = []
    kw_hits_by_problem = {}
    toc_by_problem = {}
    problems_dir = os.path.join(OUT_ROOT, "problems")
    if os.path.isdir(problems_dir):
        shutil.rmtree(problems_dir)
    os.makedirs(problems_dir)

    for (slug, dirname, title, cat, cx, fmt, summary) in PROBLEMS:
        src_dir = os.path.join(SRC_ROOT, dirname)
        if not os.path.isdir(src_dir):
            print("[跳过] 找不到目录 " + src_dir)
            continue
        main = MAIN_NAME[slug]
        out_dir = os.path.join(problems_dir, slug)
        os.makedirs(out_dir)

        # 动画：原样拷贝
        anim_src = os.path.join(src_dir, main + "_animation.html")
        if os.path.isfile(anim_src):
            shutil.copyfile(anim_src, os.path.join(out_dir, "animation.html"))
            has_anim = True
        else:
            has_anim = False

        # 详解：目录里的 *详解.md（本仓库命名不统一，用通配找）
        doc_html = ""
        doc_name = ""
        for f in sorted(os.listdir(src_dir)):
            if f.endswith("详解.md"):
                doc_name = f
                md = io.open(os.path.join(src_dir, f), encoding="utf-8").read()
                raw_html = md_to_html(md)
                # 这篇按人工反链该链哪些概念
                curated = [cid for (cid, _n, _d, _b, slugs, _see) in WD.CONCEPTS
                           if slug in slugs]
                doc_html = linkify(raw_html, curated)
                kw_hits_by_problem[slug] = (curated, plain_text(raw_html))
                # 右侧目录：从 h2/h3 抽出（标题文字 + 锚点）
                toc = []
                for hm in re.finditer(r'<h([23])(?: id="(sec-\d+)")?>(.*?)</h\1>',
                                      raw_html, re.S):
                    text = re.sub(r"<[^>]+>", "", hm.group(3)).strip()
                    if hm.group(2):
                        toc.append({"id": hm.group(2), "text": text, "lvl": int(hm.group(1))})
                toc_by_problem[slug] = toc
                break

        # 源码：去注释版 + 原版
        srcs = []
        for (label, pat, kind) in SOURCES:
            fn = pat.format(main=main)
            path = os.path.join(src_dir, fn)
            if not os.path.isfile(path):
                continue
            raw = io.open(path, encoding="utf-8").read().replace("\r\n", "\n")
            stripped = strip_comments_py(raw) if kind == "py" else strip_comments_c(raw)
            srcs.append({"label": label, "file": fn, "lang": kind,
                         "stripped": stripped, "original": raw})

        # 验证脚本（有就附上，便于读者自己复跑）
        for f in sorted(os.listdir(src_dir)):
            if f.startswith("verify_") and f.endswith(".py"):
                raw = io.open(os.path.join(src_dir, f), encoding="utf-8").read()
                srcs.append({"label": "验证脚本 " + f, "file": f, "lang": "py",
                             "stripped": strip_comments_py(raw), "original": raw})

        js = ("/* 本题源码（构建时生成）—— stripped 为去注释版，original 为原版 */\n"
              "window.AVL_SOURCES = " + json.dumps(srcs, ensure_ascii=False) + ";\n")
        io.open(os.path.join(out_dir, "sources.js"), "w", encoding="utf-8",
                newline="\n").write(js)

        data.append({
            "slug": slug, "dir": dirname, "title": title, "cat": cat,
            "catId": concept_of_problem(slug),
            "cx": cx, "fmt": fmt, "summary": summary,
            "docName": doc_name, "doc": doc_html, "hasAnim": has_anim,
            "toc": toc_by_problem.get(slug, []),
            "files": [s["file"] for s in srcs],
        })
        print("[OK] %-12s %-10s 详解 %-22s 动画 %-3s 源码 %d 个"
              % (slug, dirname, doc_name or "（缺）", "有" if has_anim else "无", len(srcs)))

    # ---- 联动：概念反链 / 相关题目 / 上下篇 ----
    all_slugs = [p["slug"] for p in data]
    concepts_by_problem = {}
    for p in data:
        s = p["slug"]
        concepts_by_problem[s] = sorted(kw_hits_by_problem.get(s, ([], ""))[0])
        p["concepts"] = concepts_by_problem[s]
    for i, p in enumerate(data):
        p["prev"] = all_slugs[i - 1] if i > 0 else None
        p["next"] = all_slugs[i + 1] if i + 1 < len(all_slugs) else None
        p["related"] = related_problems(p["slug"], concepts_by_problem, all_slugs)

    # ---- 反向核对：人工反链名单 vs 那篇正文（纯文本）里到底提没提 ----
    # 只查这个方向：人工反链是"声明"，正文必须能找到支撑。
    # 反方向（正文提到但没列）**故意不查** —— "不是 EOF / 不是哨兵"这种对比句会大量误报。
    issues = []
    for (cid, name, _d, _b, slugs, _see) in WD.CONCEPTS:
        if cid in getattr(WD, "GLOBAL_CONCEPTS", set()):
            continue                      # 全题通用：不逐题核正文（见 wiki_data 注释）
        words = KEYWORDS.get(cid, [])
        for s in slugs:
            if s not in kw_hits_by_problem:
                issues.append("反链里的 slug 在题目表里不存在：%s -> %s" % (cid, s))
                continue
            _cur, plain = kw_hits_by_problem[s]
            if words and not any(w in plain for w in words):
                issues.append("%-18s 反链列了 %-12s，但正文里找不到关键词「%s」"
                              % (cid, s, " / ".join(words)))
    covered = {}
    for (cid, _n, _d, slugs) in WD.CATEGORIES:
        for s in slugs:
            covered.setdefault(s, []).append(cid)
    for p in data:
        got = covered.get(p["slug"], [])
        if len(got) != 1:
            issues.append("分类覆盖异常：%s 落在 %s" % (p["slug"], got or "（无）"))

    wiki = {
        "categories": [{"id": cid, "name": name, "desc": inline(desc), "problems": slugs}
                       for (cid, name, desc, slugs) in WD.CATEGORIES],
        "concepts": [{"id": cid, "name": name, "def": inline(defn),
                      "body": [inline(x) for x in body],
                      "problems": slugs, "see": see}
                     for (cid, name, defn, body, slugs, see) in WD.CONCEPTS],
        "snippets": [{"id": sid, "name": name, "lang": lang,
                      "desc": [inline(x) for x in desc],
                      "code": "\n".join(code), "problems": slugs}
                     for (sid, name, lang, desc, code, slugs) in WD.SNIPPETS],
    }
    wjs = ("/* 知识实体（构建时生成）：分类 / 概念 / 代码片段 */\nwindow.AVL_WIKI = "
           + json.dumps(wiki, ensure_ascii=False, indent=1) + ";\n")
    io.open(os.path.join(OUT_ROOT, "assets", "wiki.js"), "w", encoding="utf-8",
            newline="\n").write(wjs)
    print("wiki.js：分类 %d / 概念 %d / 片段 %d（%.0f KB）"
          % (len(wiki["categories"]), len(wiki["concepts"]), len(wiki["snippets"]),
             len(wjs.encode("utf-8")) / 1024.0))
    if issues:
        print("\n[!] 反链与正文对不上 %d 处（不影响构建，但应当修掉）：" % len(issues))
        for x in issues[:20]:
            print("    " + x)
    else:
        print("反链一致性：手写反链与正文关键词**全部对得上** ✓")

    js = ("/* 站点数据（构建时生成，别手改） */\nwindow.AVL_DATA = "
          + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    os.makedirs(os.path.join(OUT_ROOT, "assets"), exist_ok=True)
    io.open(os.path.join(OUT_ROOT, "assets", "data.js"), "w", encoding="utf-8",
            newline="\n").write(js)
    print("\n共 %d 题 -> assets/data.js（%.0f KB）"
          % (len(data), len(js.encode("utf-8")) / 1024.0))

    stamp_assets()
    return data


def stamp_assets():
    """给 index.html 里的 assets/*.css|js 打上 ?v=<时间戳>，避免浏览器强缓存看不到新版。

    （知识库《部署包封装与平台对接》的经验：CSS/JS 加版本参数是最省事的防缓存手段 ——
      用户不用记得 Ctrl+F5。）
    用正则替换而不是字符串占位符：这样**重复构建**也能一直更新版本号，
    不会因为第一次替换把占位符吃掉而失效。
    """
    import time
    idx = os.path.join(OUT_ROOT, "index.html")
    if not os.path.isfile(idx):
        print("（没有 index.html，跳过版本号替换）")
        return
    src = io.open(idx, encoding="utf-8").read()
    ver = time.strftime("%Y%m%d%H%M%S")
    new = re.sub(r'(assets/[A-Za-z0-9_.-]+\.(?:css|js)\?v=)[^"\']*', r"\g<1>" + ver, src)
    if new != src:
        io.open(idx, "w", encoding="utf-8", newline="\n").write(new)
        print("index.html 资源版本号 -> " + ver)
    else:
        print("（index.html 里没有 ?v= 资源引用，未改）")


if __name__ == "__main__":
    build()
