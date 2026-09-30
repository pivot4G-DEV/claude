/* =========================================================
   ALBINISMO — interações
   ========================================================= */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SVGNS = "http://www.w3.org/2000/svg";

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- ajustes de leitura (aplica cedo) ---------- */
  var savedScale = store("alb-scale");
  if (savedScale) doc.style.setProperty("--scale", savedScale);
  if (store("alb-hc") === "1") doc.classList.add("hc");

  window.addEventListener("load", function () { document.body.classList.add("is-loaded"); });
  requestAnimationFrame(function () { setTimeout(function () { document.body.classList.add("is-loaded"); }, 60); });

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */
  var nav = $("#nav");
  var menuBtn = $("#nav-menu");
  var links = $$(".nav__links a");
  var progress = $("#progress");

  function closeMenu() {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menu");
  }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  links.forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); closeA11y(); } });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeMenu(); });

  // barra de progresso + estado "rolado" + cor da barra conforme a seção por baixo
  var darkSections = $$(".section--dark, .footer");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    document.body.classList.toggle("is-scrolled", y > 8);
    var probe = 40;
    var onDark = darkSections.some(function (s) {
      var r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    document.body.classList.toggle("on-dark", onDark);
    drawHero();
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  // seção atual no menu
  var sectionMap = {
    "o-que-e": "o-que-e", genetica: "genetica", punnett: "genetica", g8: "genetica",
    sintomas: "sintomas", cuidados: "cuidados", mitos: "mitos",
    preconceito: "preconceito", resumo: "resumo", fontes: "fontes"
  };
  var spyTargets = Object.keys(sectionMap).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function setCurrent(list, attrId) {
    list.forEach(function (a) {
      if (a.getAttribute("href") === "#" + attrId) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setCurrent(links, sectionMap[en.target.id]);
    });
  }, { rootMargin: "-45% 0px -54% 0px" });
  spyTargets.forEach(function (s) { spy.observe(s); });
  var hero = $("#inicio");
  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) setCurrent(links, "");
  }, { rootMargin: "-45% 0px -54% 0px" }).observe(hero);

  // índice da genética
  var genLinks = $$(".gen__index a");
  var genSpy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) setCurrent(genLinks, en.target.id);
    });
  }, { rootMargin: "-40% 0px -59% 0px" });
  genLinks.forEach(function (a) {
    var t = document.getElementById(a.getAttribute("href").slice(1));
    if (t) genSpy.observe(t);
  });

  /* =========================================================
     ANIMAÇÃO AO ROLAR
     ========================================================= */
  // atraso escalonado entre irmãos
  var groups = new Map();
  $$("[data-reveal]").forEach(function (n) {
    var p = n.parentElement;
    var i = groups.get(p) || 0;
    n.style.setProperty("--d", Math.min(i, 6));
    groups.set(p, i + 1);
  });
  var revealTargets = $$("[data-reveal], .helix, .mendel__art, .odds, .motto");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (n) { n.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    revealTargets.forEach(function (n) { io.observe(n); });
  }

  /* =========================================================
     INÍCIO — grânulos de pigmento
     Ao rolar, os grânulos vão perdendo a cor (a melanina some).
     ========================================================= */
  var canvas = $("#granules");
  var ctx = canvas.getContext("2d");
  var grains = [];
  var W = 0, H = 0, DPR = 1, isMobile = false;
  var t0 = performance.now();
  var heroVisible = true;
  var PALETTE = ["#3b1f0e", "#5a2f15", "#7a3f18", "#a3561f", "#c98d5c"];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function seedGrains() {
    var rect = hero.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    isMobile = W < 760;
    grains = [];
    var count = Math.round(Math.min(260, (W * H) / (isMobile ? 2600 : 5200)));
    var tries = 0;
    while (grains.length < count && tries < count * 20) {
      tries++;
      var x = rand(0, W), y = rand(0, H);
      // mantém o texto limpo: densidade maior à direita (computador) ou no topo (celular)
      var keep;
      if (isMobile) keep = Math.pow(1 - Math.min(1, y / (H * 0.42)), 1.1);
      else keep = Math.pow(Math.max(0, (x / W - 0.56) / 0.44), 1.1);
      if (Math.random() > keep) continue;
      var r = rand(3, isMobile ? 11 : 15) * (Math.random() < .12 ? 1.8 : 1);
      grains.push({
        x: x, y: y, r: r,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
        th: Math.random(),                 // quando perde o pigmento
        ph: rand(0, Math.PI * 2),
        sp: rand(.25, .6),
        born: rand(0, 900)
      });
    }
  }
  function drawHero(now) {
    if (!heroVisible) return;
    now = now || performance.now();
    var t = now - t0;
    var p = Math.min(1, Math.max(0, window.scrollY / (H * 0.8)));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < grains.length; i++) {
      var g = grains[i];
      var appear = reduceMotion ? 1 : Math.min(1, Math.max(0, (t - g.born) / 700));
      if (appear <= 0) continue;
      var e = 1 - Math.pow(1 - appear, 3);
      var dx = reduceMotion ? 0 : Math.sin(t / 1000 * g.sp + g.ph) * 3;
      var dy = reduceMotion ? 0 : Math.cos(t / 1300 * g.sp + g.ph) * 3 - p * 40 * g.sp;
      var pig = Math.min(1, Math.max(0, 1 - (p * 1.5 - g.th * .5) * 1.6));
      var r = g.r * e;
      ctx.beginPath();
      ctx.arc(g.x + dx, g.y + dy, r, 0, Math.PI * 2);
      if (pig > 0.01) {
        ctx.globalAlpha = pig * e;
        ctx.fillStyle = g.c;
        ctx.fill();
      }
      if (pig < 1) {
        ctx.globalAlpha = (1 - pig) * .55 * e;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = "#1d1d1f";
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    drawHero(now);
    if (!reduceMotion && heroVisible) requestAnimationFrame(loop);
  }
  seedGrains();
  requestAnimationFrame(loop);
  new IntersectionObserver(function (en) {
    var was = heroVisible;
    heroVisible = en[0].isIntersecting;
    if (heroVisible && !was && !reduceMotion) requestAnimationFrame(loop);
  }).observe(hero);
  var resizeT;
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      if (Math.abs(window.innerWidth - lastW) < 2 && isMobile) { // barra do navegador no celular
        var rect = hero.getBoundingClientRect(); H = rect.height; canvas.height = H * DPR; drawHero(); return;
      }
      lastW = window.innerWidth; seedGrains(); drawHero();
    }, 150);
  });

  /* ---------- fato 1: um ponto diferente entre muitos ---------- */
  var dots = $(".fact__dots");
  if (dots) {
    for (var r = 0; r < 4; r++) for (var c = 0; c < 10; c++) {
      el("circle", { cx: 8 + c * 11.6, cy: 8 + r * 15.5, r: 4.4, "class": (r === 2 && c === 6) ? "is-odd" : "" }, dots);
    }
  }

  /* =========================================================
     1. CONTROLE DE MELANINA
     ========================================================= */
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(stops, t) {
    // stops: [[pos, "#hex"], ...]
    for (var i = 0; i < stops.length - 1; i++) {
      var a = stops[i], b = stops[i + 1];
      if (t <= b[0]) {
        var k = (t - a[0]) / (b[0] - a[0]);
        var ca = hex(a[1]), cb = hex(b[1]);
        return "rgb(" + ca.map(function (v, j) { return Math.round(v + (cb[j] - v) * k); }).join(",") + ")";
      }
    }
    return stops[stops.length - 1][1];
  }
  var SKIN = [[0, "#fbf1ec"], [.35, "#efcfb4"], [.65, "#c68b62"], [1, "#4f2e1c"]];
  var HAIR = [[0, "#f7f4ea"], [.3, "#ecd9a2"], [.6, "#8a5a33"], [1, "#1c130d"]];
  var EYE = [[0, "#a9c4d8"], [.4, "#7f9aa6"], [.7, "#7a5433"], [1, "#3a2213"]];

  var range = $("#mel-range");
  var skinTop = $("#skin-top");
  var granG = $("#skin-granules");
  var raysG = $("#uv-rays");
  var mcG = $("#melanocytes");
  var skinGrains = [];
  var rays = [];
  if (range) {
    // melanócitos (células com "braços")
    [120, 300, 470].forEach(function (x) {
      el("path", { d: "M" + x + " 206c-14-10-30-20-44-40M" + x + " 206c0-18 4-36 0-56M" + x + " 206c14-12 30-22 46-38" }, mcG);
      el("circle", { cx: x, cy: 208, r: 11 }, mcG);
    });
    for (var i = 0; i < 90; i++) {
      var gx = rand(10, 550), gy = rand(142, 200);
      skinGrains.push(el("circle", { cx: gx.toFixed(1), cy: gy.toFixed(1), r: rand(2.2, 4.6).toFixed(1), "data-th": Math.random().toFixed(3) }, granG));
    }
    [150, 230, 310, 390, 470].forEach(function (x, k) {
      var line = el("line", { x1: x - 60, y1: 20 + k * 4, x2: x, y2: 140 }, raysG);
      var tip = el("circle", { cx: x, cy: 140, r: 5 }, raysG);
      rays.push({ line: line, tip: tip, x: x, x0: x - 60, y0: 20 + k * 4 });
    });
    var updateMel = function () {
      var v = range.value / 100;
      range.setAttribute("aria-valuetext", Math.round(v * 100) + "%");
      var skin = mix(SKIN, v);
      skinTop.style.setProperty("--skin", skin);
      $("#sw-skin").style.setProperty("--c", skin);
      $("#sw-hair").style.setProperty("--c", mix(HAIR, v));
      $("#sw-eye").style.setProperty("--c", mix(EYE, v));
      skinGrains.forEach(function (g) {
        g.style.opacity = (+g.getAttribute("data-th") < v) ? 1 : 0;
      });
      // quanto menos melanina, mais fundo os raios chegam
      var depth = 142 + (1 - v) * 120;
      rays.forEach(function (r) {
        var yEnd = depth;
        var k = (yEnd - r.y0) / (140 - r.y0);
        var xEnd = r.x0 + (r.x - r.x0) * k;
        r.line.setAttribute("x2", xEnd.toFixed(1));
        r.line.setAttribute("y2", yEnd.toFixed(1));
        r.tip.setAttribute("cx", xEnd.toFixed(1));
        r.tip.setAttribute("cy", yEnd.toFixed(1));
      });
    };
    range.addEventListener("input", updateMel);
    updateMel();
  }

  /* =========================================================
     2.1 HÉLICE DE DNA
     ========================================================= */
  var helix = $("#helix");
  if (helix) {
    var HW = 640, mid = 118, amp = 50, period = 150, n = 44;
    var s1 = "", s2 = "";
    for (var xh = 0; xh <= HW; xh += 4) {
      var a = (xh / period) * Math.PI * 2;
      s1 += (xh ? "L" : "M") + xh + " " + (mid + Math.sin(a) * amp).toFixed(1);
      s2 += (xh ? "L" : "M") + xh + " " + (mid - Math.sin(a) * amp).toFixed(1);
    }
    var geneFrom = 250, geneTo = 470, mutX = 386;
    for (var k = 0; k < n; k++) {
      var x = 8 + k * (HW - 16) / (n - 1);
      var an = (x / period) * Math.PI * 2;
      var yA = mid + Math.sin(an) * amp, yB = mid - Math.sin(an) * amp;
      var cls = "rung";
      if (x >= geneFrom && x <= geneTo) cls += " is-gene";
      if (Math.abs(x - mutX) < 7) cls += " is-mut";
      var ln = el("line", { x1: x.toFixed(1), y1: yA.toFixed(1), x2: x.toFixed(1), y2: yB.toFixed(1), "class": cls }, helix);
      ln.style.setProperty("--i", k);
      if (cls.indexOf("is-mut") > -1) { mutX = x; }
    }
    el("path", { d: s2, "class": "s2" }, helix);
    el("path", { d: s1, "class": "s1" }, helix);
    el("path", { d: "M" + geneFrom + " 50V40H" + geneTo + "V50", "class": "bracket" }, helix);
    var tg = el("text", { x: (geneFrom + geneTo) / 2, y: 30, "text-anchor": "middle", "class": "lbl" }, helix);
    tg.textContent = "gene";
    el("circle", { cx: mutX, cy: mid, r: 22, "class": "mut-ring" }, helix);
    var tm = el("text", { x: mutX, y: 196, "text-anchor": "middle", "class": "lbl lbl--mut" }, helix);
    tm.textContent = "mutação";
    var td = el("text", { x: 60, y: 196, "text-anchor": "middle", "class": "lbl" }, helix);
    td.textContent = "DNA";
  }

  /* =========================================================
     2.2 ESQUEMA NORMAL x COM MUTAÇÃO
     ========================================================= */
  function segmented(group, onPick) {
    var btns = $$(".seg__btn", group);
    group.style.setProperty("--n", btns.length);
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        btns.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        group.style.setProperty("--k", i);
        onPick(b, i);
      });
    });
    var start = btns.findIndex(function (b) { return b.getAttribute("aria-pressed") === "true"; });
    group.style.setProperty("--k", Math.max(0, start));
    return btns;
  }
  var path = $("#path");
  if (path) segmented($(".seg", path), function (b) { path.setAttribute("data-mode", b.getAttribute("data-mode")); });

  /* =========================================================
     2.3 / 2.4 CROMOSSOMOS
     ========================================================= */
  function chromosome(svg, cx, allele, who) {
    var w = 44, top = 14, h = 196, cen = 88;
    var l = cx - w / 2, r = cx + w / 2;
    var d = "M" + (l + 22) + " " + top +
      " h0 a22 22 0 0 1 22 22 V" + (cen - 10) +
      " q0 8 -7 10 q7 2 7 10 V" + (top + h - 22) +
      " a22 22 0 0 1 -22 22 a22 22 0 0 1 -22 -22 V" + (cen + 10) +
      " q0 -8 7 -10 q-7 -2 -7 -10 V" + (top + 22) + " a22 22 0 0 1 22 -22 Z";
    el("path", { d: d, "class": "arm" }, svg);
    [44, 66, 132, 150, 178].forEach(function (y) {
      el("line", { x1: l + 5, x2: r - 5, y1: y, y2: y, "class": "band" }, svg);
    });
    var ly = 106, lh = 40;
    el("rect", { x: l + 2, y: ly, width: w - 4, height: lh, rx: 6, "class": "loc-" + allele }, svg);
    var t = el("text", { x: cx, y: ly + 30, "class": "let let-" + allele }, svg);
    t.textContent = allele;
    var wt = el("text", { x: cx, y: top + h + 28, "class": "who" }, svg);
    wt.textContent = who;
  }
  $$(".chrom").forEach(function (box) {
    var pair = box.getAttribute("data-pair");
    var svg = el("svg", { viewBox: "0 0 160 244" });
    chromosome(svg, 40, pair[0], "da mãe");
    chromosome(svg, 120, pair[1], "do pai");
    box.appendChild(svg);
  });

  /* =========================================================
     2.7 QUADRO DE PUNNETT
     ========================================================= */
  var NAMES = { AA: "não tem o gene alterado", Aa: "portador", aa: "albinismo" };
  var SENTENCES = {
    "AA|AA": "Todos os filhos (100%) não têm o gene alterado.",
    "AA|Aa": "50% dos filhos não têm o gene alterado e 50% são portadores. Nenhum tem albinismo.",
    "AA|aa": "100% dos filhos são portadores. Nenhum tem albinismo, mas todos carregam o gene.",
    "Aa|Aa": "25% de chance de albinismo, 50% de ser portador e 25% de não ter o gene alterado.",
    "Aa|aa": "50% de chance de albinismo e 50% de ser portador.",
    "aa|aa": "100% dos filhos têm albinismo."
  };
  var ORDER = ["AA", "Aa", "aa"];
  function norm(x, y) { return (x === "A" || y !== "A") ? x + y : y + x; } // "A" sempre na frente
  function key(m, p) {
    var s = [m, p].sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });
    return s[0] + "|" + s[1];
  }
  function alleleChip(letter) {
    return '<span class="allele allele--' + letter + '">' + letter + "</span>";
  }

  var square = $("#square");
  var resultsEl = $("#results");
  var sentenceEl = $("#sentence");
  var current = { m: "Aa", p: "Aa" };

  function renderPunnett(animate) {
    var m = current.m, p = current.p;
    $$("[data-g]", square).forEach(function (h) {
      var g = h.getAttribute("data-g");
      var letter = (g[0] === "m" ? m : p)[+g[1]];
      h.innerHTML = alleleChip(letter) + '<span class="sr">' + (g[0] === "m" ? "gameta da mãe " : "gameta do pai ") + letter + "</span>";
    });
    var counts = { AA: 0, Aa: 0, aa: 0 };
    $$(".square__cell", square).forEach(function (cell, idx) {
      var c = cell.getAttribute("data-c");
      var gt = norm(m[+c[0]], p[+c[1]]);
      counts[gt]++;
      cell.className = "square__cell t-" + gt;
      cell.innerHTML = '<span class="g">' + gt + '</span><span class="n">' + NAMES[gt] + "</span>";
      if (animate && !reduceMotion) {
        cell.style.setProperty("--i", idx);
        void cell.offsetWidth;
        cell.classList.add("pop");
      }
    });
    resultsEl.innerHTML = ORDER.filter(function (g) { return counts[g] > 0; }).map(function (g, i) {
      var pct = counts[g] * 25;
      return '<li class="res res--' + g + '" style="--i:' + i + '">' +
        '<span class="res__pct">' + pct + "%</span>" +
        '<span class="res__name"><span class="mono">' + g + "</span> = " + NAMES[g] + "</span>" +
        '<span class="res__bar" aria-hidden="true"><i style="--p:' + pct + '"></i></span></li>';
    }).join("");
    sentenceEl.textContent = SENTENCES[key(m, p)];
  }
  $$(".picker input").forEach(function (inp) {
    inp.addEventListener("change", function () {
      current[inp.name === "mae" ? "m" : "p"] = inp.value;
      renderPunnett(true);
      resetDraw();
    });
  });
  renderPunnett(false);

  /* ---------- sorteio de filhos ---------- */
  var kidsEl = $("#kids");
  var tallyEl = $("#tally");
  var tally = { AA: 0, Aa: 0, aa: 0 };
  var MAX_SHOWN = 40;
  function drawKid() {
    var gt = norm(current.m[Math.random() < .5 ? 0 : 1], current.p[Math.random() < .5 ? 0 : 1]);
    tally[gt]++;
    var li = document.createElement("li");
    li.className = "kid t-" + gt;
    li.textContent = gt;
    li.setAttribute("aria-label", gt + " (" + NAMES[gt] + ")");
    kidsEl.appendChild(li);
    while (kidsEl.children.length > MAX_SHOWN) kidsEl.removeChild(kidsEl.firstChild);
  }
  function renderTally() {
    var total = tally.AA + tally.Aa + tally.aa;
    if (!total) { tallyEl.textContent = ""; return; }
    tallyEl.innerHTML = "Total: <b>" + total + "</b> · " + ORDER.map(function (g) {
      return '<b>' + g + "</b> " + tally[g] + " (" + Math.round(tally[g] / total * 100) + "%)";
    }).join(" · ");
  }
  function resetDraw() {
    tally = { AA: 0, Aa: 0, aa: 0 };
    kidsEl.innerHTML = "";
    renderTally();
  }
  $("#draw-1").addEventListener("click", function () { drawKid(); renderTally(); });
  $("#draw-20").addEventListener("click", function () {
    for (var i = 0; i < 20; i++) drawKid();
    renderTally();
  });
  $("#draw-clear").addEventListener("click", resetDraw);

  /* =========================================================
     3. OLHO — fibras da íris
     ========================================================= */
  var fibers = $("#iris-fibers");
  if (fibers) {
    for (var f = 0; f < 64; f++) {
      var ang = (f / 64) * Math.PI * 2;
      var r1 = 32, r2 = 70 - (f % 3) * 6;
      el("line", {
        x1: (200 + Math.cos(ang) * r1).toFixed(1), y1: (120 + Math.sin(ang) * r1).toFixed(1),
        x2: (200 + Math.cos(ang) * r2).toFixed(1), y2: (120 + Math.sin(ang) * r2).toFixed(1)
      }, fibers);
    }
  }

  /* =========================================================
     5. MITOS E VERDADES
     ========================================================= */
  var hits = 0, answered = 0;
  var hitEl = $("#score-hit");
  var resetBtn = $("#score-reset");
  var ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  var ICON_NO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  $$(".myth").forEach(function (card) {
    var answer = card.getAttribute("data-answer");
    var btns = $$(".myth__btns button", card);
    btns.forEach(function (b) {
      b.setAttribute("data-label", b.textContent);
      b.addEventListener("click", function () {
        if (card.classList.contains("is-open")) return;
        var guess = b.getAttribute("data-guess");
        var right = guess === answer;
        answered++;
        if (right) hits++;
        card.classList.add("is-open", right ? "is-right" : "is-wrong");
        btns.forEach(function (o) {
          o.disabled = true;
          var isAns = o.getAttribute("data-guess") === answer;
          if (isAns) o.classList.add("is-answer");
          if (o === b) {
            o.classList.add("is-chosen");
            if (!right) o.classList.add("is-wrong");
            o.innerHTML = (right ? ICON_OK : ICON_NO) + o.getAttribute("data-label") +
              '<span class="sr">' + (right ? " (você acertou)" : " (você errou)") + "</span>";
          }
        });
        hitEl.textContent = hits;
        resetBtn.hidden = answered === 0;
      });
    });
  });
  resetBtn.addEventListener("click", function () {
    hits = 0; answered = 0; hitEl.textContent = "0"; resetBtn.hidden = true;
    $$(".myth").forEach(function (card) {
      card.classList.remove("is-open", "is-right", "is-wrong");
      $$(".myth__btns button", card).forEach(function (o) {
        o.disabled = false;
        o.className = "";
        o.textContent = o.getAttribute("data-label");
      });
    });
  });

  /* =========================================================
     6. FRASE FINAL — palavra por palavra
     ========================================================= */
  var motto = $("#motto span");
  if (motto) {
    var words = motto.textContent.trim().split(/\s+/);
    motto.parentElement.setAttribute("aria-label", motto.textContent.trim());
    motto.setAttribute("aria-hidden", "true");
    motto.innerHTML = words.map(function (w, i) {
      return '<span class="w"><span style="--i:' + i + '">' + w + "</span></span>";
    }).join(" ");
  }

  /* =========================================================
     AJUSTES DE LEITURA
     ========================================================= */
  var a11yBtn = $("#a11y-toggle");
  var a11yPanel = $("#a11y-panel");
  var a11yWrap = $("#a11y");
  function closeA11y() {
    if (a11yPanel.hidden) return;
    a11yPanel.hidden = true;
    a11yBtn.setAttribute("aria-expanded", "false");
  }
  a11yBtn.addEventListener("click", function () {
    var open = a11yPanel.hidden;
    a11yPanel.hidden = !open;
    a11yBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) { if (!a11yWrap.contains(e.target)) closeA11y(); });

  var sizeGroup = $(".seg--sm", a11yPanel);
  var sizeBtns = segmented(sizeGroup, function (b) {
    var s = b.getAttribute("data-size");
    doc.style.setProperty("--scale", s);
    store("alb-scale", s);
  });
  if (savedScale) {
    sizeBtns.forEach(function (b, i) {
      var on = b.getAttribute("data-size") === savedScale;
      b.setAttribute("aria-pressed", String(on));
      if (on) sizeGroup.style.setProperty("--k", i);
    });
  }
  var hc = $("#hc");
  hc.setAttribute("aria-checked", String(doc.classList.contains("hc")));
  hc.addEventListener("click", function () {
    var on = !doc.classList.contains("hc");
    doc.classList.toggle("hc", on);
    hc.setAttribute("aria-checked", String(on));
    store("alb-hc", on ? "1" : "0");
  });

  onScroll();
})();
