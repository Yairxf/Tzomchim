import { useState } from 'react';
import { FAQ, BRAND, waLink } from '../data.js';

const TEAM = [
  { id: 0, letter: 'י', name: 'יאיר', age: 19, bg: 'bg-forest', role: 'מייסד ומדריך',
    text: 'משקיע בשוק ההון כבר יותר מ-4 שנים, גם לטווח ארוך וגם במסחר. בונה את תוכנית הקורס ואת המצגות, ומלמד את החלק של ניתוח טכני וקריאת גרפים.' },
  { id: 1, letter: 'א', name: 'אריה', age: 17, bg: 'bg-ember', role: 'מייסד ומדריך',
    text: 'בשוק ההון כבר כמה שנים, ובדיוק בגיל של המשתתפים. יודע מה מבלבל כשמתחילים, ואיך להסביר את זה בלי ז׳רגון ובלי נוסחאות מפחידות.' },
];

const VALUES = [
  ['בגובה העיניים', 'קרובים בגיל למשתתפים, בלי ז׳רגון ובלי הרצאות משעממות.'],
  ['למתחילים ולמתקדמים', 'מתחילים מהבסיס ומגיעים עד ניתוח טכני, ווליום ופקודות.'],
  ['חינוך, לא ייעוץ', 'לא ממליצים על ניירות ערך. מלמדים להבין, לשאול ולהחליט לבד.'],
];

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg>
);

export default function About() {
  const [open, setOpen] = useState(0);
  const consultMsg = 'היי, אשמח לשיחת התייעצות קצרה לגבי הקורס של צומחים';
  return (
    <>
      <section id="about" className="gutter mx-auto max-w-6xl py-20 scroll-mt-20" aria-labelledby="about-h">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div className="flex flex-col gap-5 min-w-0">
            <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>ABOUT · WHO WE ARE</span>
            <h2 id="about-h" className="font-display font-extrabold text-[36px] sm:text-[46px] leading-[1.06] text-forest">צעירים. מנוסים. בגובה העיניים.</h2>
            <p className="text-[18px] leading-[1.75] text-ink/85">
              יאיר ואריה הקימו את צומחים כדי ללמד את מה שלא מלמדים בבית הספר על כסף ועל שוק ההון. אנחנו משקיעים כבר שנים, עשינו בעצמנו את הטעויות שכולם עושים בהתחלה, ובנינו קורס שמתאים גם למי שמתחיל מאפס וגם למי שכבר משקיע ורוצה לעשות סדר.
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

          <ul className="grid sm:grid-cols-2 gap-4 min-w-0">
            {TEAM.map((m) => {
              const ph = BRAND.phones[m.id];
              return (
                <li key={m.name} className="rounded-[26px] bg-paper border border-sand p-5 flex flex-col gap-4 shadow-[0_14px_30px_-18px_rgba(15,81,50,.35)]">
                  <div className="flex items-center gap-3">
                    <span className={`w-14 h-14 rounded-2xl ${m.bg} text-cream grid place-items-center font-display font-extrabold text-[26px]`} aria-hidden="true">{m.letter}</span>
                    <div className="leading-tight">
                      <h3 className="font-display font-extrabold text-[22px] text-forest">{m.name}, {m.age}</h3>
                      <span className="text-sm text-muted font-semibold">{m.role}</span>
                    </div>
                  </div>
                  <p className="text-[15.5px] leading-relaxed text-ink/85 flex-1">{m.text}</p>
                  <div className="flex flex-col gap-2 pt-3 border-t border-sand">
                    <a href={waLink(ph.intl, consultMsg)} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E7A4C] text-white px-4 py-2.5 font-bold text-[15px] hover:bg-forest transition-colors">
                      <WaIcon />וואטסאפ ל{m.name}
                    </a>
                    <a href={`tel:+${ph.intl}`} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-forest/20 text-forest px-4 py-2 font-bold text-[15px] hover:border-forest transition-colors">
                      <span>חיוג:</span><span className="num" dir="ltr">{ph.display}</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 relative overflow-hidden rounded-[30px] bg-forest text-cream p-6 sm:p-8 grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
          <div className="absolute -left-16 -bottom-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(123,196,162,.25),transparent_70%)]" aria-hidden="true" />
          <div className="relative flex flex-col gap-3 min-w-0">
            <span className="self-start rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-mint">שיחת התייעצות · בחינם</span>
            <h3 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-tight">לא בטוחים אם הקורס מתאים? בואו נדבר.</h3>
            <p className="text-[16px] leading-relaxed text-mint">שיחה קצרה בטלפון או בוואטסאפ, להורים או למשתתפים: מבינים איפה אתם עומדים, מתחילים או מתקדמים, ומתאימים קבוצה ומועד. לבתי ספר ומתנ״סים נשמח לתאם מפגש התנסות.</p>
            <p className="text-[13px] text-mint/75">השיחה היא על הקורס והלמידה, לא ייעוץ השקעות אישי.</p>
          </div>
          <div className="relative flex flex-col gap-2.5">
            {BRAND.phones.map((ph) => (
              <a key={ph.intl} href={waLink(ph.intl, consultMsg)} target="_blank" rel="noopener" className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-3 transition-colors">
                <span className="flex items-center gap-2 font-bold"><WaIcon />{ph.name}</span>
                <span className="font-mono num" dir="ltr">{ph.display}</span>
              </a>
            ))}
            <a href={`mailto:${BRAND.email}?subject=${encodeURIComponent('התייעצות לגבי הקורס של צומחים')}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-3 transition-colors">
              <span className="font-bold">מייל</span>
              <span className="font-mono text-[14px] break-all" dir="ltr">{BRAND.email}</span>
            </a>
          </div>
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
