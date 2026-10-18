import { useState } from 'react';
import { BRAND, waLink } from '../data.js';

const GRADES = ['י׳', 'י״א', 'י״ב', 'סיימתי תיכון'];
const SOURCES = ['וואטסאפ', 'פלאייר', 'בית הספר / מתנ״ס', 'חבר/ה', 'אינסטגרם', 'אחר'];
const empty = { parentName: '', phone: '', email: '', childName: '', grade: '', place: '', source: '', notes: '', terms: false, contact: false, photos: false, marketing: false, company: '' };

const phoneOk = (p) => /^0(5\d|[2-489]|7\d)-?\d{3}-?\d{4}$|^\+?972-?5\d-?\d{3}-?\d{4}$/.test(p.replace(/\s/g, ''));

function Field({ id, label, required, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={id} className="font-bold text-[15px]">{label}{required && <span className="text-ember" aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <span id={`${id}-hint`} className="text-xs text-muted">{hint}</span>}
      {error && <span id={`${id}-err`} className="text-sm font-semibold text-[#B8452A]" role="alert">{error}</span>}
    </div>
  );
}

const inputCls = 'w-full rounded-2xl border-2 border-sand bg-paper px-4 py-3 text-[16px] outline-none focus:border-forest transition-colors';

export default function Register() {
  const [f, setF] = useState(empty);
  const [err, setErr] = useState({});
  const [state, setState] = useState('idle'); // idle | done
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const summary = () => [
    'הרשמה לשיעור ניסיון – צומחים',
    `איש קשר: ${f.parentName}`, `טלפון: ${f.phone}`, f.email && `מייל: ${f.email}`,
    `משתתף/ת: ${f.childName} · ${f.grade}`, `יישוב / בית ספר: ${f.place}`,
    f.source && `איך שמעו עלינו: ${f.source}`, f.notes && `הערות: ${f.notes}`,
    `אישור צילום: ${f.photos ? 'כן' : 'לא'}`,
  ].filter(Boolean).join('\n');

  const validate = () => {
    const e = {};
    if (f.parentName.trim().length < 2) e.parentName = 'נא למלא שם מלא.';
    if (!phoneOk(f.phone)) e.phone = 'נא למלא מספר טלפון ישראלי, למשל 050-1234567.';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'כתובת המייל לא תקינה.';
    if (f.childName.trim().length < 2) e.childName = 'נא למלא את שם המשתתף/ת.';
    if (!f.grade) e.grade = 'נא לבחור כיתה.';
    if (f.place.trim().length < 2) e.place = 'נא למלא יישוב או בית ספר.';
    if (!f.terms) e.terms = 'כדי להירשם יש לאשר את התקנון ומדיניות הפרטיות.';
    if (!f.contact) e.contact = 'נא לאשר שניצור קשר לגבי הקורס.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErr(e);
    if (Object.keys(e).length) {
      const first = document.getElementById(`r-${Object.keys(e)[0]}`);
      if (first) first.focus();
      return;
    }
    if (f.company) { setState('done'); return; } // honeypot
    // ההרשמה נשלחת מהוואטסאפ של הנרשם אלינו, עם כל הפרטים כבר כתובים. בלי שרת ובלי API.
    const url = waLink(BRAND.phones[0].intl, summary());
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else window.location.href = url; // דפדפן שחסם חלון חדש
    setState('done');
  };

  const desc = (k) => (err[k] ? `r-${k}-err` : undefined);

  return (
    <section id="register" className="relative scroll-mt-20 overflow-hidden" aria-labelledby="reg-h">
      <div className="gutter mx-auto max-w-6xl py-20 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <div className="flex flex-col gap-5 lg:sticky lg:top-28 min-w-0">
          <span className="font-mono text-sm text-ember tracking-widest" dir="ltr" style={{ textAlign: 'right' }}>FREE TRIAL · SIGN UP</span>
          <h2 id="reg-h" className="font-display font-extrabold text-[38px] sm:text-[50px] leading-[1.04] text-forest">שומרים מקום<br />בשיעור הניסיון</h2>
          <p className="text-[18px] leading-[1.7] text-ink/85">ממלאים פרטים, ואנחנו חוזרים אליכם בוואטסאפ או בטלפון עם היום, השעה והמקום של הקבוצה הקרובה. השיעור הראשון בחינם ובלי התחייבות.</p>
          <div className="rounded-2xl bg-mint p-5 flex flex-col gap-2">
            <span className="text-sm font-bold text-forest">מעדיפים לדבר?</span>
            {BRAND.phones.map((p) => (
              <a key={p.intl} href={waLink(p.intl)} target="_blank" rel="noopener" className="flex items-center gap-3 font-display font-bold text-[20px] text-forest">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366" /><path d="M12 5.2a6.8 6.8 0 0 0-5.9 10.2L5.2 18.8l3.5-.9A6.8 6.8 0 1 0 12 5.2z" fill="none" stroke="#fff" strokeWidth="1.5" /></svg>
                {p.name} · <span className="num select-all" dir="ltr">{p.display}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-paper border border-sand p-5 sm:p-8 shadow-[0_24px_50px_-28px_rgba(15,81,50,.4)] min-w-0">
          {state === 'done' ? (
            <div className="flex flex-col items-center text-center gap-4 py-10" role="status">
              <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#0F5132" /><path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <h3 className="font-display font-extrabold text-[28px] text-forest">כמעט סיימנו!</h3>
              <p className="text-[17px] text-ink/80 max-w-md">פתחנו לכם וואטסאפ עם כל הפרטים. נשאר רק <b>ללחוץ על שליחה</b>, ונחזור אליכם עם היום, השעה והמקום של שיעור הניסיון.</p>
              <a href={waLink(BRAND.phones[0].intl, summary())} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#1E7A4C] text-white font-bold px-6 py-3 hover:bg-forest transition-colors">הוואטסאפ לא נפתח? לחצו כאן</a>
              <span className="text-sm text-muted">או התקשרו: <span className="num select-all" dir="ltr">{BRAND.phones[0].display}</span></span>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-describedby="req-note">
              <p id="req-note" className="text-sm text-muted">שדות המסומנים ב-<span className="text-ember">*</span> הם חובה. מתחת לגיל 18 את הטופס ממלא/ת הורה או אפוטרופוס. מעל 18 אפשר למלא לבד, עם אותם פרטים בשני החלקים.</p>
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-forest text-lg mb-2">פרטי ההורה / איש הקשר</legend>
                <Field id="r-parentName" label="שם מלא" required error={err.parentName}>
                  <input id="r-parentName" className={inputCls} value={f.parentName} onChange={set('parentName')} autoComplete="name" aria-invalid={!!err.parentName} aria-describedby={desc('parentName')} />
                </Field>
                <Field id="r-phone" label="טלפון נייד" required error={err.phone}>
                  <input id="r-phone" className={inputCls} value={f.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" style={{ textAlign: 'right' }} aria-invalid={!!err.phone} aria-describedby={desc('phone')} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="r-email" label="אימייל" error={err.email} hint="לא חובה. נשלח אליו אישור הרשמה.">
                    <input id="r-email" className={inputCls} value={f.email} onChange={set('email')} type="email" autoComplete="email" dir="ltr" style={{ textAlign: 'right' }} aria-invalid={!!err.email} aria-describedby={err.email ? 'r-email-err' : 'r-email-hint'} />
                  </Field>
                </div>
              </fieldset>
              <fieldset className="grid sm:grid-cols-2 gap-4">
                <legend className="font-display font-bold text-forest text-lg mb-2">פרטי המשתתף/ת</legend>
                <Field id="r-childName" label="שם המשתתף/ת" required error={err.childName}>
                  <input id="r-childName" className={inputCls} value={f.childName} onChange={set('childName')} aria-invalid={!!err.childName} aria-describedby={desc('childName')} />
                </Field>
                <Field id="r-grade" label="כיתה" required error={err.grade}>
                  <select id="r-grade" className={inputCls} value={f.grade} onChange={set('grade')} aria-invalid={!!err.grade} aria-describedby={desc('grade')}>
                    <option value="">בחירה</option>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field id="r-place" label="יישוב / בית ספר" required error={err.place}>
                  <input id="r-place" className={inputCls} value={f.place} onChange={set('place')} aria-invalid={!!err.place} aria-describedby={desc('place')} />
                </Field>
                <Field id="r-source" label="איך שמעתם עלינו?">
                  <select id="r-source" className={inputCls} value={f.source} onChange={set('source')}>
                    <option value="">בחירה</option>
                    {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field id="r-notes" label="משהו שחשוב לנו לדעת?">
                    <textarea id="r-notes" rows="3" className={inputCls} value={f.notes} onChange={set('notes')} />
                  </Field>
                </div>
              </fieldset>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="r-company">חברה</label>
                <input id="r-company" tabIndex={-1} autoComplete="off" value={f.company} onChange={set('company')} />
              </div>

              <fieldset className="flex flex-col gap-3 rounded-2xl bg-cream p-4">
                <legend className="sr-only">אישורים</legend>
                {[
                  ['terms', <>קראתי ואני מסכים/ה ל<a href="#terms" className="underline text-forest font-semibold">תקנון</a> ול<a href="#privacy" className="underline text-forest font-semibold">מדיניות הפרטיות</a>, ואני ההורה או האפוטרופוס של התלמיד/ה.</>, true],
                  ['contact', 'אני מאשר/ת שתיצרו איתי קשר בוואטסאפ, בטלפון או במייל בנוגע לקורס.', true],
                  ['photos', 'אני מאשר/ת לצלם את בני/בתי במהלך המפגשים ולפרסם בערוצי צומחים.', false],
                  ['marketing', 'אשמח לקבל עדכונים על קבוצות ותכנים חדשים.', false],
                ].map(([k, label, req]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <label htmlFor={`r-${k}`} className="flex gap-3 items-start text-[15px] leading-relaxed cursor-pointer">
                      <input id={`r-${k}`} type="checkbox" checked={f[k]} onChange={set(k)} className="mt-1 w-5 h-5 accent-[#0F5132] shrink-0" aria-invalid={!!err[k]} aria-describedby={desc(k)} aria-required={req} />
                      <span>{label}{req && <span className="text-ember" aria-hidden="true"> *</span>}</span>
                    </label>
                    {err[k] && <span id={`r-${k}-err`} className="text-sm font-semibold text-[#B8452A] pr-8" role="alert">{err[k]}</span>}
                  </div>
                ))}
              </fieldset>

              <button type="submit" className="rounded-full bg-ember text-white font-display font-extrabold text-[19px] py-4 shadow-[0_12px_26px_rgba(255,107,74,.35)] hover:bg-[#B23A23] disabled:opacity-60 transition">
                <span className="inline-flex items-center justify-center gap-2.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" /></svg>
                  שליחת ההרשמה בוואטסאפ
                </span>
              </button>
              <p className="text-xs text-muted leading-relaxed">בלחיצה ייפתח וואטסאפ עם הפרטים, ונשאר רק לשלוח. הפרטים משמשים רק לתיאום הקורס ולא יועברו לגורם שלישי למטרות שיווק. פרטים נוספים ב<a href="#privacy" className="underline">מדיניות הפרטיות</a>.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
