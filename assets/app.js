/* 算法可视化实验室 —— 前端逻辑（无依赖、离线可用）
 * 数据：assets/data.js（window.AVL_DATA）
 * 源码：problems/<slug>/sources.js（按需 <script> 懒加载，避免首屏拉 20 份文件）
 * 动画：problems/<slug>/animation.html（按需设 iframe.src，避免一上来就跑 10 个动画）
 */
(function () {
  "use strict";

  var DATA = window.AVL_DATA || [];
  var BY_SLUG = {};
  DATA.forEach(function (p, i) { p.no = i + 1; BY_SLUG[p.slug] = p; });

  var $ = function (id) { return document.getElementById(id); };
  var listEl = $("list"), headEl = $("head"), qEl = $("q");
  var panels = { doc: $("panel-doc"), anim: $("panel-anim"), src: $("panel-src") };
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var rule = document.querySelector(".tab-rule");

  var curSlug = null, curTab = "doc";
  var srcCache = {};            // slug -> 已载入的源码数组
  var state = { fileIdx: 0, stripped: true };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* ------------------------------------------------------------ 目录 */
  function renderList(filter) {
    var kw = (filter || "").trim().toLowerCase();
    var hits = DATA.filter(function (p) {
      if (!kw) return true;
      var hay = [p.title, p.cat, p.cx, p.summary, p.dir, p.fmt, p.files.join(" ")]
        .join(" ").toLowerCase();
      return hay.indexOf(kw) >= 0;
    });
    if (!hits.length) {
      listEl.innerHTML = '<p class="empty">没有匹配的题目 —— 试试 "DP"、"并查集"、"数论"</p>';
      return;
    }
    listEl.innerHTML = hits.map(function (p) {
      return '<button class="item" role="tab" data-slug="' + p.slug + '"' +
        ' aria-selected="' + (p.slug === curSlug) + '">' +
        '<span class="idx">' + pad2(p.no) + '</span>' +
        '<span><span class="t">' + esc(p.title) + '</span>' +
        '<span class="m">' + esc(p.cat) + ' · ' + esc(p.cx) + '</span></span>' +
        '</button>';
    }).join("");
  }

  /* ------------------------------------------------------------ 头部 */
  function renderHead(p) {
    var fmtWarn = (p.fmt === "待核") ? ' warn' : ' neutral';
    headEl.innerHTML =
      '<div class="kicker">第 ' + pad2(p.no) + ' 题 · ' + esc(p.dir) + ' /</div>' +
      '<h2><span class="n">' + pad2(p.no) + '</span>' + esc(p.title) + '</h2>' +
      '<p class="sum">' + esc(p.summary) + '</p>' +
      '<div class="chips">' +
        '<span class="chip">' + esc(p.cat) + '</span>' +
        '<span class="chip">' + esc(p.cx) + '</span>' +
        '<span class="chip' + fmtWarn + '">判题格式：' + esc(p.fmt) + '</span>' +
        '<span class="chip neutral">源码 ' + p.files.length + ' 份</span>' +
      '</div>';
    document.title = p.title + " · 算法可视化实验室";
  }

  /* ------------------------------------------------------------ 三个面板 */
  function renderDoc(p) {
    panels.doc.innerHTML = p.doc ||
      '<p class="placeholder">这道题暂无文档（其余题都有详解）。</p>';
  }

  function renderAnim(p) {
    if (!p.hasAnim) {
      panels.anim.innerHTML = '<p class="placeholder">这道题暂无动画。</p>';
      return;
    }
    var url = "problems/" + p.slug + "/animation.html";
    panels.anim.innerHTML =
      '<div class="anim-head">' +
        '<span class="note">动画是自包含单文件（无外链、离线可跑）：可拖动滑块、单步，也可粘贴自己的输入。</span>' +
        '<span>' +
          '<button class="btn" id="animReload">重新载入</button> ' +
          '<a class="btn" href="' + url + '" target="_blank" rel="noopener">在新窗口打开</a>' +
        '</span>' +
      '</div>' +
      '<div class="frame"><iframe id="animFrame" title="' + esc(p.title) + ' 动画" ' +
        'loading="lazy" src="' + url + '"></iframe></div>';
    $("animReload").addEventListener("click", function () {
      var f = $("animFrame");
      f.src = "about:blank";                       // 先清空，再赋回，确保真重载
      setTimeout(function () { f.src = url; }, 30);
    });
  }

  function loadSources(p, done) {
    if (srcCache[p.slug]) { done(srcCache[p.slug]); return; }
    var s = document.createElement("script");
    s.src = "problems/" + p.slug + "/sources.js";
    s.onload = function () {
      var arr = window.AVL_SOURCES || [];
      srcCache[p.slug] = arr;
      window.AVL_SOURCES = null;
      done(arr);
    };
    s.onerror = function () { done(null); };
    document.head.appendChild(s);
  }

  function renderSrc(p) {
    panels.src.innerHTML = '<p class="placeholder">正在载入源码…</p>';
    loadSources(p, function (arr) {
      if (!arr || !arr.length) {
        panels.src.innerHTML = '<p class="placeholder">这道题的源码没找到。</p>';
        return;
      }
      state.fileIdx = 0;
      state.stripped = true;
      drawSrc(p, arr);
    });
  }

  function drawSrc(p, arr) {
    var f = arr[state.fileIdx];
    var text = state.stripped ? f.stripped : f.original;
    var lines = text.split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();

    var opts = arr.map(function (s, i) {
      return '<option value="' + i + '"' + (i === state.fileIdx ? " selected" : "") + '>' +
        esc(s.label) + "　·　" + esc(s.file) + '</option>';
    }).join("");

    var body = lines.map(function (ln) {
      var head = ln.replace(/\s+$/, "");
      var isComment = /^\s*(#|\/\/|\/\*|\*)/.test(head);
      return '<div class="ln' + (isComment ? " is-comment" : "") +
        '"><span class="n"></span><span class="t"></span></div>';
    }).join("");

    panels.src.innerHTML =
      '<div class="src-bar">' +
        '<label class="visually-hidden" for="fileSel" style="position:absolute;left:-9999px">选择文件</label>' +
        '<select id="fileSel">' + opts + '</select>' +
        '<div class="seg" role="group" aria-label="注释显示">' +
          '<button id="btnStrip" aria-pressed="' + (state.stripped ? "true" : "false") + '">去注释</button>' +
          '<button id="btnRaw" aria-pressed="' + (state.stripped ? "false" : "true") + '">原版（含注释）</button>' +
        '</div>' +
        '<span class="src-meta">' + lines.length + ' 行 · ' + text.length + ' 字符</span>' +
      '</div>' +
      '<div class="codewrap">' +
        '<div class="codebar"><span class="fname">' + esc(f.file) + '</span>' +
          '<span>' + (state.stripped ? "（已去掉注释与文档字符串）" : "（原始版本，含讲解注释）") + '</span>' +
          '<span class="right"><button class="btn primary" id="btnCopy">复制这份源码</button></span>' +
        '</div>' +
        '<pre class="lines" id="codeLines">' + body + '</pre>' +
      '</div>';

    // 逐行填内容（用 textContent，天然免转义）
    var rows = $("codeLines").children;
    for (var i = 0; i < lines.length; i++) rows[i].lastChild.textContent = lines[i];

    $("fileSel").addEventListener("change", function () {
      state.fileIdx = parseInt(this.value, 10) || 0;
      drawSrc(p, arr);
    });
    $("btnStrip").addEventListener("click", function () { state.stripped = true; drawSrc(p, arr); });
    $("btnRaw").addEventListener("click", function () { state.stripped = false; drawSrc(p, arr); });
    $("btnCopy").addEventListener("click", function () { copy(text, this); });
  }

  function copy(text, btn) {
    var ok = function () { flash(btn, "已复制 ✓", "copy-ok"); };
    var fail = function () { flash(btn, "复制失败：请手动全选", "copy-err"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, function () { legacy(text, ok, fail); });
    } else {
      legacy(text, ok, fail);          // file:// 下不是 secure context，走兜底
    }
  }
  function legacy(text, ok, fail) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
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
    btn.textContent = msg;
    btn.className = oldCls + " " + cls;
    setTimeout(function () { btn.textContent = old; btn.className = oldCls; }, 1800);
  }

  /* ------------------------------------------------------------ 标签页 */
  function moveRule(tab) {
    var b = tab.getBoundingClientRect(), p = tab.parentElement.getBoundingClientRect();
    rule.style.width = b.width + "px";
    rule.style.transform = "translateX(" + (b.left - p.left) + "px)";
  }

  function setTab(name) {
    curTab = name;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      if (on) moveRule(t);
    });
    Object.keys(panels).forEach(function (k) { panels[k].hidden = (k !== name); });
    var p = BY_SLUG[curSlug];
    if (!p) return;
    if (name === "anim" && !panels.anim.dataset.built) {
      renderAnim(p); panels.anim.dataset.built = "1";
    }
    if (name === "src" && !panels.src.dataset.built) {
      renderSrc(p); panels.src.dataset.built = "1";
    }
    location.hash = "#/" + p.slug + "/" + name;
  }

  /* ------------------------------------------------------------ 选题目 */
  function select(slug, tab, opts) {
    var p = BY_SLUG[slug] || DATA[0];
    if (!p) return;
    var changed = (p.slug !== curSlug);
    curSlug = p.slug;
    delete panels.anim.dataset.built;
    delete panels.src.dataset.built;
    renderHead(p);
    renderDoc(p);
    panels.anim.innerHTML = "";
    panels.src.innerHTML = "";
    renderList(qEl.value);
    setTab(tab || "doc");
    if (changed && !(opts && opts.noScroll)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* ------------------------------------------------------------ 事件 */
  listEl.addEventListener("click", function (e) {
    var b = e.target.closest(".item");
    if (b) select(b.dataset.slug, "doc");
  });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { setTab(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {          // 左右键切标签
      var i = tabs.indexOf(t);
      if (e.key === "ArrowRight") { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); var j = (i - 1 + tabs.length) % tabs.length; tabs[j].focus(); tabs[j].click(); }
    });
  });
  qEl.addEventListener("input", function () { renderList(qEl.value); });
  qEl.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { qEl.value = ""; renderList(""); }
    if (e.key === "Enter") {
      var first = listEl.querySelector(".item");
      if (first) { select(first.dataset.slug, "doc"); qEl.blur(); }
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== qEl) {
      e.preventDefault(); qEl.focus();
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {   // 上下键在目录里走
      if (document.activeElement === qEl) return;
      e.preventDefault();
      var items = Array.prototype.slice.call(listEl.querySelectorAll(".item"));
      var at = items.findIndex(function (b) { return b.dataset.slug === curSlug; });
      var next = e.key === "ArrowDown" ? at + 1 : at - 1;
      if (next >= 0 && next < items.length) select(items[next].dataset.slug, curTab, { noScroll: true });
    }
  });
  window.addEventListener("hashchange", function () { fromHash(); });
  window.addEventListener("resize", function () {
    var on = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
    if (on) moveRule(on);
  });

  function fromHash() {
    var m = /^#\/([^/]+)\/(doc|anim|src)$/.exec(location.hash || "");
    select(m ? m[1] : (DATA[0] && DATA[0].slug), m ? m[2] : "doc");
  }

  /* ------------------------------------------------------------ 启动 */
  if (!DATA.length) {
    document.body.innerHTML = '<p class="placeholder">数据没载入：先运行 <code>python build_site.py</code> 生成 assets/data.js。</p>';
    return;
  }
  renderList("");
  fromHash();
  window.addEventListener("load", function () {
    var on = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
    if (on) moveRule(on);
  });
})();
