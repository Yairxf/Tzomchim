import { useEffect, useMemo, useRef, useState } from 'react';

// לוח מסחר להמחשה: נרות יומיים, ממוצעים נעים 10/21 ו-ווליום.
// הגלילה מזיזה את הזמן קדימה, והנר האחרון "חי" ומתעדכן כל שנייה.
const TOTAL = 170;
const VIEW = 56;

function rng(seed) {
  return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
}

function buildCandles() {
  const r = rng(41017);
  const out = [];
  let p = 100;
  for (let i = 0; i < TOTAL; i++) {
    // מגמה: עלייה, תיקון, דשדוש, פריצה עם ווליום
    const phase = i < 62 ? 0.0028 : i < 86 ? -0.0042 : i < 112 ? 0.0004 : i < 118 ? 0.012 : 0.0026;
    const vol = i >= 112 && i < 120 ? 0.018 : 0.011;
    const o = p;
    const c = o * (1 + phase + (r() - 0.5) * vol * 2);
    const h = Math.max(o, c) * (1 + r() * vol * 0.8);
    const l = Math.min(o, c) * (1 - r() * vol * 0.8);
    const v = (0.55 + r() * 0.5) * (i >= 112 && i < 120 ? 2.3 : 1);
    out.push({ o, h, l, c, v });
    p = c;
  }
  return out;
}

const sma = (arr, n, i) => {
  if (i < n - 1) return null;
  let s = 0;
  for (let k = i - n + 1; k <= i; k++) s += arr[k].c;
  return s / n;
};

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const TILES = [
  { name: 'S&P 500', base: 0.42 },
  { name: 'נאסד״ק', base: 0.68 },
  { name: 'ת״א 125', base: -0.21 },
  { name: 'דולר/שקל', base: 0.12 },
];

function useStill() {
  const [still, set] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const upd = () => set(mq.matches || document.documentElement.classList.contains('a11y-still'));
    upd();
    mq.addEventListener?.('change', upd);
    const mo = new MutationObserver(upd);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { mq.removeEventListener?.('change', upd); mo.disconnect(); };
  }, []);
  return still;
}

