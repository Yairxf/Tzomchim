import { useEffect, useRef, useState } from 'react';
import { ils } from '../data.js';

const fv = (p, r, y) => p * Math.pow(1 + r, y);
const A = fv(1000, 0.07, 50); // starts at 15
const B = fv(1000, 0.07, 30); // starts at 35

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function Plant({ value, max, label, sub, accent, grown }) {
  const H = 260;
  const h = Math.max(30, (value / max) * H);
  const leaves = Math.max(1, Math.round((value / max) * 7));
  return (
    <figure className="flex flex-col items-center gap-3 min-w-0">
      <div className="relative w-[150px]" style={{ height: H + 70 }}>
        <svg viewBox={`0 0 150 ${H + 70}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
          <g style={{ transformOrigin: `75px ${H + 18}px`, transform: grown ? 'scaleY(1)' : 'scaleY(0.35)', transition: 'transform 1.6s cubic-bezier(.2,.8,.2,1)' }}>
            <path d={`M75 ${H + 18} C 70 ${H + 18 - h * 0.4}, 82 ${H + 18 - h * 0.7}, 75 ${H + 18 - h}`} stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" />
            {Array.from({ length: leaves }).map((_, i) => {
              const y = H + 18 - (h * (i + 1)) / (leaves + 1);
              const left = i % 2 === 0;
              return <path key={i} transform={`translate(${left ? 74 : 76} ${y}) rotate(${left ? 200 : -20})`} d="M0 0 Q12 -11 24 0 Q12 11 0 0Z" fill={i % 3 === 2 ? '#7BC4A2' : accent} />;
            })}
            <circle cx="75" cy={H + 18 - h} r="7" fill="#FF6B4A" stroke="#fff" strokeWidth="3" />
          </g>
          <path d={`M40 ${H + 18} h70 l-8 46 h-54z`} fill="#E9D8C2" />
          <rect x="34" y={H + 12} width="82" height="12" rx="4" fill="#D8C3A6" />
        </svg>
      </div>
      <figcaption className="text-center">
        <b className="block font-display text-[30px] text-forest num" dir="ltr">{ils(value)}</b>
        <span className="block font-bold">{label}</span>
        <span className="block text-sm text-muted">{sub}</span>
      </figcaption>
    </figure>
  );
}

export default function Twins() {
  const [ref, seen] = useInView();
  return (
    <section ref={ref} className="gutter mx-auto max-w-6xl py-20 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center" aria-labelledby="twins-h">
      <div className="flex flex-col gap-5 min-w-0">
        <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>LESSON 01 · COMPOUND</span>
        <h2 id="twins-h" className="font-display font-extrabold text-[36px] sm:text-[46px] leading-[1.08] text-forest">
          שני תאומים. אותו סכום.<br /><span className="text-ember">20 שנה הבדל.</span>
        </h2>
        <p className="text-[18px] leading-[1.75] text-ink/85">
          נועה ואורי קיבלו כל אחד 1,000 ₪. נועה השקיעה אותם בגיל 15. אורי חיכה עד גיל 35, כי "יש זמן". שניהם לא הוסיפו שקל, ושניהם הגיעו לגיל 65 עם אותה תשואה שנתית.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink/85">
          לנועה יש כמעט <b className="text-forest">פי 4</b> יותר כסף. ההבדל היחיד ביניהם הוא הזמן, וזה בדיוק הנכס שיש לבני נוער ואין להורים שלהם. זה השיעור הראשון בצומחים.
        </p>
        <p className="text-xs text-muted">חישוב להמחשה: תשואה שנתית קבועה של 7%, לפני מס ועמלות. תשואות בשוק משתנות ואינן מובטחות. הדמויות בדויות.</p>
      </div>
      <div className="relative rounded-[32px] bg-paper border border-sand p-6 sm:p-10 overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-60" aria-hidden="true" />
        <div className="relative flex justify-around gap-4 items-end">
          <Plant value={A} max={A} label="נועה · מתחילה בגיל 15" sub="50 שנה בשוק" accent="#0F5132" grown={seen} />
          <Plant value={B} max={A} label="אורי · מתחיל בגיל 35" sub="30 שנה בשוק" accent="#2E8B5E" grown={seen} />
        </div>
      </div>
    </section>
  );
}
