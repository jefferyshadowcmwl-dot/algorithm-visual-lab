/* 算法可视化实验室 —— canvas 与动效层（无依赖、离线可用）
 *
 * 四件事：
 *   ① 背景粒子星野（全站）      —— 低密度、慢漂移、近距离连线
 *   ② 首页关系网络图（可点）    —— 把题目之间"共享概念"的关系画成图，点节点直达题目
 *   ③ 每题一个程序化动效封面    —— 用 canvas 画这道题的"结构意象"（三角/网格/图/栈…）
 *   ④ 数字滚动 + 滚动揭示       —— 轻量动效，落在余光里，不干扰阅读
 *
 * 底线：尊重 prefers-reduced-motion（减少动效时只画静态一帧）；
 *      页面不可见时暂停（visibilitychange）；DPR 上限 2；粒子数按面积封顶。
 */
(function () {
  "use strict";

  var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var PURPLE = "183,122,255", CYAN = "0,217,255", AMBER = "255,182,39", GREEN = "37,232,165";

  function fit(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  /* 统一的小动画循环：不可见就停，减少动效就只跑一帧 */
  function loop(canvas, draw) {
    var raf = null, alive = true, t0 = performance.now();
    function frame(now) {
      if (!alive) return;
      draw((now - t0) / 1000);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (alive && !raf && !REDUCE) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    draw(0);
    start();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { stop(); } else { start(); }
    });
    return { stop: stop, start: start, kill: function () { alive = false; stop(); } };
  }

  /* ------------------------------------------------------------ ① 背景星野 */
  function initCosmos() {
    var canvas = document.getElementById("cosmos-canvas");
    if (!canvas) return;
    var ps = [], size = null;
    function build(w, h) {
      var n = Math.min(80, Math.floor((w * h) / 26000));
      ps = [];
      for (var i = 0; i < n; i++) {
        var hue = Math.random() < .5 ? PURPLE : (Math.random() < .55 ? CYAN : AMBER);
        ps.push({ x: Math.random() * w, y: Math.random() * h,
                  vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
                  r: Math.random() * 1.5 + .5, c: hue, tw: Math.random() * 6.28 });
      }
      size = { w: w, h: h };
    }
    function draw(t) {
      var s = fit(canvas), ctx = s.ctx, w = s.w, h = s.h;
      if (!size || Math.abs(size.w - w) > 2 || Math.abs(size.h - h) > 2) build(w, h);
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        if (!REDUCE) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        var a = .45 + .35 * Math.sin(t * 1.6 + p.tw);          // 微微闪烁
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(2) + ")";
        ctx.fill();
      }
      for (var a2 = 0; a2 < ps.length; a2++) {                 // 近距离连线
        for (var b = a2 + 1; b < ps.length; b++) {
          var dx = ps[a2].x - ps[b].x, dy = ps[a2].y - ps[b].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 118) {
            ctx.beginPath();
            ctx.moveTo(ps[a2].x, ps[a2].y);
            ctx.lineTo(ps[b].x, ps[b].y);
            ctx.strokeStyle = "rgba(" + PURPLE + "," + (.16 * (1 - d / 118)).toFixed(3) + ")";
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
    }
    loop(canvas, draw);
  }

  /* ------------------------------------------------------ ② 关系网络图（可点） */
  /* nodes: [{slug,title,cat,cx,catId}]；edges: [[i,j]]（共享概念/同分类） */
  function initGraph(canvas, nodes, edges, opts) {
    if (!canvas || !nodes.length) return;
    opts = opts || {};
    var CAT_COLOR = { greedy: AMBER, dp: PURPLE, dsu: GREEN, "number-theory": CYAN,
                      "two-pointers": "255,107,53", combinatorics: "158,89,238" };
    var hover = -1, rot = 0, size = null, pos = [];

    function layout(w, h) {
      var R = Math.min(w, h) * .38, cx = w / 2, cy = h / 2;
      pos = nodes.map(function (n, i) {
        var a = -Math.PI / 2 + 2 * Math.PI * i / nodes.length + rot;
        return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
      });
      size = { w: w, h: h };
    }
    function draw(t) {
      var s = fit(canvas), ctx = s.ctx, w = s.w, h = s.h;
      if (!size || Math.abs(size.w - w) > 2 || Math.abs(size.h - h) > 2) layout(w, h);
      if (!REDUCE) { rot += 0.0016; layout(size.w, size.h); }
      ctx.clearRect(0, 0, w, h);

      // 外圈：两条慢慢转的虚线环（宇宙感）
      for (var k = 0; k < 2; k++) {
        var rr = Math.min(w, h) * (.30 + k * .10) + Math.sin(t * .6 + k) * 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, rr, 0, Math.PI * 2);
        ctx.setLineDash([2, 9]);
        ctx.strokeStyle = "rgba(" + (k ? CYAN : PURPLE) + ",.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      // 边
      for (var e = 0; e < edges.length; e++) {
        var a = pos[edges[e][0]], b = pos[edges[e][1]];
        if (!a || !b) continue;
        var on = (hover === edges[e][0] || hover === edges[e][1]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(" + PURPLE + "," + (on ? .55 : .16) + ")";
        ctx.lineWidth = on ? 1.4 : .8;
        ctx.stroke();
      }
      // 节点
      for (var i = 0; i < pos.length; i++) {
        var p = pos[i], c = CAT_COLOR[nodes[i].catId] || PURPLE;
        var pulse = 1 + (REDUCE ? 0 : .12 * Math.sin(t * 2 + i));
        var r = (hover === i ? 7.5 : 5) * pulse;
        if (hover === i) {
          ctx.beginPath(); ctx.arc(p.x, p.y, r + 9, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(" + c + ",.14)"; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + c + ",.92)"; ctx.fill();
        ctx.strokeStyle = "rgba(15,8,32,.9)"; ctx.lineWidth = 1.5; ctx.stroke();
        if (hover === i || nodes.length <= 14) {
          ctx.font = '600 11px "JetBrains Mono", Consolas, monospace';
          ctx.textAlign = "center";
          ctx.fillStyle = hover === i ? "rgba(245,232,255,.98)" : "rgba(200,178,230,.72)";
          ctx.fillText(nodes[i].title, p.x, p.y - r - 8);
        }
      }
      return pos;
    }
    var api = loop(canvas, draw);
    function pick(ev) {
      var r = canvas.getBoundingClientRect();
      var mx = ev.clientX - r.left, my = ev.clientY - r.top, best = -1, bd = 22;
      for (var i = 0; i < pos.length; i++) {
        var d = Math.hypot(pos[i].x - mx, pos[i].y - my);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }
    canvas.addEventListener("mousemove", function (ev) {
      var h = pick(ev);
      if (h !== hover) { hover = h; canvas.style.cursor = h >= 0 ? "pointer" : "default"; }
    });
    canvas.addEventListener("mouseleave", function () { hover = -1; });
    canvas.addEventListener("click", function (ev) {
      var h = pick(ev);
      if (h >= 0 && nodes[h].slug) location.hash = "#/p/" + nodes[h].slug;
    });
    // 触屏：点一下就跳（不做悬停）
    canvas.addEventListener("touchstart", function (ev) {
      var t0 = ev.touches[0];
      var h = pick({ clientX: t0.clientX, clientY: t0.clientY });
      if (h >= 0 && nodes[h].slug) { ev.preventDefault(); location.hash = "#/p/" + nodes[h].slug; }
    }, { passive: false });
    return api;
  }

  /* -------------------------------------------------- ③ 每题一个程序化封面 */
  /* 每个 slug 一个极简"结构意象"：三角 / 网格 / 图 / 栈 / 数位条…，
     再让一个高亮元素缓慢走位 —— 一眼能认出是哪类算法，又不吵。 */
  var MOTIF = {
    "triangle": function (ctx, w, h, t, C) {
      var rows = 5, m = Math.min(w, h) / (rows + 1.6), dup = Math.floor(t * 1.6) % (rows * (rows + 1) / 2);
      var k = 0, x0 = w / 2 - m * 2;
      for (var r = 0; r < rows; r++) for (var c = 0; c <= r; c++, k++) {
        ctx.beginPath();
        ctx.arc(x0 + c * m + (rows - 1 - r) * m / 2, m * .9 + r * m, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + (k === dup ? AMBER : PURPLE) + (k === dup ? ",.95" : ",.55") + ")";
        ctx.fill();
      }
    },
    "knapsack": function (ctx, w, h, t, C) {
      var cols = 6, rows = 4, cw = w / (cols + 1), ch = h / (rows + 2);
      var cur = Math.floor(t * 2) % (cols * rows);
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        ctx.fillStyle = "rgba(" + (i === cur ? GREEN : PURPLE) + (i === cur ? ",.8" : ",.22") + ")";
        ctx.fillRect(cw * .7 + c * cw, ch + r * ch, cw * .62, ch * .62);
      }
    },
    "lcs": function (ctx, w, h, t, C) {
      var n = 7, m = Math.min(w / (n + 1), h / (n + 1)), x0 = (w - n * m) / 2, y0 = (h - n * m) / 2;
      var step = Math.floor(t * 3) % (n - 1);
      ctx.beginPath();
      for (var i = 0; i < n; i++) { ctx.lineTo(x0 + i * m, y0 + (i === step ? i : i - 1) * m + m * .6); }
      ctx.strokeStyle = "rgba(" + GREEN + ",.85)"; ctx.lineWidth = 2; ctx.stroke();
      for (var a = 0; a < n; a++) for (var b = 0; b < n; b++) {
        ctx.fillStyle = "rgba(" + PURPLE + ",.18)";
        ctx.fillRect(x0 + a * m - 1, y0 + b * m - 1, 2, 2);
      }
    },
    "components": function (ctx, w, h, t, C) {
      var n = 8, cxc = w / 2, cyc = h / 2, R = Math.min(w, h) * .33;
      var p = [];
      for (var i = 0; i < n; i++) {
        var a = 2 * Math.PI * i / n;
        p.push([cxc + R * Math.cos(a), cyc + R * Math.sin(a)]);
      }
      ctx.strokeStyle = "rgba(" + PURPLE + ",.30)"; ctx.lineWidth = 1;
      for (var e = 0; e < n; e++) {
        var nxt = (e + 1) % n;
        if (e === Math.floor(t * 1.5) % n) ctx.strokeStyle = "rgba(" + AMBER + ",.9)";
        ctx.beginPath(); ctx.moveTo(p[e][0], p[e][1]); ctx.lineTo(p[nxt][0], p[nxt][1]); ctx.stroke();
        ctx.strokeStyle = "rgba(" + PURPLE + ",.30)";
      }
      for (var v = 0; v < n; v++) {
        var on = v <= Math.floor(t * 1.5) % n;
        ctx.beginPath(); ctx.arc(p[v][0], p[v][1], 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + (on ? GREEN : PURPLE) + ",.8)"; ctx.fill();
      }
    },
    "min-diff": function (ctx, w, h, t, C) {
      var n = 7, m = w / (n + 1), i = Math.floor(t * 2) % n, j = Math.floor(t * 2) % n;
      for (var a = 0; a < n; a++) {
        ctx.fillStyle = "rgba(" + (a === i ? AMBER : PURPLE) + ",.75)";
        ctx.fillRect(m * .6 + a * m, h * .30, m * .55, 14);
        ctx.fillStyle = "rgba(" + (a === j ? CYAN : PURPLE) + ",.75)";
        ctx.fillRect(m * .6 + a * m, h * .60, m * .55, 14);
      }
    },
    "repunit": function (ctx, w, h, t, C) {
      var n = 9, m = w / (n + 1), on = Math.floor(t * 2) % n;
      for (var a = 0; a < n; a++) {
        ctx.fillStyle = "rgba(" + (a === on ? AMBER : PURPLE) + (a === on ? ",.95" : ",.45") + ")";
        ctx.fillRect(m * .6 + a * m, h / 2 - 9, m * .55, 18);
        ctx.font = '600 9px "JetBrains Mono", Consolas, monospace';
        ctx.textAlign = "center"; ctx.fillStyle = "rgba(15,8,32,.85)";
        ctx.fillText("1", m * .6 + a * m + m * .27, h / 2 + 3);
      }
    },
    "mod11": function (ctx, w, h, t, C) {
      var n = 8, m = w / (n + 1), on = Math.floor(t * 2) % n;
      for (var a = 0; a < n; a++) {
        var sign = a % 2 ? -1 : 1;
        ctx.fillStyle = "rgba(" + (a === on ? (sign > 0 ? CYAN : AMBER) : PURPLE) + (a === on ? ",.95" : ",.4") + ")";
        ctx.fillRect(m * .6 + a * m, h / 2 - 8 - sign * 6, m * .55, 16);
      }
    },
    "catalan": function (ctx, w, h, t, C) {
      var n = 6, m = w / (n + 1), on = Math.floor(t * 2) % n;
      for (var depth = 0; depth < 3; depth++) {
        var d = Math.floor(t * 1.2 + depth) % 3;
        ctx.fillStyle = "rgba(" + (d === on % 3 ? CYAN : PURPLE) + ",.6)";
        ctx.fillRect(m * .6 + (on + depth * 1.4) * m * .8, h * .62 - depth * 14, m * .5, 12);
      }
      ctx.strokeStyle = "rgba(" + GREEN + ",.6)"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(m * .6, h * .30); ctx.lineTo(w - m * .6, h * .30); ctx.stroke();
    },
    "cross-river": function (ctx, w, h, t, C) {
      ctx.fillStyle = "rgba(" + PURPLE + ",.18)";
      ctx.fillRect(w * .30, 0, w * .40, h);
      var x = w * .30 + (w * .40) * (0.5 + 0.5 * Math.sin(t * .9));
      ctx.beginPath();
      ctx.moveTo(x - 14, h * .62); ctx.lineTo(x + 14, h * .62); ctx.lineTo(x + 9, h * .74); ctx.lineTo(x - 9, h * .74);
      ctx.closePath(); ctx.fillStyle = "rgba(" + AMBER + ",.9)"; ctx.fill();
      ctx.beginPath(); ctx.arc(x, h * .55, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + CYAN + ",.95)"; ctx.fill();
    },
    "cards": function (ctx, w, h, t, C) {
      var n = 5, m = w / (n + 1), on = Math.floor(t * 2) % n;
      for (var a = 0; a < n; a++) {
        for (var k = 0; k < 3; k++) {
          ctx.fillStyle = "rgba(" + (a === on ? GREEN : PURPLE) + (a === on ? ",.85" : ",.35") + ")";
          ctx.fillRect(m * .6 + a * m - 8, h * .70 - k * 10, 16, 7);
        }
      }
    }
  };

  function initMotif(canvas, slug) {
    var fn = MOTIF[slug];
    if (!canvas || !fn) return;
    loop(canvas, function (t) {
      var s = fit(canvas);
      s.ctx.clearRect(0, 0, s.w, s.h);
      fn(s.ctx, s.w, s.h, t, null);
    });
  }

  /* ------------------------------------------------------------ ④ 数字滚动 */
  /* ⚠️ 这个数字是**内容**（题量），不是装饰：动画可以被节流，但**绝不允许停在错值上**。
     实测踩到过：headless 里 rAF 被虚拟时间节流，屏幕上停着"7 道经典算法题" ✗。
     所以除了 rAF 动画，还挂一个 setTimeout 兜底，到点无条件写回正确值。 */
  function countUp(el, to, dur) {
    if (!el) return;
    if (REDUCE || document.hidden) { el.textContent = to; return; }
    dur = dur || 900;
    var settled = false;
    function settle() { if (!settled) { settled = true; el.textContent = to; } }
    var t0 = performance.now();
    (function step(now) {
      if (settled) return;
      var k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step); else settle();
    })(t0);
    setTimeout(settle, dur + 150);
  }

  /* 滚动揭示：加 .reveal 的元素进入视口后加 .is-visible */
  function initReveal(root) {
    var els = (root || document).querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || REDUCE) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .06 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  window.AVL = window.AVL || {};
  window.AVL.canvas = { initCosmos: initCosmos, initGraph: initGraph, initMotif: initMotif,
                        countUp: countUp, initReveal: initReveal, REDUCE: REDUCE };
})();
