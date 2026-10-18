import { useState } from 'react';
import { FAQ } from '../data.js';

const VALUES = [
  ['בשפה של בני נוער', 'קרובים בגיל לתלמידים, בלי ז׳רגון ובלי נוסחאות מפחידות.'],
  ['חינוך, לא ייעוץ', 'לא ממליצים על ניירות ערך. מלמדים להבין ולזהות הונאות.'],
  ['בלי כסף אמיתי', 'כל התרגול בתיק דמה, בלי חשבון ובלי סיכון.'],
];

export default function About() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section id="about" className="gutter mx-auto max-w-6xl py-20 scroll-mt-20" aria-labelledby="about-h">
        <div className="flex flex-col gap-5 min-w-0 max-w-4xl">
          <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>ABOUT · WHO WE ARE</span>
          <h2 id="about-h" className="font-display font-extrabold text-[36px] sm:text-[46px] leading-[1.06] text-forest">צעירים. מנוסים. בדיוק כמוכם.</h2>
          <p className="text-[18px] leading-[1.75] text-ink/85">
            יאיר ואריה הקימו את צומחים כדי ללמד בני נוער את מה שלא מלמדים בבית הספר על כסף. אנחנו משקיעים בשוק ההון כבר יותר מ-4 שנים, ובגלל שאנחנו קרובים בגיל לתלמידים, אנחנו מדברים איתם בשפה שלהם.
          </p>
          <dl className="grid sm:grid-cols-3 gap-4 pt-2">
            {VALUES.map(([t, d]) => (
              <div key={t} className="border-t-2 border-forest pt-3">
                <dt className="font-display font-bold text-[17px] text-forest">{t}</dt>
                <dd className="text-[14.5px] text-ink/75 mt-1 leading-relaxed">{d}</dd>
              </div>
            ))}
          </dl>
        </div>

      </section>

      <section id="faq" className="gutter mx-auto max-w-4xl pb-20 scroll-mt-20" aria-labelledby="faq-h">
        <h2 id="faq-h" className="font-display font-extrabold text-[34px] sm:text-[42px] text-forest mb-6">שאלות של הורים</h2>
        <div className="flex flex-col">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-sand">
                <h3>
                  <button type="button" id={`faq-b-${i}`} aria-expanded={isOpen} aria-controls={`faq-p-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-right font-display font-bold text-[19px] text-ink hover:text-forest">
                    {f.q}
                    <span className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-transform ${isOpen ? 'bg-forest text-cream rotate-45' : 'bg-mint text-forest'}`} aria-hidden="true">+</span>
                  </button>
                </h3>
                <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} hidden={!isOpen} className="pb-5 text-[16.5px] leading-[1.75] text-ink/80 max-w-3xl">{f.a}</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
