import { useEffect, useRef, useState } from 'react';
import { LESSONS } from '../data.js';

export default function Path() {
  const wrap = useRef(null);
  const [p, setP] = useState(0.15);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const f = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const k = (vh * 0.7 - r.top) / r.height;
      setP(Math.min(1, Math.max(0.15, k)));
    };
    f();
    window.addEventListener('scroll', f, { passive: true });
    window.addEventListener('resize', f);
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f); };
  }, []);

  return (
    <section id="path" className="relative scroll-mt-20 py-20" aria-labelledby="path-h">
      <div className="gutter mx-auto max-w-6xl flex flex-col gap-4 mb-12">
        <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>THE PATH · 10 × 75 MIN</span>
        <h2 id="path-h" className="font-display font-extrabold text-[36px] sm:text-[48px] leading-[1.06] text-forest">המסלול: עשרה מפגשים, נבט אחד שגדל</h2>
        <p className="text-[18px] leading-[1.7] text-ink/85 max-w-3xl">
          כל מפגש מוסיף עלה. בשמונת הראשונים בונים את הבסיס של משקיע לטווח ארוך, ובשניים האחרונים לומדים לקרוא גרף כמו סוחר. לאורך כל הדרך כל משתתף מנהל תיק דמה בליגת צומחים.
        </p>
      </div>

      <div ref={wrap} className="gutter relative mx-auto max-w-5xl">
        {/* the stem */}
        <div className="absolute top-0 bottom-0 right-[34px] md:right-1/2 md:translate-x-1/2 w-[6px] rounded-full bg-sand" aria-hidden="true">
          <div className="absolute top-0 inset-x-0 rounded-full bg-gradient-to-b from-forest-2 via-forest to-coral" style={{ height: `${p * 100}%`, transition: 'height .25s linear' }} />
        </div>

        <ol className="relative flex flex-col gap-8 md:gap-2">
          {LESSONS.map((l, i) => {
            const left = i % 2 === 1;
            const lit = (i + 0.5) / LESSONS.length <= p + 0.02;
            const tech = l.n >= 9;
            return (
              <li key={l.n} className={`relative grid md:grid-cols-2 md:gap-16 items-center ${i === 8 ? 'md:mt-10' : ''}`}>
                {i === 8 && (
                  <span className="absolute -top-9 right-[60px] md:right-1/2 md:translate-x-1/2 rounded-full bg-ember text-white text-xs font-bold px-3 py-1 whitespace-nowrap">שלב ב׳ · ניתוח טכני</span>
                )}
                {/* node */}
                <span className={`absolute top-3 md:top-1/2 md:-translate-y-1/2 right-[18px] md:right-1/2 md:translate-x-1/2 w-[38px] h-[38px] rounded-full grid place-items-center font-display font-extrabold text-[15px] num z-10 transition-all duration-500 ${lit ? (tech ? 'bg-ember text-white' : 'bg-forest text-cream') + ' scale-100' : 'bg-paper text-muted border-2 border-sand scale-90'}`} aria-hidden="true">
                  {l.n}
                </span>
                {/* leaf */}
                <svg className={`hidden md:block absolute top-1/2 -translate-y-1/2 transition-all duration-700 ${left ? 'left-[calc(50%+24px)]' : 'right-[calc(50%+24px)] -scale-x-100'} ${lit ? 'opacity-100' : 'opacity-30'}`} width="46" height="26" viewBox="0 0 46 26" aria-hidden="true">
                  <path d="M2 13 Q23 -6 44 13 Q23 32 2 13Z" fill={tech ? '#FFB49E' : (i % 3 === 2 ? '#7BC4A2' : '#2E8B5E')} />
                  <path d="M4 13 H40" stroke="#fff" strokeOpacity=".6" strokeWidth="1.5" />
                </svg>
                <div className={`pr-[72px] md:pr-0 ${left ? 'md:col-start-2 md:pr-10' : 'md:col-start-1 md:pl-10'} min-w-0 py-3 md:py-6`}>
                  <span className={`text-xs font-bold tracking-wide ${tech ? 'text-ember' : 'text-forest'}`}>מפגש {l.n} · {l.topic}</span>
                  <h3 className="font-display font-extrabold text-[23px] sm:text-[26px] leading-tight text-ink mt-1">{l.hook}</h3>
                  <p className="text-[15.5px] leading-[1.7] text-ink/80 mt-2">{l.text}</p>
                  <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="מושגים">
                    {l.tags.map((t) => (
                      <li key={t} className={`text-[12.5px] font-semibold rounded-full px-2.5 py-1 ${tech ? 'bg-[#FFE8E0] text-[#B8452A]' : 'bg-mint text-forest'}`}>{t}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="relative flex md:justify-center pr-[4px] md:pr-0 mt-6" aria-hidden="true">
          <svg width="70" height="64" viewBox="0 0 70 64">
            <path d="M35 64 V30" stroke="#0F5132" strokeWidth="5" strokeLinecap="round" />
            <path d="M35 32 Q35 14 50 4" stroke="#2E8B5E" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path transform="translate(48 6) rotate(-40)" d="M0 0 Q11 -10 22 0 Q11 10 0 0Z" fill="#2E8B5E" />
            <path transform="translate(42 18) rotate(200)" d="M0 0 Q9 -8 18 0 Q9 8 0 0Z" fill="#7BC4A2" />
          </svg>
        </div>
        <p className="text-center font-display font-extrabold text-forest text-[22px] mt-2">ובסוף: תיק השקעות דמה שבניתם לבד, ותעודת סיום.</p>
      </div>
    </section>
  );
}
