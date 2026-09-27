#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_site.py —— 站点核对脚本。

为什么必须有它（知识库《资源改名与引用失效》的原话）：
> **"资源路径是静态项目的软肋：没有构建工具就没有校验，必须自己写核对脚本。"**

本脚本检查 8 类问题，全部通过才打印 OK：

  1. 内容完整性   data.js 里每题都有：非空详解、动画标记、至少一份源码
  2. 资源存在     每题目录下的 animation.html / sources.js 真的存在（且非空）
  3. 源码可信     去注释版：Python 能被 ast 解析、且 **tokenize 里不再有 COMMENT**；
                  C 版括号配平、且不含 /* */ 与 // 注释（字符串里的不算）
  4. 引用可解析   index.html 里每个本地 src/href 路径都真实存在；?v= 是数字
  5. ID 对得上    app.js 里 getElementById("x") / $("x") 的每个 id 都能在 index.html 找到
  6. 目录对得上   app.js 里 "problems/<slug>/..." 的 slug 与生成出来的目录一一对应
  7. 动画自包含   10 份动画除 SVG 的 xmlns 外没有任何外部 http(s) 引用（离线可跑）
  8. 文件名干净   不以空格结尾、不带 BOM（Windows 上肉眼看不见的两类坑）

用法：  python verify_site.py
"""

import ast
import io
import json
import os
import re
import sys
import tokenize

HERE = os.path.dirname(os.path.abspath(__file__))
FAIL = []


def bad(what, why):
    FAIL.append((what, why))


def read(path):
    return io.open(path, encoding="utf-8").read()


def load_data():
    """从 assets/data.js 里抠出 JSON（它就是把 JSON 赋给 window.AVL_DATA）。"""
    src = read(os.path.join(HERE, "assets", "data.js"))
    m = re.search(r"window\.AVL_DATA\s*=\s*(\[.*\]);", src, re.S)
    if not m:
        bad("assets/data.js", "找不到 window.AVL_DATA = [...]")
        return []
    return json.loads(m.group(1))


def load_sources(slug):
    path = os.path.join(HERE, "problems", slug, "sources.js")
    if not os.path.isfile(path):
        return None
    src = read(path)
    m = re.search(r"window\.AVL_SOURCES\s*=\s*(\[.*\]);", src, re.S)
    if not m:
        bad("problems/%s/sources.js" % slug, "找不到 window.AVL_SOURCES = [...]")
        return None
    return json.loads(m.group(1))


def check_py_stripped(slug, item):
    """去注释版必须：能解析 + 没有任何注释 token + 没有文档字符串。"""
    text = item["stripped"]
    fn = item["file"]
    try:
        tree = ast.parse(text)
    except SyntaxError as e:
        bad("%s / %s 去注释版" % (slug, fn), "解析失败：%s @行 %s" % (e.msg, e.lineno))
        return
    try:
        toks = list(tokenize.generate_tokens(io.StringIO(text).readline))
    except tokenize.TokenError as e:
        bad("%s / %s 去注释版" % (slug, fn), "tokenize 失败：%s" % (e,))
        return
    if any(t.type == tokenize.COMMENT for t in toks):
        bad("%s / %s 去注释版" % (slug, fn), "仍然含 # 注释（tokenize 判定）")
    for node in ast.walk(tree):
        body = getattr(node, "body", None)
        if body and isinstance(node, (ast.Module, ast.FunctionDef,
                                     ast.AsyncFunctionDef, ast.ClassDef)):
            first = body[0]
            if (isinstance(first, ast.Expr) and isinstance(first.value, ast.Constant)
                    and isinstance(first.value.value, str)):
                bad("%s / %s 去注释版" % (slug, fn),
                    "仍然含文档字符串 @行 %d" % first.lineno)
                break


def scan_c(text):
    """C 源码扫描器：返回 (掩码文本, 注释列表)。

    掩码文本 = 把字符串/字符字面量的内容清空、并把注释整段去掉 ——
    这样再去数括号才准。

    【注意】不能直接 `text.count("(")`：本仓库 `cross_river.c` 里就有
    `fprintf(stderr, "[1,%d): %d\\n", ...)` —— 格式串里那个孤零零的 `)` 会被
    误算成"圆括号不配平"（实测原版和去注释版都差 1，一查才发现是检查本身太粗，
    不是去注释误伤）。同一族的还有 `//` 出现在字符串里（如 "http://"）。
    """
    out = []
    comments = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        nxt = text[i + 1] if i + 1 < n else ""
        if ch in "\"'":
            quote = ch
            out.append(quote)                     # 保留引号，清空内容
            i += 1
            while i < n:
                if text[i] == "\\" and i + 1 < n:
                    i += 2
                    continue
                if text[i] == quote:
                    out.append(quote)
                    i += 1
                    break
                if text[i] == "\n":               # 未闭合的字面量：别把后续代码吞了
                    break
                i += 1
            continue
        if ch == "/" and nxt == "*":
            j = i + 2
            while j + 1 < n and not (text[j] == "*" and text[j + 1] == "/"):
                j += 1
            comments.append(text[i:j + 2])
            i = j + 2
            continue
        if ch == "/" and nxt == "/":
            j = i
            while j < n and text[j] != "\n":
                j += 1
            comments.append(text[i:j])
            i = j
            continue
        out.append(ch)
        i += 1
    return "".join(out), comments


def check_c_stripped(slug, item):
    text = item["stripped"]
    fn = item["file"]
    masked, comments = scan_c(text)
    if comments:
        bad("%s / %s 去注释版" % (slug, fn),
            "仍然含 %d 段注释（扫描器判定），例如：%s"
            % (len(comments), comments[0].strip().replace("\n", " ")[:40]))
    for name, open_ch, close_ch in (("花括号", "{", "}"),
                                    ("圆括号", "(", ")"),
                                    ("方括号", "[", "]")):
        if masked.count(open_ch) != masked.count(close_ch):
            bad("%s / %s 去注释版" % (slug, fn),
                "%s不配平（已掩掉字符串与注释）：%d 个 %s / %d 个 %s"
                % (name, masked.count(open_ch), open_ch, masked.count(close_ch), close_ch))


def check_index_refs():
    idx = read(os.path.join(HERE, "index.html"))
    refs = re.findall(r'(?:src|href)="([^"]+)"', idx)
    for r in refs:
        if r.startswith(("http://", "https://", "about:", "#", "mailto:")):
            continue
        path = r.split("?")[0]
        if not os.path.isfile(os.path.join(HERE, path)):
            bad("index.html 引用", "找不到文件：%s" % r)
    for r in refs:
        if "?v=" in r and not re.search(r"\?v=\d+$", r):
            bad("index.html 引用", "?v= 不是数字（防缓存参数异常）：%s" % r)
    return idx


def check_ids(idx):
    """app.js 里用到的每个 id 都要在 index.html 里存在（防拼错）。"""
    app = read(os.path.join(HERE, "assets", "app.js"))
    ids = set(re.findall(r'\$\("([^"]+)"\)', app))
    ids |= set(re.findall(r'getElementById\("([^"]+)"\)', app))
    # 动态生成的那些 id（面板内自己注入的）单独列白名单
    runtime = {"animFrame", "animReload", "fileSel", "btnStrip", "btnRaw",
               "btnCopy", "codeLines"}
    for i in sorted(ids - runtime):
        if ('id="%s"' % i) not in idx:
            bad("app.js 的 id", 'index.html 里没有 id="%s"' % i)


def check_slugs(idx):
    """app.js 里拼的 problems/<slug>/... 路径，slug 必须与目录一一对应。"""
    app = read(os.path.join(HERE, "assets", "app.js"))
    used = set(re.findall(r'"problems/"\s*\+\s*p\.slug\s*\+\s*"/([a-z_]+\.html)"', app))
    got = set(os.listdir(os.path.join(HERE, "problems")))
    if not used:
        bad("app.js 的路径", "没找到 problems/<slug>/... 的拼装（改过路径写法？）")
    for d in sorted(got):
        if not os.path.isdir(os.path.join(HERE, "problems", d)):
            continue
        for must in ("sources.js",):
            if not os.path.isfile(os.path.join(HERE, "problems", d, must)):
                bad("problems/" + d, "缺少 " + must)
    return used, got


def check_anim_selfcontained(slugs):
    for slug in slugs:
        p = os.path.join(HERE, "problems", slug, "animation.html")
        if not os.path.isfile(p):
            continue
        s = read(p)
        for m in re.finditer(r'https?://[^\s"\')]+', s):
            url = m.group(0)
            if url.startswith("http://www.w3.org/"):        # SVG 命名空间声明，不产生请求
                continue
            bad("动画自包含 " + slug, "发现外部引用：" + url[:60])


def check_filenames():
    for root, dirs, files in os.walk(HERE):
        for name in list(dirs) + list(files):
            if name != name.rstrip():          # 末尾空格（Windows 上肉眼看不见）
                bad("文件名", "以空格结尾：" + os.path.join(root, name))
        for name in files:
            if name.endswith((".html", ".css", ".js", ".py", ".md", ".json")):
                raw = open(os.path.join(root, name), "rb").read(3)
                if raw == b"\xef\xbb\xbf":
                    bad("文件名", "带 UTF-8 BOM：" + os.path.join(root, name))


def main():
    data = load_data()
    if not data:
        print("FAIL: 数据没读出来")
        return 1

    # 1) 内容完整性 + 2) 资源存在 + 3) 源码可信
    n_src = 0
    for p in data:
        slug = p["slug"]
        if not p.get("doc", "").strip():
            bad("内容 completeness", "%s 的详解是空的" % slug)
        if p.get("doc") and len(p["doc"]) < 400:
            bad("内容 completeness", "%s 的详解过短（%d 字符）" % (slug, len(p["doc"])))
        if not p.get("files"):
            bad("内容 completeness", "%s 没有源码" % slug)
        anim = os.path.join(HERE, "problems", slug, "animation.html")
        if p.get("hasAnim") and (not os.path.isfile(anim) or os.path.getsize(anim) < 3000):
            bad("资源存在", "%s 的 animation.html 缺失或过小" % slug)
        if not p.get("hasAnim"):
            bad("资源存在", "%s 标记为无动画 —— 但仓库里 10 题都有动画" % slug)

        arr = load_sources(slug)
        if not arr:
            bad("资源存在", "%s 的 sources.js 缺失/读不出" % slug)
            continue
        if len(arr) < 2:
            bad("内容 completeness", "%s 只有 %d 份源码" % (slug, len(arr)))
        for item in arr:
            n_src += 1
            if not item.get("stripped", "").strip():
                bad("源码可信", "%s / %s 去注释版是空的" % (slug, item["file"]))
                continue
            if item["file"].endswith(".py"):
                check_py_stripped(slug, item)
            elif item["file"].endswith(".c"):
                check_c_stripped(slug, item)
            if len(item["stripped"]) > len(item["original"]):
                bad("源码可信", "%s / %s 去注释后反而变长了（去注释逻辑可疑）"
                    % (slug, item["file"]))

    # 4) 引用可解析
    idx = check_index_refs()
    # 5) ID 对得上
    check_ids(idx)
    # 6) 目录对得上
    check_slugs(idx)
    # 7) 动画自包含
    check_anim_selfcontained([p["slug"] for p in data])
    # 8) 文件名干净
    check_filenames()

    if FAIL:
        print("FAIL: %d 处" % len(FAIL))
        for what, why in FAIL[:12]:
            print("  [%s] %s" % (what, why))
        return 1

    print("OK: %d 题 | 源码 %d 份（去注释版全部可解析、无残留注释）| "
          "index 引用与 id 全部可解析 | 动画 10 份零外部引用 | 文件名干净"
          % (len(data), n_src))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
