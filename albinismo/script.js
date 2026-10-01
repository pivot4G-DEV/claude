/* =========================================================
   ALBINISMO — apresentação (HBM Produções)
   Navegação: ↓ → espaço PageDown = próximo · ↑ ← PageUp = anterior
              F = tela cheia · Home/End = primeiro/último
   ========================================================= */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var SVGNS = "http://www.w3.org/2000/svg";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- números que rolam dígito por dígito
     (adaptado do componente "Animate Digits" do 21st.dev) ---------- */
  function roll(node, text, instant) {
    if (!node) return;
    var old = node.getAttribute("data-v");
    if (old === text) return;
    node.setAttribute("data-v", text);
    node.setAttribute("aria-label", text);
    if (instant || reduceMotion || old === null || old.length !== text.length) {
      node.innerHTML = text.split("").map(function (c) {
        return '<span class="dg" aria-hidden="true"><span>' + c + "</span></span>";
      }).join("");
      return;
    }
    var cells = node.children;
    text.split("").forEach(function (c, i) {
      var o = old[i];
      if (c === o) return;
      var up = /\d/.test(c) && /\d/.test(o) ? +c > +o : true;
      var prev = cells[i].lastElementChild;
      prev.className = up ? "out-up" : "out-down";
      prev.addEventListener("animationend", function () { prev.remove(); }, { once: true });
      var nu = document.createElement("span");
      nu.className = up ? "in-up" : "in-down";
      nu.style.animationDelay = (i * 60) + "ms";
      nu.textContent = c;
      cells[i].appendChild(nu);
    });
  }

  /* ---------- explosão de grânulos de pigmento ---------- */
  var BURST = ["#3b1f0e", "#7a3f18", "#a3561f", "#c98d5c", "#ffa15c", "#ffffff"];
  function burst(target, count) {
    if (reduceMotion) return;
    var r = target.getBoundingClientRect();
    count = count || 22;
    for (var i = 0; i < count; i++) {
      var d = document.createElement("span");
      d.className = "burst";
      var ang = (i / count) * Math.PI * 2 + Math.random() * .4;
      var dist = 80 + Math.random() * 120;
      d.style.left = (r.left + r.width / 2) + "px";
      d.style.top = (r.top + r.height / 2) + "px";
      d.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      d.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      d.style.setProperty("--s", (8 + Math.random() * 12) + "px");
      d.style.background = BURST[i % BURST.length];
      document.body.appendChild(d);
      d.addEventListener("animationend", function () { this.remove(); });
    }
  }

  /* =========================================================
     MODO: pilha de slides (computador) ou rolagem (celular)
     ========================================================= */
  var slides = $$(".slide");
  var N = slides.length;
  var flow = window.innerWidth < 900 || window.innerHeight < 560 || !hasGsap;
  doc.classList.toggle("is-flow", flow);

  /* =========================================================
     1. CAPA — grânulos de pigmento
     Explodem do centro, fogem do cursor ("imã") e perdem a cor
     quando você avança.
     ========================================================= */
  var cover = slides[0];
  var canvas = $("#granules");
  var ctx = canvas.getContext("2d");
  var grains = [], W = 0, H = 0, DPR = 1, small = false;
  var t0 = performance.now();
  var coverOn = true;
  var ptr = { x: 0, y: 0, on: false };
  var PALETTE = ["#3b1f0e", "#5a2f15", "#7a3f18", "#a3561f", "#c98d5c"];

  cover.addEventListener("pointermove", function (e) {
    var r = cover.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true;
  });
  cover.addEventListener("pointerleave", function () { ptr.on = false; });

  function seedGrains() {
    var rect = cover.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    small = W < 760;
    grains = [];
    var count = Math.round(Math.min(300, (W * H) / (small ? 2400 : 4600)));
    var ox = small ? W * .5 : W * .74, oy = small ? H * .2 : H * .5;
    var tries = 0;
    while (grains.length < count && tries < count * 25) {
      tries++;
      var x = rand(0, W), y = rand(0, H);
      var keep = small ? Math.pow(1 - Math.min(1, y / (H * .36)), 1.1)
                       : Math.pow(Math.max(0, (x / W - .54) / .46), 1.05);
      if (Math.random() > keep) continue;
      grains.push({
        x: x, y: y, sx: ox + rand(-20, 20), sy: oy + rand(-20, 20),
        r: rand(3, small ? 11 : 16) * (Math.random() < .12 ? 1.8 : 1),
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
        th: Math.random(), ph: rand(0, Math.PI * 2), sp: rand(.25, .6),
        born: rand(150, 750), ox: 0, oy: 0
      });
    }
  }
  function easeOutExpo(k) { return k >= 1 ? 1 : 1 - Math.pow(2, -10 * k); }
  function drawCover(now) {
    var t = now - t0;
    var p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < grains.length; i++) {
      var g = grains[i];
      var k = reduceMotion ? 1 : Math.min(1, Math.max(0, (t - g.born) / 1500));
      if (k <= 0) continue;
      var e = easeOutExpo(k);
      var bx = g.sx + (g.x - g.sx) * e, by = g.sy + (g.y - g.sy) * e;
      var dx = reduceMotion ? 0 : Math.sin(t / 1000 * g.sp + g.ph) * 4;
      var dy = reduceMotion ? 0 : Math.cos(t / 1300 * g.sp + g.ph) * 4 - p * 60 * g.sp;
      var tx = 0, ty = 0;
      if (ptr.on) {
        var vx = bx + dx - ptr.x, vy = by + dy - ptr.y;
        var dist = Math.sqrt(vx * vx + vy * vy) || 1;
        if (dist < 170) { var f = Math.pow(1 - dist / 170, 2) * 90; tx = vx / dist * f; ty = vy / dist * f; }
      }
      g.ox += (tx - g.ox) * .14; g.oy += (ty - g.oy) * .14;
      var pig = Math.min(1, Math.max(0, 1 - (p * 1.7 - g.th * .5) * 1.7));
      ctx.beginPath();
      ctx.arc(bx + dx + g.ox, by + dy + g.oy, g.r * Math.min(1, e * 1.4), 0, Math.PI * 2);
      if (pig > .01) { ctx.globalAlpha = pig; ctx.fillStyle = g.c; ctx.fill(); }
      if (pig < 1) { ctx.globalAlpha = (1 - pig) * .5; ctx.lineWidth = 1.4; ctx.strokeStyle = "#1d1d1f"; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }
  function coverLoop(now) {
    if (!coverOn) return;
    drawCover(now);
    requestAnimationFrame(coverLoop);
  }
  seedGrains();
  requestAnimationFrame(coverLoop);
  function setCoverOn(on) {
    if (on && !coverOn) { coverOn = true; requestAnimationFrame(coverLoop); }
    coverOn = on;
  }

  /* =========================================================
     2. CONTROLE DE MELANINA
     ========================================================= */
  function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function mix(stops, t) {
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
  var skinGrains = [], rays = [];
  [120, 300, 470].forEach(function (x) {
    el("path", { d: "M" + x + " 206c-14-10-30-20-44-40M" + x + " 206c0-18 4-36 0-56M" + x + " 206c14-12 30-22 46-38" }, $("#melanocytes"));
    el("circle", { cx: x, cy: 208, r: 11 }, $("#melanocytes"));
  });
  for (var gi = 0; gi < 90; gi++) {
    skinGrains.push(el("circle", { cx: rand(10, 550).toFixed(1), cy: rand(142, 200).toFixed(1), r: rand(2.2, 4.6).toFixed(1), "data-th": Math.random().toFixed(3) }, $("#skin-granules")));
  }
  [150, 230, 310, 390, 470].forEach(function (x, k) {
    rays.push({
      line: el("line", { x1: x - 60, y1: 20 + k * 4, x2: x, y2: 140 }, $("#uv-rays")),
      tip: el("circle", { cx: x, cy: 140, r: 5 }, $("#uv-rays")),
      x: x, x0: x - 60, y0: 20 + k * 4
    });
  });
  function setMel(v) {
    v = Math.max(0, Math.min(100, v)) / 100;
    range.setAttribute("aria-valuetext", Math.round(v * 100) + "%");
    var skin = mix(SKIN, v);
    $("#skin-top").style.setProperty("--skin", skin);
    $("#sw-skin").style.setProperty("--c", skin);
    $("#sw-hair").style.setProperty("--c", mix(HAIR, v));
    $("#sw-eye").style.setProperty("--c", mix(EYE, v));
    skinGrains.forEach(function (g) { g.style.opacity = (+g.getAttribute("data-th") < v) ? 1 : 0; });
    var depth = 142 + (1 - v) * 120;   // menos melanina = o sol entra mais fundo
    rays.forEach(function (r) {
      var k = (depth - r.y0) / (140 - r.y0);
      var xe = r.x0 + (r.x - r.x0) * k;
      r.line.setAttribute("x2", xe.toFixed(1)); r.line.setAttribute("y2", depth.toFixed(1));
      r.tip.setAttribute("cx", xe.toFixed(1)); r.tip.setAttribute("cy", depth.toFixed(1));
    });
  }
  var melState = { v: 100 };
  range.addEventListener("input", function () { melState.v = +range.value; setMel(melState.v); });
  setMel(100);

  /* =========================================================
     4. GENE → ENZIMA → MELANINA (normal x mutação)
     ========================================================= */
  var path = $("#path");
  var seg = $(".seg");
  $$(".seg__btn", seg).forEach(function (b, i) {
    b.addEventListener("click", function () {
      $$(".seg__btn", seg).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      seg.style.setProperty("--k", i);
      var mode = b.getAttribute("data-mode");
      seg.classList.toggle("is-mut", mode === "mutacao");
      path.setAttribute("data-mode", mode);
      if (!hasGsap || reduceMotion) return;
      if (mode === "mutacao") {
        gsap.fromTo(path, { x: 0 }, { x: 10, duration: .06, repeat: 7, yoyo: true, ease: "none", clearProps: "x" });
        gsap.fromTo(".art-mel circle", { scale: 1, transformOrigin: "50% 50%" }, { scale: .4, duration: .5, stagger: .04, ease: "back.out(3)", yoyo: true, repeat: 1 });
      } else {
        gsap.from(".art-mel circle", { scale: 0, transformOrigin: "50% 50%", duration: .7, stagger: .05, ease: "back.out(2.5)" });
      }
    });
  });

  /* =========================================================
     5. CROMOSSOMOS
     ========================================================= */
  function chromosome(svg, cx, allele, who) {
    var w = 44, top = 14, h = 196, cen = 88, l = cx - w / 2, r = cx + w / 2;
    var d = "M" + (l + 22) + " " + top + " a22 22 0 0 1 22 22 V" + (cen - 10) +
      " q0 8 -7 10 q7 2 7 10 V" + (top + h - 22) + " a22 22 0 0 1 -22 22 a22 22 0 0 1 -22 -22 V" + (cen + 10) +
      " q0 -8 7 -10 q-7 -2 -7 -10 V" + (top + 22) + " a22 22 0 0 1 22 -22 Z";
    el("path", { d: d, "class": "arm" }, svg);
    [44, 66, 132, 150, 178].forEach(function (y) { el("line", { x1: l + 5, x2: r - 5, y1: y, y2: y, "class": "band" }, svg); });
    var g = el("g", { "class": "locus" }, svg);
    el("rect", { x: l + 2, y: 106, width: w - 4, height: 40, rx: 6, "class": "loc-" + allele }, g);
    el("text", { x: cx, y: 136, "class": "let let-" + allele }, g).textContent = allele;
    el("text", { x: cx, y: top + h + 30, "class": "who" }, svg).textContent = who;
  }
  $$(".chrom").forEach(function (box) {
    var pair = box.getAttribute("data-pair");
    var svg = el("svg", { viewBox: "0 0 160 250", "aria-hidden": "true" });
    chromosome(svg, 40, pair[0], "mãe");
    chromosome(svg, 120, pair[1], "pai");
    box.appendChild(svg);
  });

  /* =========================================================
     6. QUADRO DE PUNNETT
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
  function norm(x, y) { return (x === "A" || y !== "A") ? x + y : y + x; }
  function key(m, p) {
    var s = [m, p].sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });
    return s[0] + "|" + s[1];
  }
  var square = $("#square"), resultsEl = $("#results"), sentenceEl = $("#sentence");
  var current = { m: "Aa", p: "Aa" };
  function renderPunnett(animate) {
    var m = current.m, p = current.p;
    $$("[data-g]", square).forEach(function (h) {
      var g = h.getAttribute("data-g");
      var letter = (g[0] === "m" ? m : p)[+g[1]];
      h.innerHTML = '<span class="allele allele--' + letter + '">' + letter + '</span><span class="sr">' +
        (g[0] === "m" ? "gameta da mãe " : "gameta do pai ") + letter + "</span>";
    });
    var counts = { AA: 0, Aa: 0, aa: 0 };
    var cells = $$(".square__cell", square);
    cells.forEach(function (cell) {
      var c = cell.getAttribute("data-c");
      var gt = norm(m[+c[0]], p[+c[1]]);
      counts[gt]++;
      cell.className = "square__cell t-" + gt;
      cell.innerHTML = '<span class="g">' + gt + '</span><span class="n">' + NAMES[gt] + "</span>";
    });
    if (animate && hasGsap && !reduceMotion) {
      gsap.fromTo($$(".square__head .allele", square), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: .6, stagger: .05, ease: "back.out(2.4)" });
      gsap.fromTo(cells, { rotateY: -110, scale: .85, opacity: 0 }, { rotateY: 0, scale: 1, opacity: 1, duration: .9, stagger: .09, ease: "expo.out", delay: .1 });
    }
    $$(".res", resultsEl).forEach(function (row) {
      var g = row.getAttribute("data-g"), pct = counts[g] * 25;
      row.hidden = pct === 0;
      roll($(".res__pct", row), pct + "%", !animate);
      $(".res__bar i", row).style.setProperty("--p", pct);
    });
    sentenceEl.textContent = SENTENCES[key(m, p)];
  }
  $$(".picker input").forEach(function (inp) {
    inp.addEventListener("change", function () {
      current[inp.name === "mae" ? "m" : "p"] = inp.value;
      renderPunnett(true);
      $("#kids").innerHTML = "";
    });
  });
  renderPunnett(false);

  $("#draw").addEventListener("click", function () {
    var kids = $("#kids");
    kids.innerHTML = "";
    for (var i = 0; i < 12; i++) {
      var gt = norm(current.m[Math.random() < .5 ? 0 : 1], current.p[Math.random() < .5 ? 0 : 1]);
      var li = document.createElement("li");
      li.className = "kid t-" + gt; li.textContent = gt;
      li.setAttribute("aria-label", gt + " (" + NAMES[gt] + ")");
      kids.appendChild(li);
    }
    if (hasGsap && !reduceMotion) {
      gsap.from(kids.children, { scale: 0, y: -30, rotate: -40, duration: .6, stagger: .05, ease: "back.out(2.2)" });
    }
  });

  /* =========================================================
     7. OLHO — fibras, piscada e olhar que segue o cursor
     ========================================================= */
  var fibers = $("#iris-fibers");
  for (var f = 0; f < 64; f++) {
    var ang = (f / 64) * Math.PI * 2, r2 = 70 - (f % 3) * 6;
    el("line", {
      x1: (200 + Math.cos(ang) * 32).toFixed(1), y1: (120 + Math.sin(ang) * 32).toFixed(1),
      x2: (200 + Math.cos(ang) * r2).toFixed(1), y2: (120 + Math.sin(ang) * r2).toFixed(1)
    }, fibers);
  }
  var iris = $("#iris"), eyeSvg = iris.ownerSVGElement;
  var look = { x: 0, y: 0, tx: 0, ty: 0 }, eyeOn = false;
  window.addEventListener("pointermove", function (e) {
    var r = eyeSvg.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    var d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(1, d / 300);
    look.tx = dx / d * 70 * k; look.ty = dy / d * 34 * k;
  }, { passive: true });
  function eyeLoop() {
    if (!eyeOn) return;
    look.x += (look.tx - look.x) * .1; look.y += (look.ty - look.y) * .1;
    iris.setAttribute("transform", "translate(" + look.x.toFixed(2) + " " + look.y.toFixed(2) + ")");
    requestAnimationFrame(eyeLoop);
  }
  function setEyeOn(on) {
    if (reduceMotion) return;
    if (on && !eyeOn) { eyeOn = true; requestAnimationFrame(eyeLoop); }
    eyeOn = on;
  }

  /* =========================================================
     9. MITO OU VERDADE — baralho para arrastar
     (inspirado no componente "Swipe Deck" do 21st.dev)
     ========================================================= */
  var swipe = $("#swipe");
  var items = $$("#myths-data li").map(function (li) {
    return { answer: li.getAttribute("data-answer"), q: $("q", li).textContent, exp: $("span", li).textContent };
  });
  var cards = [], at = 0, hits = 0, revealed = false;
  var THRESHOLD = 110;
  var btnMito = $("#btn-mito"), btnVerdade = $("#btn-verdade");
  var leftEl = $("#swipe-left"), hitEl = $("#score-hit");
  $("#score-total").textContent = items.length;
  var done = document.createElement("div");
  done.className = "swipe__done";
  done.innerHTML = '<span>Você acertou</span><b class="roll" id="done-score">0</b><span>de ' + items.length +
    '</span><button type="button" class="choice choice--next" id="deck-again" style="justify-self:center;margin-top:.6rem">Jogar de novo</button>';
  swipe.appendChild(done);

  function buildDeck() {
    cards.forEach(function (c) { c.remove(); });
    cards = items.map(function (it, i) {
      var c = document.createElement("div");
      c.className = "card";
      c.setAttribute("data-answer", it.answer);
      c.innerHTML =
        '<div class="card__inner">' +
          '<div class="card__face">' +
            '<p class="card__n">' + String(i + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0") + "</p>" +
            '<p class="card__q">“' + it.q + "”</p>" +
          "</div>" +
          '<div class="card__face card__face--back">' +
            '<p class="card__stamp">' + (it.answer === "mito" ? "MITO" : "VERDADE") + "</p>" +
            '<p class="card__exp">' + it.exp + "</p>" +
            '<p class="card__res"></p>' +
          "</div>" +
        "</div>" +
        '<span class="card__badge card__badge--mito" aria-hidden="true">MITO</span>' +
        '<span class="card__badge card__badge--verdade" aria-hidden="true">VERDADE</span>';
      c.style.zIndex = items.length - i;
      swipe.appendChild(c);
      bindDrag(c);
      return c;
    });
    at = 0; hits = 0; revealed = false;
    roll(hitEl, "0", true);
    if (hasGsap) gsap.set(done, { opacity: 0, scale: .9, pointerEvents: "none" });
    layout(true);
    setButtons();
  }
  function layout(instant) {
    cards.forEach(function (c, i) {
      var d = i - at;
      if (d < 0) return;
      var props = { x: 0, y: d * 16, scale: 1 - d * .05, rotation: 0, opacity: d < 3 ? 1 : 0 };
      if (!hasGsap) { c.style.transform = "translateY(" + props.y + "px) scale(" + props.scale + ")"; c.style.opacity = props.opacity; return; }
      if (instant) gsap.set(c, props); else gsap.to(c, Object.assign({ duration: .6, ease: "expo.out" }, props));
    });
    leftEl.textContent = at < items.length ? (items.length - at) + " restantes" : "";
  }
  function setButtons() {
    var finished = at >= items.length;
    btnMito.disabled = finished; btnVerdade.disabled = finished;
    btnMito.classList.toggle("choice--next", revealed);
    btnVerdade.classList.toggle("choice--next", revealed);
    btnMito.style.visibility = revealed ? "hidden" : "";
    btnVerdade.firstChild.textContent = revealed ? "Próximo " : "Verdade ";
  }
  function badges(c, dx) {
    var k = Math.min(1, Math.abs(dx) / THRESHOLD);
    c.querySelector(".card__badge--mito").style.opacity = dx < 0 ? k : 0;
    c.querySelector(".card__badge--verdade").style.opacity = dx > 0 ? k : 0;
  }
  function decide(choice) {
    if (at >= items.length) return false;
    var c = cards[at];
    if (revealed) { next(choice === "verdade" ? 1 : -1); return true; }
    revealed = true;
    var right = choice === items[at].answer;
    if (right) hits++;
    badges(c, 0);
    c.querySelector(".card__res").textContent = right ? "Você acertou!" : "Não foi dessa vez.";
    roll(hitEl, String(hits));
    if (hasGsap) {
      gsap.to(c, { x: 0, rotation: 0, scale: 1.04, duration: .5, ease: "back.out(1.6)" });
      gsap.to(c.querySelector(".card__inner"), { rotationY: 180, duration: .9, ease: "back.out(1.3)" });
      var stamp = c.querySelector(".card__stamp");
      gsap.fromTo(stamp, { scale: 2.6, opacity: 0, rotation: -18 }, { scale: 1, opacity: 1, rotation: -4, duration: .55, delay: .45, ease: "back.out(2.2)" });
      if (!reduceMotion) gsap.to(stamp, { delay: .4, duration: .8, scrambleText: { text: stamp.textContent, chars: "MITOVERDA", speed: .6 } });
      if (!right && !reduceMotion) gsap.fromTo(c, { x: 0 }, { x: 12, duration: .06, repeat: 5, yoyo: true, delay: .9, clearProps: "x" });
    } else {
      c.querySelector(".card__inner").style.transform = "rotateY(180deg)";
    }
    if (right) setTimeout(function () { burst(c, 26); }, 450);
    setButtons();
    return true;
  }
  function next(dir) {
    var c = cards[at];
    revealed = false;
    at++;
    if (hasGsap) gsap.to(c, { x: dir * window.innerWidth * .8, rotation: dir * 30, opacity: 0, duration: .55, ease: "power2.in" });
    else c.style.display = "none";
    layout(false);
    setButtons();
    if (at >= items.length) {
      roll($("#done-score"), String(hits), true);
      if (hasGsap) gsap.to(done, { opacity: 1, scale: 1, pointerEvents: "auto", duration: .7, delay: .3, ease: "back.out(1.8)" });
      setTimeout(function () { burst(done, 34); }, 500);
    }
  }
  function bindDrag(c) {
    var sx = 0, dx = 0, lastX = 0, lastT = 0, vx = 0, dragging = false;
    c.addEventListener("pointerdown", function (e) {
      if (cards[at] !== c) return;
      dragging = true; sx = e.clientX; dx = 0; lastX = e.clientX; lastT = performance.now(); vx = 0;
      c.setPointerCapture(e.pointerId);
      c.classList.add("is-drag");
      if (hasGsap) gsap.killTweensOf(c, "x,rotation");
    });
    c.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dx = e.clientX - sx;
      var now = performance.now();
      vx = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
      if (hasGsap) gsap.set(c, { x: dx, rotation: dx / 200 * 8 * (revealed ? .5 : 1) });
      if (!revealed) badges(c, dx);
    });
    function end() {
      if (!dragging) return;
      dragging = false; c.classList.remove("is-drag");
      var far = Math.abs(dx) >= THRESHOLD, fast = Math.abs(vx) > .6 && Math.abs(dx) > THRESHOLD * .35;
      if (far || fast) { decide((far ? dx : vx) > 0 ? "verdade" : "mito"); return; }
      badges(c, 0);
      if (hasGsap) gsap.to(c, { x: 0, rotation: 0, duration: .8, ease: "elastic.out(1, .55)" });
    }
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
  }
  btnMito.addEventListener("click", function () { decide("mito"); });
  btnVerdade.addEventListener("click", function () { decide("verdade"); });
  swipe.addEventListener("click", function (e) { if (e.target.id === "deck-again") buildDeck(); });
  buildDeck();

  /* =========================================================
     ANIMAÇÕES DE ENTRADA DE CADA SLIDE
     data-a="chars|words|up|pop|kids|cards|wipe|scramble|flip"
     ========================================================= */
  var timelines = [];
  function buildTimeline(slide, idx) {
    var tl = gsap.timeline({ paused: true });
    var t = .05;
    $$("[data-a]", slide).forEach(function (n) {
      var a = n.getAttribute("data-a");
      if (a === "chars") {
        var sc = SplitText.create(n, { type: "chars" });
        tl.from(sc.chars, { yPercent: 90, rotationX: -90, opacity: 0, filter: "blur(12px)", transformOrigin: "50% 100%", duration: 1.1, stagger: .055, ease: "expo.out" }, t);
        t += .45;
      } else if (a === "words") {
        var sw = SplitText.create(n, { type: "words" });
        tl.from(sw.words, { y: 50, opacity: 0, filter: "blur(10px)", duration: .9, stagger: .07, ease: "expo.out" }, t);
        t += .3;
      } else if (a === "up") {
        tl.from(n, { y: 34, opacity: 0, filter: "blur(8px)", duration: .8, ease: "power3.out" }, t);
        t += .12;
      } else if (a === "pop") {
        tl.from(n, { y: 60, scale: .82, opacity: 0, duration: 1.1, ease: "expo.out" }, t);
        t += .15;
      } else if (a === "kids") {
        tl.from(n.children, { y: 30, scale: .85, opacity: 0, duration: .7, stagger: .08, ease: "back.out(1.7)" }, t);
        t += .25;
      } else if (a === "cards") {
        tl.from(n.children, { rotationX: -80, y: 70, opacity: 0, transformOrigin: "50% 0%", duration: 1, stagger: { each: .08, from: "start" }, ease: "expo.out" }, t);
        t += .35;
      } else if (a === "wipe") {
        tl.fromTo(n, { clipPath: "inset(0% 100% 0% 0% round 1.4rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.4rem)", duration: 1, ease: "expo.inOut" }, t);
        t += .2;
      } else if (a === "scramble") {
        var txt = n.textContent;
        tl.set(n, { textContent: " " , immediateRender: true }, 0);
        tl.to(n, { duration: 1.3, scrambleText: { text: txt, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ!", revealDelay: .3, speed: .5 } }, t);
        t += .2;
      } else if (a === "flip") {
        tl.from(n, { rotationX: -110, opacity: 0, transformPerspective: 600, duration: 1.2, ease: "back.out(1.5)" }, t);
        t += .15;
      }
    });
    var id = slide.id;
    if (id === "s2") {
      tl.add(function () { melState.v = 100; range.value = 100; setMel(100); }, 0);
      tl.to(melState, { v: 6, duration: 2.8, ease: "power2.inOut", onUpdate: function () { range.value = melState.v; setMel(melState.v); } }, 1.1);
    } else if (id === "s3") {
      $$(".count", slide).forEach(function (c) {
        var to = +c.getAttribute("data-to");
        tl.fromTo(c, { textContent: 0 }, { textContent: to, snap: { textContent: 1 }, duration: 1.8, ease: "power3.out" }, .5);
      });
    } else if (id === "s4") {
      tl.from($$(".step__arrow", slide), { scaleX: 0, transformOrigin: "0% 50%", duration: .6, stagger: .25, ease: "power3.out" }, .7);
      tl.from($$(".art-mel circle", slide), { scale: 0, transformOrigin: "50% 50%", duration: .6, stagger: .05, ease: "back.out(3)" }, 1.1);
    } else if (id === "s5") {
      tl.from($$(".locus", slide), { y: -90, opacity: 0, duration: .8, stagger: .08, ease: "bounce.out" }, .9);
    } else if (id === "s6") {
      tl.add(function () { renderPunnett(true); }, .45);
    } else if (id === "s7") {
      tl.set("#lid", { attr: { y: -240 } }, 0);
      tl.to("#lid", { attr: { y: 0 }, duration: .11, ease: "power2.in", repeat: 3, yoyo: true }, .7);
    } else if (id === "s9") {
      tl.from(cards.slice(0, 3), { y: 260, rotation: function (i) { return [-14, 10, -6][i]; }, opacity: 0, duration: 1, stagger: .1, ease: "expo.out" }, .3);
    } else if (id === "s10") {
      var m = SplitText.create("#motto", { type: "words,chars" });
      tl.from(m.chars, {
        x: function () { return rand(-500, 500); }, y: function () { return rand(-300, 300); },
        rotation: function () { return rand(-120, 120); }, scale: function () { return rand(.2, 2.4); },
        opacity: 0, duration: 1.5, ease: "expo.out", stagger: { amount: .6, from: "random" }
      }, .35);
      tl.to(m.words.slice(-1)[0].querySelectorAll(".char"), { color: getComputedStyle(slide).getPropertyValue("--accent").trim(), duration: .4, stagger: .03 }, 1.9);
    } else if (id === "s11") {
      tl.from("#end-logo", { rotationY: -540, scale: .2, opacity: 0, transformPerspective: 800, duration: 1.8, ease: "expo.out" }, .05);
      tl.add(function () { burst($("#end-logo"), 30); }, 1.1);
    }
    timelines[idx] = tl;
  }

  /* =========================================================
     NAVEGAÇÃO ENTRE SLIDES
     ========================================================= */
  var dotsEl = $("#dots");
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", (i + 1) + ". " + s.getAttribute("data-title"));
    b.innerHTML = "<span>" + s.getAttribute("data-title") + "</span>";
    b.addEventListener("click", function () { go(i); });
    dotsEl.appendChild(b);
  });
  var dots = $$("button", dotsEl);
  $("#count-total").textContent = String(N).padStart(2, "0");
  var active = -1;
  var played = [];

  function slideTop(i) { return flow ? slides[i].offsetTop : i * window.innerHeight; }
  function go(i) {
    i = Math.max(0, Math.min(N - 1, i));
    window.scrollTo({ top: slideTop(i), behavior: reduceMotion ? "auto" : "smooth" });
  }
  function currentIndex() {
    if (!flow) return Math.round(window.scrollY / window.innerHeight);
    var mid = window.scrollY + window.innerHeight * .45, idx = 0;
    slides.forEach(function (s, i) { if (s.offsetTop <= mid) idx = i; });
    return idx;
  }
  $("#prev").addEventListener("click", function () { go(currentIndex() - 1); });
  $("#next").addEventListener("click", function () { go(currentIndex() + 1); });
  $(".bar__brand").addEventListener("click", function (e) { e.preventDefault(); go(0); });

  function toggleFullscreen() {
    if (!document.fullscreenElement) { (doc.requestFullscreen || doc.webkitRequestFullscreen || function () {}).call(doc); }
    else { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
  }
  $("#fs").addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea" || e.altKey || e.ctrlKey || e.metaKey) return;
    var idx = currentIndex();
    // no quiz, ← e → respondem o cartão
    if (slides[idx].id === "s9" && (e.key === "ArrowLeft" || e.key === "ArrowRight") && at < items.length) {
      e.preventDefault();
      decide(e.key === "ArrowLeft" ? "mito" : "verdade");
      return;
    }
    var nextKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
    var prevKeys = ["ArrowUp", "ArrowLeft", "PageUp"];
    if (nextKeys.indexOf(e.key) > -1 && !(e.key === " " && e.shiftKey)) { e.preventDefault(); go(idx + 1); }
    else if (prevKeys.indexOf(e.key) > -1 || (e.key === " " && e.shiftKey)) { e.preventDefault(); go(idx - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(N - 1); }
    else if (e.key === "f" || e.key === "F") { toggleFullscreen(); }
  });

  /* estado a cada rolagem */
  var progress = $("#progress");
  function update() {
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";

    var idx = currentIndex();
    if (idx !== active) {
      active = idx;
      $("#count-now").textContent = String(idx + 1).padStart(2, "0");
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
      $("#prev").disabled = idx === 0;
      $("#next").disabled = idx === N - 1;
    }
    // cor da barra conforme o slide que está embaixo dela
    var topIdx;
    if (!flow) topIdx = Math.min(N - 1, Math.floor((y + 40) / vh));
    else { topIdx = 0; slides.forEach(function (s, i) { if (s.offsetTop <= y + 40) topIdx = i; }); }
    document.body.classList.toggle("on-dark", slides[topIdx].classList.contains("slide--dark"));

    // tocar / rebobinar as animações de entrada
    slides.forEach(function (s, i) {
      var visible, gone;
      if (!flow) {
        visible = i === 0 || y > (i - 1 + .22) * vh;
        gone = i > 0 && y < (i - 1) * vh + 2;
      } else {
        var top = s.offsetTop;
        visible = y + vh * .8 > top && y < top + s.offsetHeight;
        gone = y + vh < top - 10 || y > top + s.offsetHeight + 10;
      }
      if (visible && !played[i]) { played[i] = true; if (timelines[i]) timelines[i].restart(); }
      else if (gone && played[i] && i > 0) { played[i] = false; if (timelines[i]) timelines[i].pause(0); }
    });

    setCoverOn(!flow ? y < vh : y < cover.offsetHeight);
    var eyeSlide = $("#s7");
    var eyeIdx = slides.indexOf(eyeSlide);
    setEyeOn(!flow ? Math.abs(y / vh - eyeIdx) < 1 : (y + vh > eyeSlide.offsetTop && y < eyeSlide.offsetTop + eyeSlide.offsetHeight));
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
  }, { passive: true });

  /* efeito de pilha: o slide de baixo encolhe e escurece quando o próximo passa por cima */
  if (hasGsap && !flow && !reduceMotion) {
    slides.forEach(function (s, i) {
      if (i === 0) return;
      var prevIn = slides[i - 1].querySelector(".slide__in");
      var prevCanvas = i === 1 ? canvas : null;
      gsap.fromTo([prevIn, prevCanvas].filter(Boolean), { scale: 1, opacity: 1, y: 0 }, {
        scale: .84, opacity: .15, y: -60, ease: "none",
        scrollTrigger: { start: function () { return (i - 1) * window.innerHeight; }, end: function () { return i * window.innerHeight; }, scrub: true }
      });
      gsap.fromTo(s, { borderRadius: "3rem 3rem 0 0" }, {
        borderRadius: "0rem 0rem 0 0", ease: "none",
        scrollTrigger: { start: function () { return (i - 1) * window.innerHeight; }, end: function () { return i * window.innerHeight; }, scrub: true }
      });
    });
    // gruda sempre num slide inteiro
    ScrollTrigger.create({
      start: 0, end: "max",
      snap: { snapTo: 1 / (N - 1), duration: { min: .3, max: .8 }, delay: .06, ease: "power3.inOut" }
    });
  }

  /* botões "imã" (puxam na direção do cursor) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    $$("[data-magnetic], .picker label").forEach(function (b) {
      var strength = b.hasAttribute("data-magnetic") ? .35 : .18;
      b.classList.add("magnet");
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * strength).toFixed(1) + "px");
        b.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * strength).toFixed(1) + "px");
        b.classList.add("is-pulling");
      });
      b.addEventListener("pointerleave", function () {
        b.classList.remove("is-pulling");
        b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px");
      });
    });
  }

  /* começar */
  function start() {
    if (hasGsap && !reduceMotion) slides.forEach(buildTimeline);
    update();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();

  var lastW = window.innerWidth, resizeT;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      var nowFlow = window.innerWidth < 900 || window.innerHeight < 560 || !hasGsap;
      if (nowFlow !== flow) { location.reload(); return; }
      if (Math.abs(window.innerWidth - lastW) > 1 || !small) { lastW = window.innerWidth; seedGrains(); }
      if (hasGsap) ScrollTrigger.refresh();
      update();
    }, 200);
  });
})();
