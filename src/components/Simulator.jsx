import { useMemo, useState } from 'react';
import { ils } from '../data.js';

const END = 65;
const MIN_AGE = 16;

function series(monthly, startAge, rate) {
  const r = rate / 100 / 12;
  const pts = [];
  let v = 0, dep = 0;
  for (let age = MIN_AGE; age <= END; age++) {
    if (age >= startAge) {
      for (let m = 0; m < 12; m++) { v = v * (1 + r) + monthly; dep += monthly; }
    }
    pts.push({ age, v, dep });
  }
  return pts;
}

function Slider({ id, label, value, min, max, step, onChange, format }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-baseline gap-3">
        <label htmlFor={id} className="font-bold text-[15px]">{label}</label>
        <output htmlFor={id} className="font-display font-extrabold text-[22px] text-forest num" dir="ltr">{format(value)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" dir="ltr" />
      <div className="flex justify-between text-xs text-muted num" dir="ltr"><span>{format(min)}</span><span>{format(max)}</span></div>
    </div>
  );
}

function Chart({ a, b, startAge, delay }) {
  const W = 640, H = 300, pl = 58, pr = 16, pt = 18, pb = 34;
  const max = Math.max(...a.map((p) => p.v), 1);
  const nice = (() => { const e = Math.pow(10, Math.floor(Math.log10(max))); const f = max / e; return (f <= 2 ? 2 : f <= 5 ? 5 : 10) * e; })();
  const x = (age) => pl + ((age - MIN_AGE) / (END - MIN_AGE)) * (W - pl - pr);
  const y = (v) => pt + (1 - v / nice) * (H - pt - pb);
  const path = (s, key) => s.map((p, i) => `${i ? 'L' : 'M'}${x(p.age).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(' ');
  const area = (s) => `${path(s, 'v')} L${x(END)} ${y(0)} L${x(MIN_AGE)} ${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((k) => k * nice);
  const fmt = (v) => (v >= 1e6 ? `${(v / 1e6).toFixed(v % 1e6 ? 1 : 0)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : `${v}`);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`גרף: שווי ההשקעה לפי גיל, התחלה בגיל ${startAge} מול התחלה בגיל ${startAge + delay}`} dir="ltr">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E8B5E" stopOpacity=".35" /><stop offset="1" stopColor="#2E8B5E" stopOpacity="0" /></linearGradient>
        <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF6B4A" stopOpacity=".28" /><stop offset="1" stopColor="#FF6B4A" stopOpacity="0" /></linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="#0F5132" strokeOpacity=".09" strokeDasharray="3 4" />
          <text x={pl - 10} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#6B6358" fontFamily="JetBrains Mono, monospace">₪{fmt(t)}</text>
        </g>
      ))}
      {[16, 20, 30, 40, 50, 65].map((g) => (
        <text key={g} x={x(g)} y={H - 10} textAnchor="middle" fontSize="12" fill="#6B6358" fontFamily="Heebo, sans-serif">{g}</text>
      ))}
      <path d={area(a)} fill="url(#ga)" />
      <path d={area(b)} fill="url(#gb)" />
      <path d={path(a, 'dep')} fill="none" stroke="#6B6358" strokeWidth="1.6" strokeDasharray="5 5" />
      <path d={path(a, 'v')} fill="none" stroke="#0F5132" strokeWidth="3.4" strokeLinejoin="round" />
      <path d={path(b, 'v')} fill="none" stroke="#FF6B4A" strokeWidth="3" strokeLinejoin="round" />
      <circle cx={x(END)} cy={y(a[a.length - 1].v)} r="6" fill="#0F5132" stroke="#fff" strokeWidth="3" />
      <circle cx={x(END)} cy={y(b[b.length - 1].v)} r="6" fill="#FF6B4A" stroke="#fff" strokeWidth="3" />
      <line x1={x(startAge)} x2={x(startAge)} y1={pt} y2={y(0)} stroke="#0F5132" strokeOpacity=".35" />
      <text x={x(startAge) + 6} y={pt + 12} fontSize="12" fill="#0F5132" fontWeight="700" fontFamily="Heebo, sans-serif">התחלה</text>
    </svg>
  );
}

const PRESETS = [
  { label: 'התחלה קטנה', monthly: 50 },
  { label: 'דמי כיס', monthly: 100 },
  { label: 'עבודת קיץ', monthly: 300 },
];

export default function Simulator() {
  const [monthly, setMonthly] = useState(200);
  const [startAge, setStartAge] = useState(17);
  const [rate, setRate] = useState(7);
  const delay = 10;
  const a = useMemo(() => series(monthly, startAge, rate), [monthly, startAge, rate]);
  const b = useMemo(() => series(monthly, Math.min(startAge + delay, END), rate), [monthly, startAge, rate]);
  const endA = a[a.length - 1], endB = b[b.length - 1];
  const gain = endA.v - endA.dep;
  return (
    <section id="simulator" className="relative bg-forest text-cream overflow-hidden scroll-mt-20" aria-labelledby="sim-h">
      <div className="absolute inset-0 opacity-[.07] grid-paper [filter:invert(1)]" aria-hidden="true" />
      <div className="gutter relative mx-auto max-w-6xl py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="font-mono text-sm text-leaf tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>TIME MACHINE · SIMULATOR</span>
          <h2 id="sim-h" className="font-display font-extrabold text-[36px] sm:text-[48px] leading-[1.06]">מכונת הזמן של הכסף</h2>
          <p className="text-[18px] leading-[1.7] text-mint">
            בחרו כמה להשקיע כל חודש ומאיזה גיל, וראו מה קורה עד גיל 65. הקו הכתום מראה את אותה השקעה בדיוק, רק שמתחילה 10 שנים מאוחר יותר.
          </p>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          <div className="rounded-[28px] bg-paper text-ink p-6 flex flex-col gap-7 min-w-0">
            <div className="flex flex-wrap gap-2" role="group" aria-label="דוגמאות מוכנות">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => setMonthly(p.monthly)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-bold border transition-colors ${monthly === p.monthly ? 'bg-forest text-cream border-forest' : 'border-sand bg-cream hover:border-forest/40'}`}>
                  {p.label} · <span className="num" dir="ltr">₪{p.monthly}</span>
                </button>
              ))}
            </div>
            <Slider id="s-monthly" label="השקעה חודשית" value={monthly} min={20} max={2000} step={10} onChange={setMonthly} format={(v) => `₪${v.toLocaleString('en-US')}`} />
            <Slider id="s-age" label="מתחילים בגיל" value={startAge} min={16} max={45} step={1} onChange={setStartAge} format={(v) => `${v}`} />
            <Slider id="s-rate" label="תשואה שנתית ממוצעת" value={rate} min={2} max={10} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
            <p className="text-xs text-muted leading-relaxed">המחשה חינוכית בלבד: ריבית מחושבת חודשית בתשואה קבועה, לפני מס, עמלות ואינפלציה. תשואות עבר אינן מבטיחות תשואות עתידיות ואין לראות בכך ייעוץ השקעות.</p>
          </div>

          <div className="flex flex-col gap-6 min-w-0">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-cream text-ink p-5">
                <span className="text-sm font-bold text-muted">בגיל 65 יהיו לכם</span>
                <b className="block font-display text-[34px] text-forest num leading-tight" dir="ltr" style={{ textAlign: 'right' }}>{ils(endA.v)}</b>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <span className="text-sm font-bold text-mint">מתוכם הפקדתם</span>
                <b className="block font-display text-[28px] num leading-tight" dir="ltr" style={{ textAlign: 'right' }}>{ils(endA.dep)}</b>
                <span className="text-sm text-leaf">והשאר, <b className="num" dir="ltr">{ils(gain)}</b>, הוא צמיחה</span>
              </div>
              <div className="rounded-2xl bg-ember text-white p-5">
                <span className="text-sm font-bold">מחיר ההמתנה של 10 שנים</span>
                <b className="block font-display text-[28px] num leading-tight" dir="ltr" style={{ textAlign: 'right' }}>−{ils(endA.v - endB.v)}</b>
                <span className="text-sm">אם מתחילים בגיל {Math.min(startAge + delay, END)}</span>
              </div>
            </div>
            <div className="rounded-[28px] bg-paper p-4 sm:p-6">
              <Chart a={a} b={b} startAge={startAge} delay={delay} />
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink mt-2 px-2">
                <span className="flex items-center gap-2"><i className="w-5 h-1 rounded bg-forest inline-block" />מתחילים בגיל {startAge}</span>
                <span className="flex items-center gap-2"><i className="w-5 h-1 rounded bg-coral inline-block" />מתחילים בגיל {Math.min(startAge + delay, END)}</span>
                <span className="flex items-center gap-2"><i className="w-5 h-0 border-t-2 border-dashed border-muted inline-block" />סך ההפקדות</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