function Spark({ seed, up }) {
  const d = useMemo(() => {
    const r = rng(seed);
    let y = 12;
    const pts = [];
    for (let i = 0; i < 16; i++) { y = clamp(y + (r() - (up ? 0.62 : 0.38)) * 5, 2, 22); pts.push(`${i ? 'L' : 'M'}${(i * 4).toFixed(0)} ${y.toFixed(1)}`); }
    return pts.join(' ');
  }, [seed, up]);
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" className="w-12 sm:w-[60px] shrink-0" aria-hidden="true">
      <path d={d} fill="none" stroke={up ? '#4ADE80' : '#F87171'} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Market() {
  const base = useMemo(buildCandles, []);
  const still = useStill();
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [scrollP, setScrollP] = useState(0);
  const [live, setLive] = useState({ k: 1, hi: 1, lo: 1, tiles: TILES.map((t) => t.base), flash: -1 });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const bottom = el.getBoundingClientRect().bottom + window.scrollY;
        setScrollP(clamp(window.scrollY / Math.max(bottom - 80, 400)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => {
      setLive((p) => {
        const k = clamp(p.k + (Math.random() - 0.47) * 0.006, 0.985, 1.02);
        const i = Math.floor(Math.random() * TILES.length);
        const tiles = p.tiles.map((v, j) => (j === i ? clamp(v + (Math.random() - 0.48) * 0.12, -1.5, 1.8) : v));
        return { k, hi: Math.max(p.hi, k), lo: Math.min(p.lo, k), tiles, flash: i };
      });
    }, 900);
    return () => clearInterval(id);
  }, [still]);

  // החלון הנראה: מתחיל בשבועות הראשונים ומתקדם עם הגלילה עד הפריצה ואחריה
  const end = Math.round(58 + scrollP * (TOTAL - 58));
  const start = Math.max(0, end - VIEW);
  const candles = useMemo(() => {
    const arr = base.slice(0, end).map((c) => ({ ...c }));
    const last = arr[arr.length - 1];
    if (!still) {
      last.c = last.o + (last.c - last.o) * 0.2 + last.o * (live.k - 1) * 3;
      last.h = Math.max(last.h, last.c, last.o * (1 + (live.hi - 1) * 3));
      last.l = Math.min(last.l, last.c, last.o * (1 + (live.lo - 1) * 3));
    }
    return arr;
  }, [base, end, live, still]);

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const chg = ((last.c - prev.c) / prev.c) * 100;
  const price = last.c * 52.4;
  const m10 = sma(candles, 10, candles.length - 1);
  const m21 = sma(candles, 21, candles.length - 1);
  const cross = useMemo(() => {
    for (let i = candles.length - 1; i > Math.max(start, candles.length - 18); i--) {
      const a = sma(candles, 10, i), b = sma(candles, 21, i), a0 = sma(candles, 10, i - 1), b0 = sma(candles, 21, i - 1);
      if (a && b && a0 && b0 && a0 <= b0 && a > b) return true;
    }
    return false;
  }, [candles, start]);
  const breakout = end >= 114 && end <= 134;

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const g = c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const vis = candles.slice(start);
      const volH = h * 0.2;
      const priceH = h - volH - 8;
      let hi = -Infinity, lo = Infinity, vmax = 0;
      vis.forEach((k) => { hi = Math.max(hi, k.h); lo = Math.min(lo, k.l); vmax = Math.max(vmax, k.v); });
      const pad = (hi - lo) * 0.08; hi += pad; lo -= pad;
      const right = 8;
      const step = (w - right) / VIEW;
      const bw = Math.max(2, step * 0.62);
      const X = (i) => (i - start) * step + step / 2;
      const Y = (v) => ((hi - v) / (hi - lo)) * priceH;

      g.strokeStyle = 'rgba(216,243,230,.06)'; g.lineWidth = 1;
      for (let i = 1; i < 4; i++) { const y = (i / 4) * priceH; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }

      vis.forEach((k, j) => {
        const i = start + j;
        const up = k.c >= k.o;
        const col = up ? '#4ADE80' : '#F87171';
        const x = X(i);
        g.fillStyle = up ? 'rgba(74,222,128,.22)' : 'rgba(248,113,113,.22)';
        const vh = (k.v / vmax) * volH;
        g.fillRect(x - bw / 2, h - vh, bw, vh);
        g.strokeStyle = col; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x, Y(k.h)); g.lineTo(x, Y(k.l)); g.stroke();
        const top = Y(Math.max(k.o, k.c)), bot = Y(Math.min(k.o, k.c));
        g.fillStyle = col;
        g.fillRect(x - bw / 2, top, bw, Math.max(1.2, bot - top));
      });

      const line = (n, col) => {
        g.strokeStyle = col; g.lineWidth = 1.8; g.lineJoin = 'round'; g.beginPath();
        let on = false;
        for (let i = start; i < candles.length; i++) {
          const v = sma(candles, n, i);
          if (v == null) continue;
          on ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v));
          on = true;
        }
        g.stroke();
      };
      line(21, '#F2B21B');
      line(10, '#7DD3FC');

      const lx = X(candles.length - 1), ly = Y(last.c);
      g.setLineDash([3, 4]); g.strokeStyle = 'rgba(236,253,245,.35)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(0, ly); g.lineTo(w, ly); g.stroke(); g.setLineDash([]);
      g.fillStyle = 'rgba(236,253,245,.9)'; g.beginPath(); g.arc(lx, ly, 2.6, 0, Math.PI * 2); g.fill();
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [candles, start, last]);

  const pct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
  const fmt = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div ref={wrap} className="relative rounded-[30px] bg-[#0A2419] text-cream p-5 sm:p-6 shadow-[0_30px_60px_-20px_rgba(15,81,50,.55)] overflow-hidden min-w-0 border border-white/5">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(74,222,128,.16),transparent_70%)]" aria-hidden="true" />
      <p className="sr-only">המחשה של מסך מסחר: גרף נרות יומי עם ממוצעים נעים של 10 ו-21 ימים ועמודות ווליום. ככל שגוללים בעמוד, הגרף מתקדם בזמן ומגיע לפריצה עם ווליום גבוה. הנתונים להמחשה בלבד.</p>

      <div aria-hidden="true" className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[13px] text-leaf font-semibold">מסך המסחר של הקורס</span>
            <span className="block text-[12px] text-cream/55 mt-0.5">גרף נרות יומי · נתונים להמחשה</span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/[.08] border border-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider font-mono" dir="ltr">
            <span className="relative flex w-2 h-2">
              {!still && <span className="absolute inset-0 rounded-full bg-[#4ADE80] animate-ping opacity-70" />}
              <span className="relative w-2 h-2 rounded-full bg-[#4ADE80]" />
            </span>
            LIVE
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 flex-wrap">
          <div dir="ltr" className="text-left">
            <span className="block font-mono text-[12px] text-cream/55">DEMO · 1D</span>
            <b className="block font-display font-extrabold text-[34px] sm:text-[40px] leading-none num">{fmt(price)}</b>
          </div>
          <span className={`rounded-lg px-2 py-1 text-[13px] font-bold font-mono num ${chg >= 0 ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-[#F87171]/15 text-[#F87171]'}`} dir="ltr">
            {chg >= 0 ? '▲' : '▼'} {pct(chg)}
          </span>
        </div>

        <div className="mt-3 h-6 flex flex-wrap gap-1.5 overflow-hidden">
          <span className={`rounded-md bg-[#7DD3FC]/15 text-[#BAE6FD] text-[11.5px] font-bold px-2 py-1 transition-opacity duration-500 ${cross ? 'opacity-100' : 'opacity-0'}`}>חציית ממוצעים 10/21</span>
          <span className={`rounded-md bg-[#4ADE80]/15 text-[#86EFAC] text-[11.5px] font-bold px-2 py-1 transition-opacity duration-500 ${breakout ? 'opacity-100' : 'opacity-0'}`}>פריצה עם ווליום גבוה</span>
        </div>
        <div className="relative mt-2 h-[190px] sm:h-[220px]">
          <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-cream/60">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-[#7DD3FC]" />ממוצע 10 <span className="font-mono num text-cream/80" dir="ltr">{m10 ? fmt(m10 * 52.4) : '–'}</span></span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-gold" />ממוצע 21 <span className="font-mono num text-cream/80" dir="ltr">{m21 ? fmt(m21 * 52.4) : '–'}</span></span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#4ADE80]/25" />ווליום</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {TILES.map((t, i) => {
            const v = live.tiles[i];
            return (
              <div key={t.name} className={`rounded-xl border border-white/5 px-3 py-2.5 flex items-center justify-between gap-2 min-w-0 transition-colors duration-700 ${live.flash === i && !still ? (v >= 0 ? 'bg-[#4ADE80]/[.08]' : 'bg-[#F87171]/[.08]') : 'bg-white/5'}`}>
                <div className="min-w-0">
                  <span className="block text-[12.5px] font-semibold truncate">{t.name}</span>
                  <span className={`block font-mono text-[12.5px] num ${v >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`} dir="ltr" style={{ textAlign: 'right' }}>{pct(v)}</span>
                </div>
                <Spark seed={i * 97 + 13} up={t.base >= 0} />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-cream/40">נתונים להמחשה בלבד, לא ייעוץ השקעות. גללו למטה כדי לראות את הגרף מתקדם.</p>
      </div>
    </div>
  );
}
