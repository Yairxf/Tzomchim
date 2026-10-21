/* צומחים · page logic. Every panel computes its state from the arrays below.
   All market data here is a labelled sample scenario, never real prices. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  var vh = innerHeight;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ils = function (v) { return '₪' + Math.round(v).toLocaleString('en-US'); };
  var pct = function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) + '%'; };

  /* ------------------------------------------------------ motion setting */
  var still = mqReduce.matches;
  try { if (localStorage.getItem('tz-still') === '1') still = true; } catch (e) {}
  var toggle = document.querySelector('[data-motion-toggle]');
  function applyStill() {
    root.classList.toggle('still', still);
    if (toggle) toggle.setAttribute('aria-pressed', String(still));
  }
  applyStill();
  if (toggle) toggle.addEventListener('click', function () {
    still = !still;
    try { localStorage.setItem('tz-still', still ? '1' : '0'); } catch (e) {}
    applyStill();
  });

  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

  function sizeCanvas(c) {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    var g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g: g, w: w, h: h };
  }

  /* --------------------------------------------------- 1 · market open */
  var OPEN_N = 72;
  var candles = (function () {
    var r = rng(20261021), out = [], p = 100;
    for (var i = 0; i < OPEN_N; i++) {
      var drift = i < 26 ? 0.003 : i < 40 ? -0.0035 : i < 52 ? 0.0008 : i < 57 ? 0.011 : 0.0025;
      var vol = i >= 52 && i < 58 ? 0.017 : 0.01;
      var o = p, c = o * (1 + drift + (r() - 0.5) * vol * 2);
      var h = Math.max(o, c) * (1 + r() * vol * 0.7), l = Math.min(o, c) * (1 - r() * vol * 0.7);
      out.push({ o: o, h: h, l: l, c: c, v: (0.5 + r() * 0.5) * (i >= 52 && i < 58 ? 2.2 : 1) });
      p = c;
    }
    return out;
  })();
  var SCALE = 51.7;
  var liveK = 0;
  function sma(arr, n, i) { if (i < n - 1) return null; var s = 0; for (var k = i - n + 1; k <= i; k++) s += arr[k].c; return s / n; }

  var openEl = document.querySelector('[data-chart-open]');
  var openCanvas = openEl && openEl.querySelector('canvas');
  var priceEl = document.querySelector('[data-live-price]');
  var openGeom = null;

  function drawOpen() {
    if (!openCanvas) return;
    var cv = sizeCanvas(openCanvas), g = cv.g, w = cv.w, h = cv.h;
    if (!w || !h) return;
    var data = candles.map(function (k) { return k; });
    var last = Object.assign({}, data[data.length - 1]);
    last.c = last.c * (1 + liveK); last.h = Math.max(last.h, last.c); last.l = Math.min(last.l, last.c);
    data[data.length - 1] = last;
    var volH = h * 0.18, priceH = h - volH - 10;
    var hi = -1e9, lo = 1e9, vmax = 0;
    data.forEach(function (k) { hi = Math.max(hi, k.h); lo = Math.min(lo, k.l); vmax = Math.max(vmax, k.v); });
    var pad = (hi - lo) * 0.08; hi += pad; lo -= pad;
    var step = (w - 14) / data.length, bw = Math.max(2, step * 0.6);
    var X = function (i) { return 6 + i * step + step / 2; };
    var Y = function (v) { return ((hi - v) / (hi - lo)) * priceH + 4; };
    openGeom = { X: X, Y: Y, step: step, data: data, hi: hi, lo: lo, priceH: priceH };
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(243,236,221,0.07)'; g.lineWidth = 1;
    for (var q = 1; q < 4; q++) { var yy = (q / 4) * priceH; g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke(); }
    data.forEach(function (k, i) {
      var up = k.c >= k.o, col = up ? '#4ADE80' : '#F87171', x = X(i);
      g.fillStyle = up ? 'rgba(74,222,128,0.22)' : 'rgba(248,113,113,0.22)';
      var vhh = (k.v / vmax) * volH; g.fillRect(x - bw / 2, h - vhh, bw, vhh);
      g.strokeStyle = col; g.beginPath(); g.moveTo(x, Y(k.h)); g.lineTo(x, Y(k.l)); g.stroke();
      var t = Y(Math.max(k.o, k.c)), b = Y(Math.min(k.o, k.c));
      g.fillStyle = col; g.fillRect(x - bw / 2, t, bw, Math.max(1.4, b - t));
    });
    [[21, '#F2B21B'], [10, '#7DD3FC']].forEach(function (m) {
      g.strokeStyle = m[1]; g.lineWidth = 1.8; g.lineJoin = 'round'; g.beginPath(); var on = false;
      for (var i = 0; i < data.length; i++) { var v = sma(data, m[0], i); if (v == null) continue; on ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v)); on = true; }
      g.stroke();
    });
    var ly = Y(last.c);
    g.setLineDash([3, 4]); g.strokeStyle = 'rgba(243,236,221,0.35)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, ly); g.lineTo(w, ly); g.stroke(); g.setLineDash([]);
    if (priceEl) {
      var prev = data[data.length - 2].c, ch = (last.c - prev) / prev * 100;
      priceEl.textContent = (last.c * SCALE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '  ' + pct(ch);
      priceEl.style.color = ch >= 0 ? '#4ADE80' : '#F87171';
    }
  }

  // Crosshair: what a real chart does under the pointer.
  if (openEl && mqFine.matches) {
    openEl.addEventListener('pointermove', function (e) {
      if (!openGeom) return;
      var r = openEl.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      var i = clamp(Math.round((x - 6) / openGeom.step - 0.5), 0, openGeom.data.length - 1);
      var k = openGeom.data[i], cx = openGeom.X(i);
      var val = openGeom.hi - ((y - 4) / openGeom.priceH) * (openGeom.hi - openGeom.lo);
      openEl.style.setProperty('--cx', cx + 'px');
      openEl.style.setProperty('--cy', clamp(y, 0, openGeom.priceH) + 'px');
      var tag = openEl.querySelector('.crosshair__tag');
      tag.textContent = 'D' + (i + 1) + '  O ' + (k.o * SCALE).toFixed(0) + '  C ' + (k.c * SCALE).toFixed(0) + '  · ' + (val * SCALE).toFixed(0);
      openEl.classList.add('is-hover');
    });
    openEl.addEventListener('pointerleave', function () { openEl.classList.remove('is-hover'); });
  }

  // Watchlist ticks: small random moves, labelled as sample data on the page.
  var ticks = Array.prototype.slice.call(document.querySelectorAll('[data-tick]'));
  var tickVals = ticks.map(function (_, i) { return [0.42, 0.18, -0.11, 0.27, 0.05, -0.08, 0.33, 0.12, 0.61, 0.48][i] || 0; });
  function renderTicks(flash) {
    ticks.forEach(function (el, i) {
      el.textContent = pct(tickVals[i]);
      el.classList.toggle('is-down', tickVals[i] < 0);
      el.classList.toggle('is-flash', i === flash);
    });
  }
  renderTicks(-1);

  var openVisible = true;
  if ('IntersectionObserver' in window && openEl) {
    new IntersectionObserver(function (en) { openVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(document.getElementById('open'));
  }
  setInterval(function () {
    if (still || !openVisible || document.hidden) return;
    liveK = clamp(liveK + (Math.random() - 0.47) * 0.0025, -0.012, 0.018);
    var i = Math.floor(Math.random() * ticks.length);
    tickVals[i] = clamp(tickVals[i] + (Math.random() - 0.47) * 0.16, -1.6, 2.2);
    renderTicks(i);
    drawOpen();
  }, 950);

  /* -------------------------------------------------------- pinned acts */
  function pinnedP(el) {
    var r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(r.height - vh, 1), 0, 1);
  }

  /* -------------------------------------------------------- 2 · time */
  var timeAct = document.getElementById('time');
  var T = {
    svg: document.querySelector('[data-t-svg]'),
    age: document.querySelector('[data-t-age]'), dep: document.querySelector('[data-t-dep]'),
    val: document.querySelector('[data-t-val]'), gain: document.querySelector('[data-t-gain]'),
    status: document.querySelector('[data-t-status]'), summary: document.querySelector('[data-t-summary]')
  };
  var START = 16, END = 65, RATE = 0.07;
  var monthly = 100;
  function series(m) {
    var r = RATE / 12, v = 0, d = 0, out = [{ age: START, v: 0, d: 0 }];
    for (var a = START + 1; a <= END; a++) {
      for (var k = 0; k < 12; k++) { v = v * (1 + r) + m; d += m; }
      out.push({ age: a, v: v, d: d });
    }
    return out;
  }
  var tSeries = series(monthly);
  var tStatusKey = '';
  function drawTime(p) {
    if (!T.svg) return;
    var n = tSeries.length - 1, upto = p * n, full = Math.floor(upto), frac = upto - full;
    var max = tSeries[n].v * 1.05;
    var X = function (i) { return (i / n) * 600; };   // charts read left to right, even on a Hebrew page
    var Y = function (v) { return 300 - (v / max) * 290; };
    var pts = [], dps = [];
    for (var i = 0; i <= full; i++) { pts.push([X(i), Y(tSeries[i].v)]); dps.push([X(i), Y(tSeries[i].d)]); }
    var cur = tSeries[full], nxt = tSeries[Math.min(full + 1, n)];
    var cv = cur.v + (nxt.v - cur.v) * frac, cd = cur.d + (nxt.d - cur.d) * frac, ca = cur.age + (nxt.age - cur.age) * frac;
    pts.push([X(upto), Y(cv)]); dps.push([X(upto), Y(cd)]);
    var path = function (a) { return a.map(function (q, j) { return (j ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' '); };
    T.svg.querySelector('.t-val').setAttribute('d', path(pts));
    T.svg.querySelector('.t-dep').setAttribute('d', path(dps));
    T.svg.querySelector('.t-area').setAttribute('d', path(pts) + ' L' + X(upto).toFixed(1) + ' 300 L0 300 Z');
    var dot = T.svg.querySelector('.t-dot'); dot.setAttribute('cx', X(upto).toFixed(1)); dot.setAttribute('cy', Y(cv).toFixed(1));
    T.age.textContent = Math.floor(ca);
    T.dep.textContent = ils(cd); T.val.textContent = ils(cv); T.gain.textContent = ils(Math.max(0, cv - cd));
    var key = p < 0.3 ? 'a' : p < 0.7 ? 'b' : 'c';
    if (key !== tStatusKey) {
      tStatusKey = key;
      T.status.textContent = key === 'a' ? 'שנים ראשונות: נראה שלא קורה כלום. ממשיכים להפקיד.'
        : key === 'b' ? 'כאן זה מתחיל: הריבית מרוויחה ריבית בעצמה.'
        : 'רוב הכסף כאן הוא ריבית, לא הפקדות. זה כוח הזמן, ובגללו כדאי להתחיל מוקדם.';
    }
  }
  function timeSummary() {
    var e = tSeries[tSeries.length - 1];
    T.summary.textContent = 'בסיכום: ' + ils(monthly) + ' בחודש מגיל 16 עד 65 הם ' + ils(e.d) + ' הפקדות, ושווי של כ-' + ils(e.v) + '. הנחה: 7% בשנה בממוצע, להמחשה בלבד. לא תחזית ולא המלצה.';
  }
  timeSummary();
  Array.prototype.forEach.call(document.querySelectorAll('[data-monthly]'), function (b) {
    b.addEventListener('click', function () {
      monthly = +b.getAttribute('data-monthly');
      tSeries = series(monthly);
      document.querySelectorAll('[data-monthly]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      timeSummary(); frame(true);
    });
  });

  /* ------------------------------------------------------- 4 · crash */
  var crashAct = document.getElementById('crash');
  var C = {
    canvas: document.querySelector('[data-crash] canvas'), val: document.querySelector('[data-c-val]'),
    phase: document.querySelector('[data-c-phase]'), ticket: document.querySelector('[data-c-ticket]'),
    hint: document.querySelector('[data-c-hint]'), result: document.querySelector('[data-c-result]')
  };
  var DAYS = 200, BOTTOM = 92, START_V = 10000;
  var idx = (function () {
    var r = rng(77031), out = [], v = 100;
    for (var d = 0; d <= DAYS; d++) {
      var target = d <= 70 ? 100 + 18 * (d / 70)
        : d <= BOTTOM ? 118 - 40 * Math.pow((d - 70) / (BOTTOM - 70), 0.8)
        : 78 + 48 * (1 - Math.pow(1 - (d - BOTTOM) / (DAYS - BOTTOM), 1.6));
      var noise = (r() - 0.5) * (d > 70 && d < 120 ? 3.2 : 1.6);
      v = d === 0 ? 100 : d === BOTTOM ? 78 : d === DAYS ? 126 : target + noise;
      out.push(v);
    }
    return out;
  })();
  var choice = null;
  var HOLD_END = START_V * idx[DAYS] / 100, SELL_END = START_V * idx[BOTTOM] / 100;
  function dayFor(p) {
    if (p <= 0.4) return (p / 0.4) * BOTTOM;
    if (p <= 0.52) return BOTTOM;
    return BOTTOM + ((p - 0.52) / 0.48) * (DAYS - BOTTOM);
  }
  var lastCrashState = '';
  function drawCrash(p) {
    if (!C.canvas) return;
    var cv = sizeCanvas(C.canvas), g = cv.g, w = cv.w, h = cv.h;
    if (!w || !h) return;
    var day = dayFor(p), lo = 70, hi = 132;
    var X = function (d) { return 10 + (d / DAYS) * (w - 20); };
    var Y = function (v) { return 10 + ((hi - v) / (hi - lo)) * (h - 20); };
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(243,236,221,0.07)'; g.lineWidth = 1;
    [80, 100, 120].forEach(function (v) { g.beginPath(); g.moveTo(0, Y(v)); g.lineTo(w, Y(v)); g.stroke(); });
    g.fillStyle = 'rgba(169,190,177,0.8)'; g.font = '11px "JetBrains Mono", monospace'; g.direction = 'ltr'; g.textAlign = 'left';
    g.fillStyle = 'rgba(11,28,21,0.85)'; g.fillRect(4, Y(100) - 20, 64, 16);
    g.fillStyle = 'rgba(169,190,177,0.9)'; g.fillText('₪10,000', 8, Y(100) - 7);
    g.setLineDash([2, 4]); g.strokeStyle = 'rgba(243,236,221,0.25)';
    g.beginPath(); g.moveTo(0, Y(100)); g.lineTo(w, Y(100)); g.stroke(); g.setLineDash([]);

    function line(to, color, width, dash, flatFrom, from) {
      from = from || 0;
      g.strokeStyle = color; g.lineWidth = width; g.lineJoin = 'round'; g.setLineDash(dash || []);
      g.beginPath();
      for (var d = from; d <= to; d++) {
        var v = flatFrom != null && d > flatFrom ? idx[flatFrom] : idx[d];
        d > from ? g.lineTo(X(d), Y(v)) : g.moveTo(X(d), Y(v));
      }
      var endV = flatFrom != null && to > flatFrom ? idx[flatFrom] : idx[Math.floor(to)];
      g.lineTo(X(to), Y(endV));
      g.stroke(); g.setLineDash([]);
      return endV;
    }
    var past = Math.min(day, BOTTOM);
    var common = line(Math.min(past, 70), '#4ADE80', 2.6);
    if (past > 70) common = line(past, '#F87171', 2.6, null, null, 70);
    var curV = common;
    if (day > BOTTOM) {
      var holdBold = choice !== 'sell', sellBold = choice === 'sell';
      var hv = line(day, holdBold ? '#4ADE80' : 'rgba(74,222,128,0.45)', holdBold ? 2.8 : 1.6, holdBold ? null : [5, 5], null, BOTTOM);
      var sv = line(day, sellBold ? '#F87171' : 'rgba(248,113,113,0.55)', sellBold ? 2.8 : 1.6, sellBold ? null : [5, 5], BOTTOM, BOTTOM);
      curV = choice === 'sell' ? sv : hv;
      // labels at the line ends
      g.font = '12px "Heebo", sans-serif'; g.textAlign = 'right'; g.direction = 'rtl';
      g.fillStyle = '#86EFAC'; g.fillText(choice === 'hold' ? 'אתם · מחזיקים' : 'מחזיקים', X(day) - 8, Y(hv) - 8);
      g.fillStyle = '#FCA5A5'; g.fillText(choice === 'sell' ? 'אתם · מכרתם' : 'מוכרים', X(day) - 8, Y(sv) + 18);
      g.textAlign = 'start'; g.direction = 'inherit';
    }
    var px = X(day), py = Y(curV);
    g.fillStyle = 'rgba(243,236,221,0.95)'; g.beginPath(); g.arc(px, py, 3.6, 0, Math.PI * 2); g.fill();
    C.val.textContent = ils(START_V * curV / 100);

    // state text, only when it changes
    var state = day <= 70 ? 'up' : day < BOTTOM ? 'fall' : p <= 0.52 ? 'decide' : 'after';
    var stateKey = state + '|' + choice;
    C.phase.classList.toggle('is-down', state !== 'up' && !(state === 'after' && choice !== 'sell'));
    if (stateKey !== lastCrashState) {
      lastCrashState = stateKey;
      C.phase.textContent = state === 'up' ? 'השוק עולה' : state === 'fall' ? 'השוק נופל' : state === 'decide' ? 'תחתית · זמן להחליט' : 'אחרי המשבר';
      C.ticket.classList.toggle('is-armed', state === 'decide' && !choice);
      C.ticket.classList.toggle('is-idle', state === 'up');
      var hPct = (HOLD_END / START_V - 1) * 100, sPct = (SELL_END / START_V - 1) * 100;
      if (state === 'after') {
        C.result.innerHTML = choice === 'hold'
          ? 'החזקתם: <b class="up">' + ils(HOLD_END) + ' (' + pct(hPct).replace('.00', '') + ')</b>. מי שמכר בתחתית נשאר עם <b class="down">' + ils(SELL_END) + '</b>.'
          : choice === 'sell'
          ? 'מכרתם בתחתית: <b class="down">' + ils(SELL_END) + ' (' + pct(sPct).replace('.00', '') + ')</b>. מי שהחזיק הגיע ל-<b class="up">' + ils(HOLD_END) + '</b>.'
          : 'לא בחרתם, אז הנה שני העתידים: להחזיק <b class="up">' + ils(HOLD_END) + '</b>, למכור <b class="down">' + ils(SELL_END) + '</b>.';
      } else if (state === 'decide') {
        C.result.textContent = choice ? 'נרשם. המשיכו לגלול כדי לראות מה קרה.' : 'הגרף עצר. ההחלטה שלכם.';
      } else if (state === 'fall') {
        C.result.textContent = 'התיק מאבד ערך מול העיניים. כולם ברשת צועקים למכור.';
      } else {
        C.result.textContent = 'הכל עולה. קל להיות משקיע כשהשוק עולה.';
      }
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-choice]'), function (b) {
    b.addEventListener('click', function () {
      choice = b.getAttribute('data-choice');
      document.querySelectorAll('[data-choice]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      C.hint.textContent = choice === 'hold' ? 'בחרתם להחזיק. גללו הלאה.' : 'בחרתם למכור. גללו הלאה.';
      lastCrashState = ''; frame(true);
    });
  });

  /* ------------------------------------------------------- tabs state */
  var tabs = {};
  Array.prototype.forEach.call(document.querySelectorAll('[data-tab]'), function (a) { tabs[a.getAttribute('data-tab')] = a; });
  var sections = ['open', 'time', 'crash', 'path', 'desk', 'account', 'ticket'].map(function (id) { return document.getElementById(id); });
  var currentTab = '';
  function updateTabs() {
    var mid = vh * 0.4, cur = 'open';
    sections.forEach(function (s) { if (s && s.getBoundingClientRect().top <= mid) cur = s.id; });
    if (document.getElementById('alert').getBoundingClientRect().top <= mid && document.getElementById('crash').getBoundingClientRect().top > mid) cur = 'crash';
    if (cur !== currentTab) {
      if (tabs[currentTab]) tabs[currentTab].removeAttribute('aria-current');
      if (tabs[cur]) tabs[cur].setAttribute('aria-current', 'true');
      currentTab = cur;
    }
  }

  /* ------------------------------------------------------------- loop */
  var queued = false, lastT = -1, lastC = -1;
  function frame(force) {
    var tp = timeAct ? pinnedP(timeAct) : 0;
    var cp = crashAct ? pinnedP(crashAct) : 0;
    if (force === true || Math.abs(tp - lastT) > 0.0005) { drawTime(tp); lastT = tp; }
    if (force === true || Math.abs(cp - lastC) > 0.0005) { drawCrash(cp); lastC = cp; }
    updateTabs();
  }
  function onScroll() {
    if (queued) return; queued = true;
    requestAnimationFrame(function () { queued = false; frame(false); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; drawOpen(); frame(true); });
  var start = function () { drawOpen(); frame(true); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  start();

  /* ------------------------------------------------------- the ticket */
  var form = document.querySelector('[data-order]');
  if (form) {
    var phoneOk = function (p) { return /^0(5\d|[2-489]|7\d)-?\d{3}-?\d{4}$|^\+?972-?5\d-?\d{3}-?\d{4}$/.test(p.replace(/\s/g, '')); };
    var setErr = function (name, msg) {
      var el = form.elements[name], err = document.getElementById('e-' + name);
      if (err) err.textContent = msg || '';
      if (el && el.setAttribute) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
    };
    var msg = function () {
      var f = form.elements;
      return ['הרשמה לשיעור ניסיון · צומחים',
        'איש קשר: ' + f.parent.value.trim(),
        'טלפון: ' + f.phone.value.trim(),
        'משתתף/ת: ' + f.child.value.trim() + ' · ' + f.grade.value,
        'יישוב / בית ספר: ' + f.place.value.trim(),
        'רמה: ' + (form.querySelector('[name=level]:checked') || {}).value,
        'אישור צילום: ' + (f.photos.checked ? 'כן' : 'לא')].join('\n');
    };
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements, bad = [];
      var check = function (name, ok, text) { setErr(name, ok ? '' : text); if (!ok) bad.push(name); };
      check('parent', f.parent.value.trim().length >= 2, 'נא למלא שם מלא.');
      check('phone', phoneOk(f.phone.value), 'נא למלא מספר נייד ישראלי, למשל 050-1234567.');
      check('child', f.child.value.trim().length >= 2, 'נא למלא את שם המשתתף/ת.');
      check('grade', !!f.grade.value, 'נא לבחור כיתה.');
      check('place', f.place.value.trim().length >= 2, 'נא למלא יישוב או בית ספר.');
      check('terms', f.terms.checked, 'כדי להירשם יש לאשר את התקנון ומדיניות הפרטיות.');
      check('contact', f.contact.checked, 'נא לאשר שניצור קשר לגבי הקורס.');
      if (bad.length) { f[bad[0]].focus(); return; }
      if (f.company.value) return; // honeypot
      var url = 'https://wa.me/972584272333?text=' + encodeURIComponent(msg());
      var w = window.open(url, '_blank');
      if (w) w.opener = null; else location.href = url;
      form.querySelector('[data-order-again]').href = url;
      form.classList.add('is-sent');
      var done = form.querySelector('[data-order-done]');
      done.hidden = false; done.focus();
    });
  }
})();
