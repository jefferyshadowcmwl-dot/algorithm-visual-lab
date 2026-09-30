# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 这个仓库是什么

`algorithm-visual-lab` 是 **`E:\沈云付算法\` 的发布产物**：一个静态站点（托管在 GitHub Pages），
把那个仓库里的题解 md、动画 HTML、源码抽出来，组装成能互相跳转的 wiki。

**它自己不产出内容。** 所以有条铁律：

> 改题解 / 改动画 / 加题 / 改源码，**一律去 `E:\沈云付算法\` 改**，改完回这里重新构建。

在本仓库直接改 `assets/data.js`、`assets/wiki.js`、`problems/*` 是**白改** —— 下次 `build_site.py` 会覆盖掉。
反过来，`index.html` / `assets/style.css` / `assets/app.js` / `assets/cosmos.js` / `wiki_data.py`
是**手写文件**，构建脚本不碰它们（这是刻意的分层：重跑构建不会冲掉样式与逻辑）。

两个仓库各自的规矩不同：`E:\沈云付算法\CLAUDE.md` 管的是**每题三件套 + 铁律**（写 OJ 提交版必须遵守），
本文件管的是**站点这一侧**。两边都读一遍再动手最稳。

---

## 三层结构（动手前先认清自己在改哪一层）

| 层 | 文件 | 谁产出 | 手改的后果 |
|---|---|---|---|
| **生成内容** | `assets/data.js`、`assets/wiki.js`、`problems/<slug>/animation.html`、`problems/<slug>/sources.js` | `build_site.py` | 被下次构建覆盖 |
| **手写外壳** | `index.html`、`assets/style.css`、`assets/app.js`、`assets/cosmos.js` | 人 | 保留 |
| **知识实体** | `wiki_data.py`（分类 / 概念 / 代码片段，纯手写） | 人 | 构建时被读取 |

`index.html` 里的 `assets/*.js|css?v=__V__` 由构建替换成时间戳（防缓存），
**重复构建也会刷新版本号**（用的是正则替换，不是一次性占位符）。

---

## 常用命令

```bash
python build_site.py        # 从 E:\沈云付算法 抽取内容 → data.js / wiki.js / problems/*
python verify_site.py       # 站点核对（9 类：资源存在、引用可解析、id 对得上、去注释干净、
                            #   wiki 交叉引用无悬空、动画自包含且统一底色、文件名干净…）
python verify_animation_theme.py --strict   # 10 份动画的主题一致性（硬信号：body 底色、成片浅色块）
python -m http.server 8000  # 本地起服务（改完外壳这样看最接近线上）
start "" index.html         # 或直接双击（离线可用）

python deploy_github.py <token 文件路径>            # 推送到 GitHub（走 API，见下）
python deploy_github.py <token 文件路径> --preflight # 只体检权限/仓库/Pages 状态
```

**单题验证**（在 `E:\沈云付算法\` 里跑，工作目录必须是该题目录）：

```bash
cd "E:\沈云付算法\连通分支数" && node verify_components_animation.js   # 动画逻辑
cd "E:\沈云付算法\n个1"      && python verify_repunit.py               # 算法（对拍 + 端到端）
cd "E:\沈云付算法\n个1"      && python verify_repunit_mutations.py     # 变异测试（断言有没有牙）
```

改了**动画本体**时：`verify_site.py` 只查静态属性和底色，**真正的行为验证在动画自己的 `verify_*_animation.js`**；
改题解 md 时：`build_site.py` 会打印"反链一致性"核对结果，`verify_site.py` 兜底。

---

## 架构要点（这些得读好几个文件才能拼出来）

**数据流**
`E:\沈云付算法\<题>\*详解.md` + `wiki_data.py` → `build_site.py` → `assets/{data,wiki}.js` + `problems/*`
→ `assets/app.js` 按 hash 路由渲染 → `assets/cosmos.js` 负责所有 canvas 与动效。

**① 联动是构建期算好的，不是运行时猜的**
- 题解 md 里的概念关键词（`EOF`、`哨兵`、`最小性`…）在构建时被替换成概念页链接；
- 但**只链「人工反链里已认可」的概念**（`wiki_data.py` 的 `problems` 列表）——
  正文里出现"不是 EOF"这种对比句时不该被链走，准确性优先于覆盖率；
- 链接替换**跳过 `<pre>` / `<code>`**（示例代码里链走容易误点）；
- **反向核对**：概念里声明的反链，必须在对应正文（纯文本）里找得到关键词支撑，
  对不上 `build_site.py` 会打印出来（这是防止"反链和正文各说各话"的那道闸）；
- 题目的「相关题目 / 上下篇 / 本文涉及的概念」也都是构建期算好写进 `data.js` 的。

**② 源码去注释是 tokenize 干的，不是正则**
`#` 会出现在字符串里、行尾注释要按列裁、文档字符串用 `ast` 精确定位 —— 见 `build_site.py:strip_comments_py`。
去注释版是**默认展示**的那份（贴 OJ 不用手删），原版做切换。C 版用状态机（认字符串/字符字面量）。

**③ 前端是"多视图 hash 路由 + 懒加载"**
`#/`、`#/p/<slug>/<doc|anim|src>`、`#/c/<cat>`、`#/k/<concept>`、`#/s[/<id>]`、`#/idx`。
动画的 `iframe.src` 与源码的 `<script>` 都是**切到对应标签才加载**（首屏别拉 10 个动画）。
长文档的右侧目录用 `<button>` + `scrollIntoView` —— **不能用 `#/p/x/doc#sec-1` 这种两层 hash**，
路由解析不了会踢回首页。

**④ canvas 与动效层集中在一个文件**
`assets/cosmos.js`：全站粒子星野背景、首页**可点**的题目关系网络图、每题一个 canvas「结构意象」、
数字滚动、滚动揭示。所有动画循环都走同一个 `loop()`：尊重 `prefers-reduced-motion`（只画静态一帧）、
页面不可见时暂停、DPR 上限 2。

**⑤ 动画是 iframe 引入的自包含单文件**
`problems/<slug>/animation.html` 是 `E:\沈云付算法\` 里那份动画的**原样拷贝**（零外部引用、离线可跑）。
站点主题换了，**动画底色也要同步换**，否则深色外壳里嵌着浅色面板会很突兀 ——
`verify_site.py` 会检查每份动画是否含统一底色 `#0f0820`。

---

## 不变量（改任何东西之前先看这一节）

- **动画零外部引用**（只允许 SVG 的 `xmlns`）；站点外壳的字体走 Google Fonts，但**必须能回落系统字体**（离网仍可用）。
- **一套令牌、一套语义色**：底色 `#0f0820`、面板 `#1a0f2e`/`#21132e`、发丝线 `rgba(186,140,255,.20)`；
  语义固定 —— **紫=品牌/导航、青=信息、绿=成功、橙=当前、红=错误**（后四个与 10 份动画里的"命中/当前/错误"同义）。
  站点与动画必须同时改，别只改一边。
- **计数不得写死**：题量/分类数/概念数/片段数一律从 `data.js`/`wiki.js` 算 —— 题目会持续增加。
- **CSS 媒体查询必须留在文件最后**：媒体查询里的规则与基础规则特异度相同，靠源码顺序决胜；
  组件样式写在它们后面会让小屏覆盖**静默失效**（踩过）。
- **给块级元素写 `flex-direction` 前先确认它有 `display:flex`**：否则是空操作（踩过）。
- **"内容"不许停在错值上**：数字滚动这类动效必须有 `setTimeout` 兜底 ——
  rAF 被节流时（后台标签页、headless）动画会卡住，屏幕上就会停着"7 道经典算法题"（踩过）。
- **文档里的数字必须与实跑一致**；耗时/slope 这类机器相关值要标注"示例值"。
- 站点的核对脚本 `verify_site.py` 是这套结构的**唯一门禁**：它查资源齐全、引用与 id 对得上、
  去注释干净、wiki 无悬空链接、动画统一底色。**改完内容不跑它等于没验。**

---

## 部署（本机 `github.com` 走不通，只能走 API）

这台机器 **`github.com` 主域被拦**（`login/oauth`、`login/device` 全超时），
但 `api.github.com`、`codeload`、`*.github.io` 都通 —— 所以 `git push` 和 `gh auth login` 都不可用，
用 `deploy_github.py`：建仓库（若不存在）→ Git Data API 一次性提交 → 开启 Pages → 轮询 `built`。

- token：classic 勾 `repo` 即可；fine-grained 需要 `Contents: Read and write`（开 Pages 还要 `Pages`），
  且 **fine-grained token 建不了仓库**（GitHub 的限制，得先在浏览器建空仓库）。
- 脚本**不打印 token**、不写进任何文件；`walk_files()` 还会主动跳过"像密钥的文件"（`token*.txt` 等）。
- 空仓库首次部署会先用 Contents API 种一个初始提交（Git Data API 在空仓库上返回 409）。
- 提交信息**取本地最新 commit**（早先写死过一句话，导致线上两次部署信息都与内容不符 —— 踩过）。
- 推送完 Pages 要几十秒到几分钟；看不到新版先 **Ctrl+F5**（资源带 `?v=` 时间戳）。

---

## 已知缺口（不是 bug，但别当成"已完成"）

- **4 题没有动画验证脚本**（`均分纸牌` / `数字三角形` / `最长公共子序列` / `过河问题`）——
  它们的动画改动只能靠实拍核对，强度不如脚本断言。
- **C 实现从未编译验证**（生成它的机器上没有任何 C 编译器），只有"逐行转写成 Python 对拍"的脚本。
- 「判题格式」栏标 **待核** 的题（过河问题等），其输入输出约定尚未用 AC 代码反推确认。
- `过河问题` 动画里的河水/草坡是**场景插画色**（未随主题转紫），属有意保留。
