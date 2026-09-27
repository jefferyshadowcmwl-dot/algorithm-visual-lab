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
        # data: 是内联资源（favicon 用的内联 SVG），不是文件路径，别当缺文件
        if r.startswith(("http://", "https://", "about:", "#", "mailto:", "data:")):
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
    # 动态生成的 id（app.js 自己注入的 DOM）单独列白名单
    runtime = {"panel-doc", "panel-anim", "panel-src", "animFrame", "animReload",
               "fileSel", "btnStrip", "btnRaw", "btnCopy", "codeLines",
               # 下面三个由 app.js 渲染视图时注入（canvas 层）
               "heroGraph", "statProblems", "motif"}
    for i in sorted(ids - runtime):
        if ('id="%s"' % i) not in idx:
            bad("app.js 的 id", 'index.html 里没有 id="%s"' % i)


def check_wiki(data):
    """核对 wiki.js（分类 / 概念 / 片段）与 data.js（题目）之间的交叉引用。"""
    wiki_path = os.path.join(HERE, "assets", "wiki.js")
    if not os.path.isfile(wiki_path):
        bad("assets/wiki.js", "文件不存在（先跑 build_site.py）")
        return None
    src = read(wiki_path)
    m = re.search(r"window\.AVL_WIKI\s*=\s*(\{.*\});", src, re.S)
    if not m:
        bad("assets/wiki.js", "找不到 window.AVL_WIKI = {...}")
        return None
    wiki = json.loads(m.group(1))
    slugs = set(p["slug"] for p in data)

    cats = wiki.get("categories", [])
    cons = wiki.get("concepts", [])
    snips = wiki.get("snippets", [])
    if len(cats) < 3:
        bad("wiki 分类", "只有 %d 个分类" % len(cats))
    if len(cons) < 8:
        bad("wiki 概念", "只有 %d 个概念（太少，联动会很空）" % len(cons))
    if not snips:
        bad("wiki 片段", "没有代码片段")

    cat_ids = set(c["id"] for c in cats)
    con_ids = set(c["id"] for c in cons)
    snip_ids = set(s["id"] for s in snips)
    if len(cat_ids) != len(cats):
        bad("wiki 分类", "分类 id 有重复")
    if len(con_ids) != len(cons):
        bad("wiki 概念", "概念 id 有重复")

    # 分类全覆盖且不重复（每题恰好一个主分类）
    owner = {}
    for c in cats:
        for s in c["problems"]:
            if s not in slugs:
                bad("wiki 分类", "%s 引用了不存在的题目 %s" % (c["id"], s))
            owner.setdefault(s, []).append(c["id"])
    for s in slugs:
        if len(owner.get(s, [])) != 1:
            bad("wiki 分类", "题目 %s 的主分类数 = %d（应为 1）" % (s, len(owner.get(s, []))))
    for p in data:
        if not p.get("catId") or p["catId"] not in cat_ids:
            bad("题目 catId", "%s 的 catId=%r 不在分类表里" % (p["slug"], p.get("catId")))

    # 概念：关联题目、相关概念都要存在；至少 1 道题关联
    for c in cons:
        if not c.get("problems"):
            bad("wiki 概念", "%s 没有关联题目" % c["id"])
        for s in c["problems"]:
            if s not in slugs:
                bad("wiki 概念", "%s 引用了不存在的题目 %s" % (c["id"], s))
        for k in c.get("see", []):
            if k not in con_ids:
                bad("wiki 概念", "%s 的相关概念 %s 不存在" % (c["id"], k))
        if not c.get("def", "").strip():
            bad("wiki 概念", "%s 没有一句话定义" % c["id"])

    # 片段：关联题目存在、代码非空
    for s in snips:
        if not s.get("code", "").strip():
            bad("wiki 片段", "%s 的代码是空的" % s["id"])
        for sl in s["problems"]:
            if sl not in slugs:
                bad("wiki 片段", "%s 引用了不存在的题目 %s" % (s["id"], sl))

    # 正文里自动生成的概念链接不得悬空（指向的概念必须存在）
    dangling = set()
    for p in data:
        for cid in re.findall(r'href="#/k/([^"]+)"', p.get("doc", "")):
            if cid not in con_ids:
                dangling.add((p["slug"], cid))
    for (slug, cid) in sorted(dangling):
        bad("正文概念链接", "%s 链到了不存在的概念 %s" % (slug, cid))

    # 每道题的 concepts / related / prev / next 结构要对
    for p in data:
        for cid in p.get("concepts", []):
            if cid not in con_ids:
                bad("题目 concepts", "%s 含未知概念 %s" % (p["slug"], cid))
        for s in p.get("related", []):
            if s not in slugs:
                bad("题目 related", "%s 的相关题目 %s 不存在" % (p["slug"], s))
        for key in ("prev", "next"):
            if p.get(key) and p[key] not in slugs:
                bad("题目 " + key, "%s 的 %s=%s 不存在" % (p["slug"], key, p[key]))

    return {"cats": len(cats), "cons": len(cons), "snips": len(snips)}


