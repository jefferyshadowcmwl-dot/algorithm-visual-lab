/* 算法可视化实验室 —— 前端（无依赖、离线可用）
 * 数据：assets/data.js（题目） + assets/wiki.js（分类 / 概念 / 代码片段）
 * 源码：problems/<slug>/sources.js（按需加载）
 * 动画：problems/<slug>/animation.html（切到动画标签才设 iframe.src）
 *
 * 路由（hash，可分享）：
 *   #/                     首页
 *   #/p/<slug>[/doc|anim|src]   题目
 *   #/c/<catId>            分类
 *   #/k/<conceptId>        概念
 *   #/s[/<snippetId>]      代码片段
 *   #/idx                  概念索引
 */
(function () {
  "use strict";

  var DATA = window.AVL_DATA || [];
  var WIKI = window.AVL_WIKI || { categories: [], concepts: [], snippets: [] };
  var BY_SLUG = {}, CAT = {}, CON = {}, SNIP = {};
  DATA.forEach(function (p, i) { p.no = i + 1; BY_SLUG[p.slug] = p; });
  WIKI.categories.forEach(function (c) { CAT[c.id] = c; });
  WIKI.concepts.forEach(function (c) { CON[c.id] = c; });
  WIKI.snippets.forEach(function (s) { SNIP[s.id] = s; });

  var $ = function (id) { return document.getElementById(id); };
  var viewEl = $("view"), listEl = $("list"), qEl = $("q"), navEl = $("wiknav"),
      resEl = $("searchResult");

  var curSlug = null, curTab = "doc";
  var srcCache = {}, srcState = { i: 0, stripped: true };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  /* 概念定义、片段说明这些在构建时**已经渲染过行内标记**（**粗体** -> <strong>、`x` -> <code>），
     是可信 HTML。要放进"卡片摘要"这种纯文本位置时，得**剥标签**而不是再 esc 一遍 ——
     否则页面上会直接看到 <strong></strong> 字样（本轮实测踩到）。
     注意：剥标签后不要反转义 &lt; 之类，浏览器渲染时会自己还原。 */
  function plain(html) {
    return String(html).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function catOf(slug) {
    var p = BY_SLUG[slug];
    return p && p.catId ? CAT[p.catId] : null;
  }
  /* wiki 里的 def/body/desc 在构建时已经渲染过行内标记（**粗体**、`代码`），
     这里是**可信 HTML**，直接插入；只有用户可见的纯文本才走 esc()。 */
  function pTitle(slug) { return BY_SLUG[slug] ? BY_SLUG[slug].title : slug; }
  function crumbs(trail) {
    var out = ['<nav class="crumb" aria-label="面包屑">'];
    trail.forEach(function (t, i) {
      if (i) out.push('<span class="sep" aria-hidden="true">›</span>');
      out.push(t.href ? '<a href="' + t.href + '">' + esc(t.text) + "</a>"
                      : '<span aria-current="page">' + esc(t.text) + "</span>");
    });
    return out.join("") + "</nav>";
  }
  function mkChip(text, href, kind) {
    var cls = "chip" + (kind ? " " + kind : "");
    return href ? '<a class="' + cls + '" href="' + href + '">' + esc(text) + "</a>"
                : '<span class="' + cls + '">' + esc(text) + "</span>";
  }

  /* ---------------------------------------------------------------- 侧栏 */
  function renderList(filter) {
    var kw = (filter || "").trim().toLowerCase();
    var hits = DATA.filter(function (p) {
      if (!kw) return true;
      return [p.title, p.cat, p.cx, p.summary, p.dir, p.fmt].join(" ").toLowerCase()
        .indexOf(kw) >= 0;
    });
    if (!hits.length) {
      listEl.innerHTML = '<p class="empty">没有匹配的题目</p>';
      return;
    }
    listEl.innerHTML = hits.map(function (p) {
      return '<a class="item" href="#/p/' + p.slug + '"' +
        (p.slug === curSlug ? ' aria-current="page"' : "") + ">" +
        '<span class="idx">' + pad2(p.no) + "</span>" +
        '<span><span class="t">' + esc(p.title) + "</span>" +
        '<span class="m">' + esc(p.cat) + " · " + esc(p.cx) + "</span></span></a>";
    }).join("");
  }

  function renderWikNav() {
    var cnt = {};
    WIKI.concepts.forEach(function (c) {
      c.problems.forEach(function (s) { cnt[s] = (cnt[s] || 0) + 1; });
    });
    navEl.innerHTML =
      '<div class="navhead">知识导航</div>' +
      '<a class="navlink" href="#/idx">概念索引 <b>' + WIKI.concepts.length + "</b></a>" +
      '<div class="navcats">' +
      WIKI.categories.map(function (c) {
        return '<a class="navlink sub" href="#/c/' + c.id + '">' + esc(c.name) +
          " <b>" + c.problems.length + "</b></a>";
      }).join("") + "</div>" +
      '<a class="navlink" href="#/s">代码片段 <b>' + WIKI.snippets.length + "</b></a>";
  }

  /* ---------------------------------------------------------------- 搜索 */
  function mark(text, kw) {
    var i = text.toLowerCase().indexOf(kw);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + kw.length)) +
           "</mark>" + esc(text.slice(i + kw.length));
  }
  function search(kw) {
    var k = kw.toLowerCase(), out = [];
    DATA.forEach(function (p) {
      var hay = [p.title, p.summary, p.cat, p.cx, p.fmt, p.dir].join(" ").toLowerCase();
      if (hay.indexOf(k) >= 0) {
        out.push({ href: "#/p/" + p.slug, kind: "题目", label: p.title,
                   hint: p.cat + " · " + p.cx });
      }
    });
    WIKI.concepts.forEach(function (c) {
      var hay = [c.name, c.def, c.body.join(" ")].join(" ").toLowerCase();
      if (hay.indexOf(k) >= 0) {
        out.push({ href: "#/k/" + c.id, kind: "概念", label: c.name,
                   hint: c.problems.length + " 道题关联" });
      }
    });
    WIKI.snippets.forEach(function (s) {
      var hay = [s.name, s.desc.join(" "), s.code].join(" ").toLowerCase();
      if (hay.indexOf(k) >= 0) {
        out.push({ href: "#/s/" + s.id, kind: "片段", label: s.name,
                   hint: "用于 " + s.problems.length + " 道题" });
      }
    });
    return out;
  }
  function renderSearch() {
    var kw = qEl.value.trim();
    if (kw.length < 1) { resEl.hidden = true; resEl.innerHTML = ""; return; }
    var hits = search(kw);
    resEl.hidden = false;
    if (!hits.length) {
      resEl.innerHTML = '<p class="empty">没找到「' + esc(kw) + '」</p>';
      return;
    }
    resEl.innerHTML = hits.slice(0, 12).map(function (h) {
      return '<a class="sres" href="' + h.href + '"><span class="kind">' + h.kind +
        "</span><span class=\"sl\">" + mark(h.label, kw.toLowerCase()) +
        '</span><span class="sh">' + esc(h.hint) + "</span></a>";
    }).join("");
  }

  /* ---------------------------------------------------------------- 视图：首页 */
  function vHome() {
    var conSorted = WIKI.concepts.slice().sort(function (a, b) {
      return b.problems.length - a.problems.length || a.name.localeCompare(b.name);
    });
    return '' +
      '<header class="head">' +
        '<div class="kicker">算法可视化实验室</div>' +
        "<h2><span class=\"n\">10</span>道经典算法题 · 知识 wiki</h2>" +
        '<p class="sum">每道题都有：<b>详解</b>（含判题格式怎么反推、边界与陷阱、验证记录）、' +
        '<b>可交互动画</b>、<b>可一键复制的去注释源码</b>。' +
        "题解里的概念会自动链到概念页，概念页再反链回所有用到它的题目 —— 可以顺着链接一路读下去。</p>" +
        '<div class="chips">' +
          mkChip("题目 " + DATA.length, null, "neutral") +
          mkChip("分类 " + WIKI.categories.length, "#/idx", "neutral") +
          mkChip("概念 " + WIKI.concepts.length, "#/idx", "neutral") +
          mkChip("代码片段 " + WIKI.snippets.length, "#/s", "neutral") +
        "</div>" +
      "</header>" +
      '<h3 class="sect">按分类读</h3>' +
      '<div class="grid">' + WIKI.categories.map(function (c) {
        return '<a class="card" href="#/c/' + c.id + '"><h4>' + esc(c.name) +
          '<span class="cnt">' + c.problems.length + " 题</span></h4><p>" +
          c.desc + '</p><p class="mini">' +
          c.problems.map(function (s) { return esc(pTitle(s)); }).join(" · ") +
          "</p></a>";
      }).join("") + "</div>" +
      '<h3 class="sect">概念速览<span class="hint">按关联题目数排序，点进去看反链</span></h3>' +
      '<div class="kwlist">' + conSorted.slice(0, 12).map(function (c) {
        return '<a class="kwchip" href="#/k/' + c.id + '">' + esc(c.name) +
          '<b>' + c.problems.length + "</b></a>";
      }).join("") + "（共 " + WIKI.concepts.length + ' 条，<a href="#/idx">看全部 →</a>）</div>' +
      '<h3 class="sect">可复用代码片段</h3>' +
      '<div class="grid">' + WIKI.snippets.map(function (s) {
        return '<a class="card" href="#/s/' + s.id + '"><h4>' + esc(s.name) +
          '<span class="cnt">' + s.problems.length + " 题在用</span></h4><p>" +
          esc(plain(s.desc[0]).slice(0, 92)) + "…</p></a>";
      }).join("") + "</div>";
  }

  /* ---------------------------------------------------------------- 视图：分类 */
  function vCategory(id) {
    var c = CAT[id];
    if (!c) return notFound("分类不存在");
    var cons = WIKI.concepts.filter(function (k) {
      return c.problems.filter(function (s) { return k.problems.indexOf(s) >= 0; }).length >= 2;
    });
    return crumbs([{ text: "首页", href: "#/" }, { text: "分类" }, { text: c.name }]) +
      '<header class="head">' +
        '<div class="kicker">分类 · ' + c.problems.length + " 题</div>" +
        "<h2>" + esc(c.name) + "</h2><p class=\"sum\">" + c.desc + "</p></header>" +
      '<h3 class="sect">这个分类下的题目</h3>' +
      '<div class="grid">' + c.problems.map(function (s) {
        var p = BY_SLUG[s];
        return '<a class="card" href="#/p/' + s + '"><h4>' + esc(p.title) +
          '<span class="cnt">' + esc(p.cx) + "</span></h4><p>" + esc(p.summary) +
          '</p><p class="mini">' + esc(p.fmt) + "</p></a>";
      }).join("") + "</div>" +
      (cons.length ? '<h3 class="sect">这一类的公共概念<span class="hint">至少两道题共同涉及</span></h3>' +
        '<div class="kwlist">' + cons.map(function (k) {
          var n = c.problems.filter(function (s) { return k.problems.indexOf(s) >= 0; }).length;
          return '<a class="kwchip" href="#/k/' + k.id + '">' + esc(k.name) +
            "<b>" + n + "</b></a>";
        }).join("") + "</div>" : "");
  }

  /* ---------------------------------------------------------------- 视图：概念 */
  function vConcept(id) {
    var c = CON[id];
    if (!c) return notFound("概念不存在");
    var usedBySnippets = WIKI.snippets.filter(function (s) {
      return s.problems.some(function (sl) { return c.problems.indexOf(sl) >= 0; });
    });
    return crumbs([{ text: "首页", href: "#/" }, { text: "概念索引", href: "#/idx" },
                   { text: c.name }]) +
      '<header class="head">' +
        '<div class="kicker">概念 · 关联 ' + c.problems.length + " 道题</div>" +
        "<h2>" + esc(c.name) + "</h2><p class=\"sum\">" + c.def + "</p></header>" +
      '<div class="prose concept-body">' +
        "<ul>" + c.body.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" +
      "</div>" +
      '<h3 class="sect">哪些题用到了它<span class="hint">反向链接</span></h3>' +
      '<div class="kwlist">' + c.problems.map(function (s) {
        return '<a class="kwchip" href="#/p/' + s + '">' + esc(pTitle(s)) + "</a>";
      }).join("") + "</div>" +
      (c.see && c.see.length ? '<h3 class="sect">相关概念</h3><div class="kwlist">' +
        c.see.map(function (k) {
          return CON[k] ? '<a class="kwchip" href="#/k/' + k + '">' + esc(CON[k].name) +
            "</a>" : "";
        }).join("") + "</div>" : "") +
      (usedBySnippets.length ? '<h3 class="sect">相关代码片段</h3><div class="kwlist">' +
        usedBySnippets.map(function (s) {
          return '<a class="kwchip" href="#/s/' + s.id + '">' + esc(s.name) + "</a>";
        }).join("") + "</div>" : "");
  }

  /* ---------------------------------------------------------------- 视图：片段 */
  function vSnippet(id) {
    if (id) {
      var s = SNIP[id];
      if (!s) return notFound("片段不存在");
      return crumbs([{ text: "首页", href: "#/" }, { text: "代码片段", href: "#/s" },
                     { text: s.name }]) +
        "<header class=\"head\"><div class=\"kicker\">代码片段 · " + esc(s.lang) +
        "</div><h2>" + esc(s.name) + "</h2></header>" +
        '<div class="prose snippetcopy">' +
          "<ul>" + s.desc.map(function (d) { return "<li>" + d + "</li>"; }).join("") +
        "</ul></div>" +
        '<div class="codewrap"><div class="codebar"><span class="fname">' +
          esc(s.id) + "." + esc(s.lang) + "</span><span>" + s.code.split("\n").length +
          ' 行</span><span class="right"><button class="btn primary" id="btnCopy">复制这段代码</button></span>' +
        "</div><pre class=\"lines\" id=\"codeLines\">" +
          s.code.split("\n").map(function () {
            return '<div class="ln"><span class="n"></span><span class="t"></span></div>';
          }).join("") + "</pre></div>" +
        '<h3 class="sect">用在哪些题里</h3><div class="kwlist">' +
        s.problems.map(function (sl) {
          return BY_SLUG[sl] ? '<a class="kwchip" href="#/p/' + sl + '">' +
            esc(pTitle(sl)) + "</a>" : "";
        }).join("") + "</div>";
    }
    return crumbs([{ text: "首页", href: "#/" }, { text: "代码片段" }]) +
      '<header class="head"><div class="kicker">' + WIKI.snippets.length +
      ' 段</div><h2>可复用代码片段</h2><p class="sum">' +
      "这些片段是从 10 道题里抽出来的公共写法，题解与概念页会链到这里。</p></header>" +
      '<div class="grid">' + WIKI.snippets.map(function (s) {
        return '<a class="card" href="#/s/' + s.id + '"><h4>' + esc(s.name) +
          '<span class="cnt">' + s.problems.length + " 题在用</span></h4><p>" +
          esc(plain(s.desc[0])) + "</p></a>";
      }).join("") + "</div>";
  }

  /* ---------------------------------------------------------------- 视图：概念索引 */
  function vIndex() {
    return crumbs([{ text: "首页", href: "#/" }, { text: "概念索引" }]) +
      '<header class="head"><div class="kicker">全部知识实体</div>' +
      "<h2>概念索引</h2><p class=\"sum\">" +
      "左边是概念与它关联的题目数；点概念名进概念页，点题目名直接跳题。</p></header>" +
      '<div class="tablewrap"><table><thead><tr><th>概念</th><th>一句话</th>' +
      "<th>关联题目</th></tr></thead><tbody>" +
      WIKI.concepts.map(function (c) {
        return "<tr><td><a href=\"#/k/" + c.id + "\">" + esc(c.name) + "</a></td><td>" +
          c.def + '</td><td class="tagcell">' + c.problems.map(function (s) {
            return '<a class="minitag" href="#/p/' + s + '">' + esc(pTitle(s)) + "</a>";
          }).join("") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function notFound(msg) {
    return '<header class="head"><h2>' + esc(msg) + '</h2><p class="sum">' +
      '<a href="#/">回首页</a></p></header>';
  }

  /* ---------------------------------------------------------------- 视图：题目 */
  function vProblem(slug, tab) {
    var p = BY_SLUG[slug];
    if (!p) return notFound("题目不存在：" + slug);
    curSlug = slug;
    var c = catOf(slug);
    var fmtKind = (p.fmt === "待核") ? "warn" : "neutral";
    var h = crumbs([{ text: "首页", href: "#/" },
                    c ? { text: c.name, href: "#/c/" + c.id } : { text: "题目" },
                    { text: p.title }]) +
      '<header class="head">' +
        '<div class="kicker">第 ' + pad2(p.no) + " 题 · " + esc(p.dir) + " /</div>" +
        "<h2><span class=\"n\">" + pad2(p.no) + "</span>" + esc(p.title) + "</h2>" +
        '<p class="sum">' + esc(p.summary) + "</p>" +
        '<div class="chips">' +
          (c ? mkChip(c.name, "#/c/" + c.id) : "") +
          mkChip(p.cx, null, "neutral") +
          mkChip("判题格式：" + p.fmt, null, fmtKind) +
          mkChip("源码 " + p.files.length + " 份", null, "neutral") +
        "</div>" +
      "</header>";

    // 本页涉及的概念（点进概念页）
    if (p.concepts && p.concepts.length) {
      h += '<div class="kwrow"><span class="kwlabel">本文涉及的概念</span>' +
        p.concepts.map(function (cid) {
          return CON[cid] ? '<a class="kwchip" href="#/k/' + cid + '">' + esc(CON[cid].name) +
            "</a>" : "";
        }).join("") + "</div>";
    }

    h += '<div class="tabs" role="tablist" aria-label="内容切换" id="tabs">' +
      ["doc|详解", "anim|动画", "src|源码"].map(function (t) {
        var kv = t.split("|");
        return '<a class="tab" role="tab" href="#/p/' + slug + "/" + kv[0] + '"' +
          (kv[0] === tab ? ' aria-selected="true"' : ' aria-selected="false"') + ">" +
          esc(kv[1]) + "</a>";
      }).join("") + '<div class="tab-rule" aria-hidden="true"></div></div>';

    h += '<section id="panel-doc" class="panel prose"' +
      (tab === "doc" ? "" : " hidden") + ">" +
      (p.doc || '<p class="placeholder">这道题暂无文档。</p>') + "</section>";
    h += '<section id="panel-anim" class="panel"' + (tab === "anim" ? "" : " hidden") +
      "></section>";
    h += '<section id="panel-src" class="panel"' + (tab === "src" ? "" : " hidden") +
      "></section>";

    // 相关题目 + 上下篇
    if (p.related && p.related.length) {
      h += '<h3 class="sect">相关题目<span class="hint">按共同概念 / 同分类推荐</span></h3>' +
        '<div class="grid">' + p.related.map(function (s) {
          var q = BY_SLUG[s];
          return '<a class="card" href="#/p/' + s + '"><h4>' + esc(q.title) +
            '<span class="cnt">' + esc(q.cx) + "</span></h4><p>" + esc(q.summary) +
            '</p><p class="mini">' + esc(q.cat) + "</p></a>";
        }).join("") + "</div>";
    }
    var pager = [];
    if (p.prev) pager.push('<a class="pager prev" href="#/p/' + p.prev + '">← ' +
      esc(pTitle(p.prev)) + "</a>");
    if (p.next) pager.push('<a class="pager next" href="#/p/' + p.next + '">' +
      esc(pTitle(p.next)) + " →</a>");
    if (pager.length) h += '<div class="pagerrow">' + pager.join("") + "</div>";
    return h;
  }

  /* ---------------------------------------------------------------- 源码面板 */
  function loadSources(slug, done) {
    if (srcCache[slug]) { done(srcCache[slug]); return; }
    var s = document.createElement("script");
    s.src = "problems/" + slug + "/sources.js";
    s.onload = function () {
      var arr = window.AVL_SOURCES || [];
      srcCache[slug] = arr;
      window.AVL_SOURCES = null;
      done(arr);
    };
    s.onerror = function () { done(null); };
    document.head.appendChild(s);
  }

  function mountSrc(slug) {
    var box = $("panel-src");
    if (!box || box.dataset.built) return;
    box.dataset.built = "1";
    box.innerHTML = '<p class="placeholder">正在载入源码…</p>';
    loadSources(slug, function (arr) {
      if (!arr || !arr.length) {
        box.innerHTML = '<p class="placeholder">这道题的源码没找到。</p>';
        return;
      }
      srcState.i = 0; srcState.stripped = true;
      drawSrc(slug, arr);
    });
  }
  function drawSrc(slug, arr) {
    var box = $("panel-src");
    var f = arr[srcState.i];
    var text = srcState.stripped ? f.stripped : f.original;
    var lines = text.split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();

    box.innerHTML =
      '<div class="src-bar">' +
        '<select id="fileSel" aria-label="选择文件">' + arr.map(function (s, i) {
          return '<option value="' + i + '"' + (i === srcState.i ? " selected" : "") + ">" +
            esc(s.label) + "　·　" + esc(s.file) + "</option>";
        }).join("") + "</select>" +
        '<div class="seg" role="group" aria-label="注释显示">' +
          '<button id="btnStrip" aria-pressed="' + (srcState.stripped ? "true" : "false") +
            '">去注释</button>' +
          '<button id="btnRaw" aria-pressed="' + (srcState.stripped ? "false" : "true") +
            '">原版（含注释）</button>' +
        "</div>" +
        '<span class="src-meta">' + lines.length + " 行 · " + text.length + " 字符</span>" +
      "</div>" +
      '<div class="codewrap"><div class="codebar"><span class="fname">' + esc(f.file) +
        "</span><span>" + (srcState.stripped ? "（已去掉注释与文档字符串）"
                                             : "（原始版本，含讲解注释）") +
        '</span><span class="right"><button class="btn primary" id="btnCopy">复制这份源码</button>' +
        "</span></div><pre class=\"lines\" id=\"codeLines\">" + lines.map(function () {
          return '<div class="ln"><span class="n"></span><span class="t"></span></div>';
        }).join("") + "</pre></div>";

    var rows = $("codeLines").children;
    for (var i = 0; i < lines.length; i++) rows[i].lastChild.textContent = lines[i];

    $("fileSel").addEventListener("change", function () {
      srcState.i = parseInt(this.value, 10) || 0;
      drawSrc(slug, arr);
    });
    $("btnStrip").addEventListener("click", function () { srcState.stripped = true; drawSrc(slug, arr); });
    $("btnRaw").addEventListener("click", function () { srcState.stripped = false; drawSrc(slug, arr); });
    $("btnCopy").addEventListener("click", function () { copy(text, this); });
  }

  function copy(text, btn) {
    var ok = function () { flash(btn, "已复制 ✓", "copy-ok"); };
    var fail = function () { flash(btn, "复制失败：请手动全选", "copy-err"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, function () { legacy(text, ok, fail); });
    } else {
      legacy(text, ok, fail);      // file:// 下不是 secure context，走兜底
    }
  }
  function legacy(text, ok, fail) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    document.body.removeChild(ta);
    if (done) { ok(); } else { fail(); }
  }
  function flash(btn, msg, cls) {
    if (!btn) return;
    var old = btn.textContent, oldCls = btn.className;
    btn.textContent = msg; btn.className = oldCls + " " + cls;
    setTimeout(function () { btn.textContent = old; btn.className = oldCls; }, 1800);
  }

  /* ---------------------------------------------------------------- 动画面板 */
  function mountAnim(slug) {
    var box = $("panel-anim");
    if (!box || box.dataset.built) return;
    box.dataset.built = "1";
    var p = BY_SLUG[slug];
    if (!p.hasAnim) { box.innerHTML = '<p class="placeholder">这道题暂无动画。</p>'; return; }
    var url = "problems/" + slug + "/animation.html";
    box.innerHTML =
      '<div class="anim-head">' +
        '<span class="note">动画是自包含单文件（无外链、离线可跑）：可拖动滑块、单步，也可粘贴自己的输入。</span>' +
        '<span><button class="btn" id="animReload">重新载入</button> ' +
        '<a class="btn" href="' + url + '" target="_blank" rel="noopener">在新窗口打开</a></span>' +
      '</div><div class="frame"><iframe id="animFrame" title="' + esc(p.title) +
      ' 动画" loading="lazy" src="' + url + '"></iframe></div>';
    $("animReload").addEventListener("click", function () {
      var f = $("animFrame");
      f.src = "about:blank";
      setTimeout(function () { f.src = url; }, 30);
    });
  }

  /* ---------------------------------------------------------------- 路由 */
  function parseHash() {
    var h = (location.hash || "").replace(/^#/, "");
    var m;
    if ((m = /^\/p\/([^/]+)(?:\/(doc|anim|src))?$/.exec(h))) {
      return { view: "p", slug: m[1], tab: m[2] || "doc" };
    }
    if ((m = /^\/c\/([^/]+)$/.exec(h))) return { view: "c", id: m[1] };
    if ((m = /^\/k\/([^/]+)$/.exec(h))) return { view: "k", id: m[1] };
    if ((m = /^\/s(?:\/([^/]+))?$/.exec(h))) return { view: "s", id: m[1] };
    if (/^\/idx$/.exec(h)) return { view: "idx" };
    return { view: "home" };
  }

  function render() {
    var r = parseHash(), h = "", wasProblem = false;
    if (r.view === "p") {
      h = vProblem(r.slug, r.tab);
      curSlug = r.slug; curTab = r.tab;
      wasProblem = true;
      document.title = BY_SLUG[r.slug] ? BY_SLUG[r.slug].title + " · 算法可视化实验室"
                                       : "算法可视化实验室";
    } else {
      curSlug = null;
      if (r.view === "c") { h = vCategory(r.id); document.title = (CAT[r.id] ? CAT[r.id].name : "分类") + " · 算法可视化实验室"; }
      else if (r.view === "k") { h = vConcept(r.id); document.title = (CON[r.id] ? CON[r.id].name : "概念") + " · 算法可视化实验室"; }
      else if (r.view === "s") { h = vSnippet(r.id); document.title = "代码片段 · 算法可视化实验室"; }
      else if (r.view === "idx") { h = vIndex(); document.title = "概念索引 · 算法可视化实验室"; }
      else { h = vHome(); document.title = "算法可视化实验室 · 10 道经典算法题"; }
    }
    viewEl.innerHTML = h;
    renderList(qEl.value);
    if (wasProblem) {
      mountAnim(r.slug);
      mountSrc(r.slug);
      var rule = viewEl.querySelector(".tab-rule");
      var on = viewEl.querySelector('.tab[aria-selected="true"]');
      if (rule && on) {
        rule.style.width = on.offsetWidth + "px";
        rule.style.left = on.offsetLeft + "px";
      }
      // 片段页也要挂复制按钮
    } else if (r.view === "s" && r.id && SNIP[r.id]) {
      var s = SNIP[r.id];
      var rows = viewEl.querySelectorAll(".ln");
      s.code.split("\n").forEach(function (ln, i) {
        if (rows[i]) rows[i].lastChild.textContent = ln;
      });
      var btn = document.getElementById("btnCopy");
      if (btn) btn.addEventListener("click", function () { copy(s.code, btn); });
    }
    resEl.hidden = true;
    qEl.value = qEl.value;      // 保留搜索串，但收起结果
    viewEl.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------- 事件 */
  qEl.addEventListener("input", renderSearch);
  qEl.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { qEl.value = ""; renderSearch(); }
    if (e.key === "Enter") {
      var first = resEl.querySelector(".sres");
      if (first) { location.hash = first.getAttribute("href"); qEl.blur(); }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== qEl) { e.preventDefault(); qEl.focus(); }
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("resize", function () {
    var rule = viewEl.querySelector(".tab-rule");
    var on = viewEl.querySelector('.tab[aria-selected="true"]');
    if (rule && on) { rule.style.width = on.offsetWidth + "px"; rule.style.left = on.offsetLeft + "px"; }
  });

  /* ---------------------------------------------------------------- 启动 */
  if (!DATA.length) {
    document.body.innerHTML = '<p class="placeholder">数据没载入：先运行 <code>python build_site.py</code>。</p>';
    return;
  }
  renderWikNav();
  render();
})();
