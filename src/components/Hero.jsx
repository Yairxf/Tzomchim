import Market from './Market.jsx';
import { BRAND, TICKER } from '../data.js';

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative overflow-hidden border-y border-forest/15 bg-forest text-cream" aria-label="מושגים שלומדים בקורס">
      <div className="marquee flex w-max gap-0 py-3" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-3 px-6 font-mono text-[14px] tracking-wide whitespace-nowrap">
            <span className="text-leaf">▲</span>
            <span className="font-body font-semibold">{t}</span>
          </span>
        ))}
      </div>
      <p className="sr-only">ריבית דריבית, DCA, מדדים, קרנות סל, אג״ח, דיבידנד, ניתוח טכני ועוד.</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[520px] dots [mask-image:linear-gradient(180deg,#000_30%,transparent)]" aria-hidden="true" />
      <div className="gutter relative mx-auto max-w-6xl grid lg:grid-cols-[1.05fr_1fr] gap-8 items-center pt-6 pb-10 lg:pt-10">
        <div className="flex flex-col gap-6 min-w-0">
          <span className="self-start inline-flex items-center gap-2 rounded-full bg-paper border border-sand px-4 py-1.5 text-sm font-bold text-forest">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-60" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            </span>
            ההרשמה פתוחה · קורס שוק ההון לבני {BRAND.ages}
          </span>
          <h1 className="font-display font-extrabold leading-[1.02] text-[42px] sm:text-[56px] lg:text-[64px] text-forest">
            תגרמו לכסף שלכם
            <br />
            <span className="relative inline-block text-ember">
              לעבוד במקומכם.
              <svg className="absolute -bottom-3 right-0 w-full" height="16" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 11 Q150 0 296 8" stroke="#FF6B4A" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".45" />
              </svg>
            </span>
          </h1>
          <p className="text-[18px] sm:text-[19px] leading-[1.7] text-ink/85 max-w-[34em]">
            קורס שוק ההון למתחילים ולמתקדמים: מהבסיס של ריבית דריבית, קרנות סל ואג״ח, דרך דוחות ומאקרו,
            ועד קריאת גרף, ווליום ופקודות כמו סוחר. עם גרפים חיים, נתוני אמת ותיק דמה, בלי כסף אמיתי ובלי סיכון.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#register" className="inline-flex items-center gap-2 rounded-full bg-ember text-white px-7 py-3.5 text-[17px] font-bold shadow-[0_10px_24px_rgba(255,107,74,.35)] hover:bg-[#B23A23] transition">
              לשריון שיעור ניסיון חינם
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </a>
            <a href="#simulator" className="inline-flex items-center gap-2 rounded-full bg-paper border-2 border-forest/20 text-forest px-6 py-3.5 text-[17px] font-bold hover:border-forest transition-colors">
              לנסות את הסימולטור
            </a>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 pt-2 border-t border-sand">
            {[[BRAND.sessions, 'מפגשים'], [BRAND.minutes, 'דקות כל מפגש'], ['0 ₪', 'שיעור ראשון'], ['4+', 'שנות ניסיון למדריכים']].map(([a, b]) => (
              <div key={b} className="pt-3">
                <dt className="sr-only">{b}</dt>
                <dd className="font-display font-extrabold text-[28px] text-forest num leading-none" dir="ltr" style={{ textAlign: 'right' }}>{a}</dd>
                <dd className="text-sm text-muted font-semibold mt-1">{b}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative min-w-0">
          <Market />
          <a href="#register" className="absolute -top-5 -left-3 sm:-left-6 w-[108px] h-[108px] rounded-full bg-[radial-gradient(circle_at_40%_35%,#E8603F,#C8432A)] text-white grid place-items-center text-center rotate-[-14deg] shadow-[0_0_0_4px_#fff,0_0_0_7px_#0F5132,0_14px_28px_rgba(255,107,74,.35)] hover:rotate-[-4deg] transition-transform" aria-label="שיעור ראשון חינם – להרשמה">
            <span className="leading-tight">
              <span className="block text-[12px] font-bold">שיעור ראשון</span>
              <span className="block font-display font-extrabold text-[30px]">חינם!</span>
              <span className="block text-[10.5px]">בלי התחייבות</span>
            </span>
          </a>
        </div>
      </div>
      <Ticker />
    </section>
  );
}
