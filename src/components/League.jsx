const ROWS = [
  { name: 'קרן הצמיחה', mix: 'S&P 500 · אג״ח', r: 9.8, d: [3, 4, 4, 6, 5, 7, 8, 9], up: 2 },
  { name: 'השוורים מהגולן', mix: 'נאסד״ק · ת״א 125', r: 8.1, d: [2, 5, 3, 6, 7, 6, 8, 8], up: 0 },
  { name: 'דיבידנד קבוע', mix: 'קרנות דיבידנד · אג״ח', r: 6.4, d: [3, 3, 4, 4, 5, 5, 6, 6], up: 1 },
  { name: 'הדובים העליזים', mix: 'מניות בודדות', r: 2.7, d: [6, 8, 5, 7, 3, 4, 2, 3], up: -2 },
  { name: 'מזומן זה מלך', mix: 'פיקדון', r: 1.1, d: [1, 1, 1, 1, 1, 1, 1, 1], up: -1 },
];

function Spark({ d, color }) {
  const max = 10, w = 84, h = 28;
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" dir="ltr">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function League() {
  return (
    <section className="gutter mx-auto max-w-6xl py-20 grid lg:grid-cols-[1fr_1.15fr] gap-12 items-center" aria-labelledby="league-h">
      <div className="flex flex-col gap-5 min-w-0">
        <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>PAPER-TRADING LEAGUE</span>
        <h2 id="league-h" className="font-display font-extrabold text-[36px] sm:text-[46px] leading-[1.06] text-forest">ליגת צומחים: לומדים על תיק אמיתי, בלי שקל אמיתי</h2>
        <p className="text-[18px] leading-[1.75] text-ink/85">
          כל משתתף בונה תיק השקעות דמה ומנהל אותו לאורך כל הקורס. כך כל מושג שלומדים בכיתה, מפיזור ועד פקודת Stop, הופך להחלטה שרואים את התוצאה שלה.
        </p>
        <ul className="flex flex-col gap-3 text-[16px]">
          {['בונים תיק לפי מה שלמדנו, ומסבירים למה', 'רואים איך התיקים מגיבים לחדשות ולמשברים', 'בלי כסף אמיתי, בלי חשבון ובלי סיכון'].map((t) => (
            <li key={t} className="flex gap-3 items-start">
              <svg className="shrink-0 mt-1" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0F5132" /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <figure className="relative min-w-0">
        <div className="rounded-[28px] bg-[#13182A] text-white p-5 sm:p-7 shadow-[0_30px_60px_-24px_rgba(19,24,42,.55)] overflow-hidden">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#2A2650] grid place-items-center" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2B21B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg>
              </span>
              <div className="leading-tight">
                <b className="block">טבלת הליגה</b>
                <span className="text-xs text-white/55">שבוע 6 מתוך 10</span>
              </div>
            </div>
            <span className="text-[11px] font-bold rounded-full bg-white/10 px-3 py-1 text-white/80">דוגמה להמחשה</span>
          </div>
          <ol className="flex flex-col">
            {ROWS.map((r, i) => (
              <li key={r.name} className={`grid grid-cols-[28px_1fr_auto_auto] sm:grid-cols-[28px_1fr_90px_70px] items-center gap-3 py-3.5 ${i < ROWS.length - 1 ? 'border-b border-white/[.07]' : ''}`}>
                <span className={`font-display font-extrabold text-lg num ${i === 0 ? 'text-gold' : 'text-white/45'}`}>{i + 1}</span>
                <span className="min-w-0">
                  <b className="block truncate text-[15px]">{r.name}</b>
                  <span className="block truncate text-xs text-white/50">{r.mix}</span>
                </span>
                <span className="hidden sm:block"><Spark d={r.d} color={r.r > 5 ? '#34D399' : r.r > 2 ? '#F2B21B' : '#9CA3AF'} /></span>
                <span className="text-left">
                  <b className={`font-mono text-[15px] num ${r.r > 5 ? 'text-[#34D399]' : 'text-white/80'}`} dir="ltr">+{r.r.toFixed(1)}%</b>
                  <span className={`block text-[11px] num ${r.up > 0 ? 'text-[#34D399]' : r.up < 0 ? 'text-coral-2' : 'text-white/40'}`} dir="ltr">{r.up > 0 ? `▲${r.up}` : r.up < 0 ? `▼${-r.up}` : '–'}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <figcaption className="relative -mt-4 mr-6 w-fit rounded-2xl bg-ember text-white px-4 py-3 shadow-lg max-w-[280px] text-sm leading-snug">
          <b>השיעור מהטבלה:</b> התיקים המפוזרים מובילים, וההימורים על מניה אחת קופצים למעלה ולמטה.
        </figcaption>
      </figure>
    </section>
  );
}
