import { useEffect, useMemo, useRef, useState } from 'react';
import { ils } from '../data.js';

// תיק דמה להמחשה: 100 ₪ בחודש מגיל 14, תשואה שנתית ממוצעת של 7%, כולל משבר אחד בדרך.
const MONTHLY = 100;
const YEARS = 30;
const START_AGE = 14;
const R = 0.07 / 12;
const N = YEARS * 12;

const HOLDINGS = [
  { name: 'S&P 500', w: 0.6, color: '#4ADE80' },
  { name: 'אג״ח ממשלתי', w: 0.2, color: '#F2B21B' },
  { name: 'נאסד״ק 100', w: 0.15, color: '#7DD3FC' },
  { name: 'מזומן', w: 0.05, color: '#94A3B8' },
];

function rng(seed) {
  return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
}

function buildSeries() {
  const rand = rng(20261018);
  const value = [0];
  const deposits = [0];
  let noise = 0;
  for (let m = 1; m <= N; m++) {
    const fv = MONTHLY * ((1 + R) ** m - 1) / R;
    noise = noise * 0.86 + (rand() - 0.5) * 0.035;
    // משבר בשנה 8: ירידה חדה וחזרה הדרגתית
    let crash = 0;
    if (m >= 90 && m < 97) crash = (m - 90) / 7;
    else if (m >= 97 && m < 130) crash = 1 - (m - 97) / 33;
    crash = crash * crash * (3 - 2 * crash);
    value.push(Math.max(fv * (1 + noise - 0.24 * crash), m * MONTHLY * 0.7));
    deposits.push(m * MONTHLY);
  }
  return { value, deposits };
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

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

export default function Portfolio() {
  const { value, deposits } = useMemo(buildSeries, []);
  const still = useStill();
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [scrollP, setScrollP] = useState(0);
  const [intro, setIntro] = useState(0);
  const [tick, setTick] = useState({ day: 0.42, rows: HOLDINGS.map(() => 0), flash: -1 });

  // ההתקדמות בזמן נקבעת לפי הגלילה: ככל שגוללים, התיק "מזדקן"
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const bottom = r.bottom + window.scrollY;
        setScrollP(clamp(window.scrollY / Math.max(bottom - 80, 400)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  // אנימציית פתיחה: התיק "גדל" לבד ל-12 שנה הראשונות
  useEffect(() => {
    if (still) { setIntro(1); return; }
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const k = clamp((t - t0) / 2200);
      setIntro(1 - (1 - k) ** 3);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [still]);

  // "נתונים חיים": תנודות קטנות כל שנייה
  useEffect(() => {
    if (still) return;
    const id = setInterval(() => {
      setTick((p) => {
        const i = Math.floor(Math.random() * 3);
        const rows = p.rows.map((v, j) => (j === i ? clamp(v + (Math.random() - 0.47) * 0.5, -2.4, 2.8) : v));
        return { day: clamp(p.day + (Math.random() - 0.46) * 0.18, -1.2, 1.6), rows, flash: i };
      });
    }, 1100);
    return () => clearInterval(id);
  }, [still]);

  const BASE = 0.4; // שנה 12 מוצגת כבר בטעינה
  const progress = BASE * intro + (1 - BASE) * scrollP;
  const idx = Math.max(6, Math.round(progress * N));
  const years = idx / 12;
  const live = 1 + tick.day / 100;
  const cur = value[idx] * (still ? 1 : live);
  const dep = deposits[idx];
  const gain = cur - dep;
  const inCrash = idx >= 92 && idx <= 128;

  // ציור הגרף
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const g = c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const maxV = Math.max(value[idx] * 1.12, 4000);
      const padT = 10, padB = 4;
      const X = (m) => (m / idx) * (w - 12); // גרפים פיננסיים נקראים משמאל לימין
      const Y = (v) => padT + (1 - v / maxV) * (h - padT - padB);

      // קווי רשת
      g.strokeStyle = 'rgba(216,243,230,.07)'; g.lineWidth = 1;
      for (let i = 1; i < 4; i++) { const y = padT + (i / 4) * (h - padT - padB); g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }

      const step = Math.max(1, Math.floor(idx / 180));
      // שטח מתחת לגרף
      const grad = g.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(74,222,128,.35)'); grad.addColorStop(1, 'rgba(74,222,128,0)');
      g.beginPath(); g.moveTo(X(0), h);
      for (let m = 0; m <= idx; m += step) g.lineTo(X(m), Y(value[m]));
      g.lineTo(X(idx), Y(value[idx] * (still ? 1 : live))); g.lineTo(X(idx), h); g.closePath();
      g.fillStyle = grad; g.fill();

      // קו ההפקדות
      g.setLineDash([4, 5]); g.strokeStyle = 'rgba(242,178,27,.75)'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(idx), Y(deposits[idx])); g.stroke(); g.setLineDash([]);

      // קו השווי
      g.strokeStyle = '#4ADE80'; g.lineWidth = 2.4; g.lineJoin = 'round';
      g.beginPath();
      for (let m = 0; m <= idx; m += step) m === 0 ? g.moveTo(X(m), Y(value[m])) : g.lineTo(X(m), Y(value[m]));
      const tipY = Y(value[idx] * (still ? 1 : live));
      g.lineTo(X(idx), tipY); g.stroke();

      // נקודה מהבהבת בקצה
      g.fillStyle = 'rgba(74,222,128,.25)'; g.beginPath(); g.arc(X(idx), tipY, 9, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#ECFDF5'; g.beginPath(); g.arc(X(idx), tipY, 3.6, 0, Math.PI * 2); g.fill();
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [idx, live, still, value, deposits]);

  const pct = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

  return (
    <div ref={wrap} className="relative rounded-[30px] bg-[#0A2419] text-cream p-5 sm:p-6 shadow-[0_30px_60px_-20px_rgba(15,81,50,.55)] overflow-hidden min-w-0 border border-white/5">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(74,222,128,.18),transparent_70%)]" aria-hidden="true" />
      <p className="sr-only">
        המחשה: תיק דמה שמשקיע 100 ₪ בחודש מגיל 14 בתשואה ממוצעת של 7% בשנה. ככל שגוללים בעמוד, הזמן מתקדם. אחרי 30 שנה ההפקדות הן 36,000 ₪ והשווי כ-{ils(value[N])}.
      </p>

      <div aria-hidden="true" className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[13px] text-leaf font-semibold">התיק של נועה · תיק דמה</span>
            <span className="block text-[12px] text-cream/55 mt-0.5">100 ₪ בחודש · התחילה בגיל {START_AGE}</span>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/8 border border-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider font-mono" dir="ltr">
            <span className="relative flex w-2 h-2">
              {!still && <span className="absolute inset-0 rounded-full bg-[#4ADE80] animate-ping opacity-70" />}
              <span className="relative w-2 h-2 rounded-full bg-[#4ADE80]" />
            </span>
            LIVE
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 flex-wrap">
          <div>
            <b className="block font-display font-extrabold text-[36px] sm:text-[42px] leading-none num" dir="ltr" style={{ textAlign: 'right' }}>{ils(cur)}</b>
            <span className="block text-[13px] text-cream/60 mt-1.5">גיל <b className="text-cream num">{START_AGE + Math.floor(years)}</b> · שנה <span className="num">{Math.floor(years)}</span> מתוך {YEARS}</span>
          </div>
          <span className={`rounded-lg px-2 py-1 text-[13px] font-bold font-mono num ${tick.day >= 0 ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-[#F87171]/15 text-[#F87171]'}`} dir="ltr">
            {tick.day >= 0 ? '▲' : '▼'} {pct(tick.day)} היום
          </span>
        </div>

        <div className="relative mt-4 h-[150px] sm:h-[180px]">
          <canvas ref={canvas} className="absolute inset-0 w-full h-full" />
          <span className={`absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#F87171]/15 text-[#FCA5A5] text-[11.5px] font-bold px-2 py-1 transition-opacity duration-500 ${inCrash ? 'opacity-100' : 'opacity-0'}`}>
            משבר בשוק · ממשיכים להפקיד
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-[11.5px] text-cream/60">
          <span className="flex items-center gap-1.5"><span className="w-4 h-[3px] rounded bg-[#4ADE80]" />שווי התיק</span>
          <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-gold" />מה שהופקד</span>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2">
          {[['הפקדות', ils(dep), 'text-cream'], ['רווח', ils(gain), 'text-[#4ADE80]'], ['פי', (cur / Math.max(dep, 1)).toFixed(2) + 'x', 'text-gold']].map(([k, v, cl]) => (
            <div key={k} className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5 min-w-0">
              <dt className="text-[11.5px] text-cream/55">{k}</dt>
              <dd className={`font-display font-bold text-[16px] sm:text-[18px] num truncate ${cl}`} dir="ltr" style={{ textAlign: 'right' }}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex h-2 rounded-full overflow-hidden gap-[2px]">
          {HOLDINGS.map((h) => <span key={h.name} style={{ width: h.w * 100 + '%', background: h.color }} />)}
        </div>
        <ul className="mt-3 flex flex-col">
          {HOLDINGS.slice(0, 3).map((h, i) => {
            const ch = tick.rows[i];
            return (
              <li key={h.name} className={`flex items-center gap-3 py-2 border-t border-white/5 transition-colors duration-700 ${tick.flash === i && !still ? (ch >= 0 ? 'bg-[#4ADE80]/[.06]' : 'bg-[#F87171]/[.06]') : ''}`}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: h.color }} />
                <span className="flex-1 min-w-0 truncate text-[14px] font-semibold">{h.name}</span>
                <span className="text-[12px] text-cream/50 num">{Math.round(h.w * 100)}%</span>
                <span className="w-[76px] text-left font-mono text-[13px] num" dir="ltr">{ils(cur * h.w)}</span>
                <span className={`w-[58px] text-left font-mono text-[12px] num ${ch >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`} dir="ltr">{pct(ch)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[11px] text-cream/40">נתונים להמחשה בלבד, לא ייעוץ השקעות. גללו למטה כדי לראות את התיק גדל.</p>
      </div>
    </div>
  );
}
