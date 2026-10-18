import { BRAND } from '../data.js';

const LINES = [
  ['שיעור ניסיון מלא', 'חינם'],
  ['10 מפגשים × 75 דקות', 'כלול'],
  ['מצגות עם גרפים חיים ונתוני אמת', 'כלול'],
  ['ליגת תיקי דמה לאורך הקורס', 'כלול'],
  ['משימות קצרות לבית', 'כלול'],
  ['תעודת סיום', 'כלול'],
];

export default function Pricing() {
  return (
    <section id="price" className="relative scroll-mt-20 bg-mint-2 overflow-hidden" aria-labelledby="price-h">
      <div className="absolute inset-0 dots opacity-70" aria-hidden="true" />
      <div className="gutter relative mx-auto max-w-6xl py-20 grid lg:grid-cols-[1fr_420px] gap-12 items-center">
        <div className="flex flex-col gap-6 min-w-0">
          <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>HOW IT WORKS · PRICE</span>
          <h2 id="price-h" className="font-display font-extrabold text-[36px] sm:text-[46px] leading-[1.06] text-forest">קודם מנסים. אחר כך מחליטים.</h2>
          <ol className="flex flex-col gap-0">
            {[
              ['נרשמים לשיעור ניסיון', 'ממלאים את הטופס בתחתית העמוד, ואנחנו חוזרים אליכם עם היום והשעה של הקבוצה הקרובה.'],
              ['מגיעים ומתנסים, בחינם', 'שיעור מלא של 75 דקות. בלי התחייבות ובלי לשלם כלום.'],
              ['ממשיכים לקורס המלא', `רק אם אהבתם. ${BRAND.sessions} מפגשים, ${BRAND.price.toLocaleString('en-US')} ₪ לכל הקורס.`],
              ['מסיימים עם תיק ותעודה', 'תיק השקעות דמה שבניתם לבד, הרגלי חיסכון לטווח ארוך ותעודת סיום.'],
            ].map(([t, d], i) => (
              <li key={t} className="relative grid grid-cols-[48px_1fr] gap-4 pb-6">
                {i < 3 && <span className="absolute top-12 bottom-0 right-[23px] w-[2px] bg-[repeating-linear-gradient(180deg,#0F5132_0_6px,transparent_6px_12px)] opacity-30" aria-hidden="true" />}
                <span className={`w-12 h-12 rounded-full grid place-items-center font-display font-extrabold text-lg ${i === 1 ? 'bg-ember text-white' : 'bg-forest text-cream'}`}>{i + 1}</span>
                <div className="pt-1.5">
                  <h3 className="font-display font-bold text-[20px] text-ink">{t}</h3>
                  <p className="text-[16px] text-ink/75 leading-relaxed mt-1">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="receipt bg-paper px-7 pt-10 pb-12 shadow-[0_30px_50px_-20px_rgba(15,81,50,.35)] rotate-[1.5deg]">
            <div className="text-center flex flex-col items-center gap-1">
              <b className="font-display text-2xl text-forest">צומחים</b>
              <span className="font-mono text-xs text-muted" dir="ltr">RECEIPT #0001 · 2026</span>
            </div>
            <div className="border-t-2 border-dashed border-sand my-5" />
            <ul className="flex flex-col gap-3 font-body">
              {LINES.map(([a, b], i) => (
                <li key={a} className="flex items-baseline gap-2 text-[15px]">
                  <span>{a}</span>
                  <span className="flex-1 border-b border-dotted border-muted/40 translate-y-[-3px]" aria-hidden="true" />
                  <b className={i === 0 ? 'text-ember' : 'text-forest'}>{b}</b>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-dashed border-sand my-5" />
            <div className="flex items-end justify-between">
              <span className="font-bold text-lg">סה״כ לקורס המלא</span>
              <b className="font-display font-extrabold text-[44px] leading-none text-forest num" dir="ltr">₪{BRAND.price.toLocaleString('en-US')}</b>
            </div>
            <p className="text-sm text-muted mt-2">כ-100 ₪ למפגש · משלמים רק אם ממשיכים אחרי שיעור הניסיון</p>
            <div className="barcode h-12 mt-6 opacity-80" aria-hidden="true" />
            <p className="font-mono text-[11px] text-center text-muted mt-2" dir="ltr">START EARLY · GROW BIG</p>
          </div>
          <span className="absolute -top-4 -left-3 rotate-[-12deg] rounded-xl bg-ember text-white font-display font-extrabold px-4 py-2 shadow-lg">השיעור הראשון עלינו</span>
        </div>
      </div>

      <div className="gutter relative mx-auto max-w-6xl pb-16">
        <div className="rounded-[28px] bg-forest text-cream p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between overflow-hidden relative">
          <svg className="absolute -left-10 -bottom-10 opacity-10" width="220" height="210" viewBox="4 4 92 88" aria-hidden="true"><rect x="14" y="62" width="18" height="24" rx="5" fill="#fff" /><rect x="40" y="46" width="18" height="40" rx="5" fill="#fff" /><rect x="66" y="30" width="18" height="56" rx="5" fill="#fff" /></svg>
          <div className="relative min-w-0">
            <span className="text-sm font-bold text-leaf">לבתי ספר, מתנ״סים ורכזי נוער</span>
            <h3 className="font-display font-extrabold text-[26px] sm:text-[30px] mt-1">רוצים קבוצה שלמה אצלכם?</h3>
            <p className="text-mint mt-2 max-w-2xl">אנחנו מגיעים עם הכל מוכן: תוכנית ל-10 מפגשים, מצגות, פלאייר וטופס הרשמה להורים. המפגש הראשון הוא התנסות בחינם לכל הקבוצה.</p>
          </div>
          <div className="relative flex flex-wrap gap-3 shrink-0">
            <a href="./course-plan.pdf" target="_blank" rel="noopener" className="rounded-full bg-cream text-forest font-bold px-5 py-3 hover:bg-white transition-colors">לתוכנית הקורס (PDF)</a>
            <a href={BRAND.whatsappQr} target="_blank" rel="noopener" className="rounded-full border-2 border-cream/40 text-cream font-bold px-5 py-3 hover:border-cream transition-colors">לדבר בוואטסאפ</a>
          </div>
        </div>
      </div>
    </section>
  );
}