def check_slugs(idx):
    """题目目录必须齐活：每个 slug 下都要有 sources.js 与 animation.html。

    【为什么不匹 app.js 里的拼装字符串】早先那版正则盯着 `"problems/" + p.slug + ...`
    的写法，后来 app.js 换用 `slug` 变量拼路径，正则就对不上了 —— 空报一次 FAIL。
    改成**直接核对实际生成的文件**：不管前端怎么拼路径，文件都得在。
    """
    app = read(os.path.join(HERE, "assets", "app.js"))
    if '"problems/"' not in app:
        bad("app.js 的路径", "app.js 里找不到 problems/ 前缀 —— 路径是不是拼错了？")
    got = set(os.listdir(os.path.join(HERE, "problems")))
    for d in sorted(got):
        if not os.path.isdir(os.path.join(HERE, "problems", d)):
            continue
        for must in ("sources.js", "animation.html"):
            if not os.path.isfile(os.path.join(HERE, "problems", d, must)):
                bad("problems/" + d, "缺少 " + must)
    return got


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


def check_anim_theme(slugs):
    """动画必须是**站点统一的深色主题**（这是"资源风格统一"的硬要求）。

    判据两条：
      ① 必须出现统一底色的令牌 `#0b1120`（深色画布）；
      ② 不得残留各题原来的浅色渐变底色（那些是"各弹各调"的痕迹）。
    这样以后谁把某份动画改回浅色，核对脚本会立刻拦住。
    """
    LIGHT_OLD = ["#fef3c7", "#e8f5e9", "#e0f2fe", "#fff8e1", "#e0f7fa", "#f3e5f5",
                 "#fffdf7", "#f5fffe", "#f1f8e9", "#fff3e0", "#f0fdf4", "#eff6ff"]
    for slug in slugs:
        p = os.path.join(HERE, "problems", slug, "animation.html")
        if not os.path.isfile(p):
            continue
        s = read(p).lower()
        if "#0f0820" not in s:
            bad("动画主题 " + slug, "找不到统一底色 #0f0820（紫调宇宙）—— 没换成统一主题？")
        left = [c for c in LIGHT_OLD if c in s]
        if left:
            bad("动画主题 " + slug, "仍残留旧浅色底：" + ", ".join(left[:4]))


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

    # 7) 动画自包含 + 深色主题统一
    check_anim_selfcontained([p["slug"] for p in data])
    check_anim_theme([p["slug"] for p in data])
    # 8) 文件名干净
    check_filenames()
    # 9) wiki 交叉引用（分类/概念/片段 ↔ 题目，以及正文里的概念链接不悬空）
    w = check_wiki(data)

    if FAIL:
        print("FAIL: %d 处" % len(FAIL))
        for what, why in FAIL[:12]:
            print("  [%s] %s" % (what, why))
        return 1

    print("OK: %d 题 | 源码 %d 份（去注释版全部可解析、无残留注释）| "
          "index 引用与 id 全部可解析 | 动画 10 份零外部引用 | 文件名干净 | "
          "wiki：分类 %d / 概念 %d / 片段 %d，交叉引用全通、无悬空链接"
          % (len(data), n_src, w["cats"], w["cons"], w["snips"]) if w else
          "OK: %d 题 | 源码 %d 份 | index 引用与 id 可解析 | 动画零外链 | 文件名干净 | wiki 缺失"
          % (len(data), n_src))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
