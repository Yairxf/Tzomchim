import Logo from './Logo.jsx';
import { BRAND, waLink } from '../data.js';

export default function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="gutter mx-auto max-w-6xl py-14 grid md:grid-cols-[1.3fr_1fr_1fr] gap-10">
        <div className="flex flex-col gap-4 min-w-0">
          <Logo size={44} light />
          <p className="text-mint leading-relaxed max-w-sm">קורס שוק ההון לבני נוער: ריבית דריבית, השקעה חודשית, קרנות סל, ניתוח טכני וזיהוי הונאות. מתחילים מוקדם, צומחים בגדול.</p>
        </div>
        <div className="flex flex-col gap-2">
          <b className="font-display text-lg mb-1">יצירת קשר</b>
          {BRAND.phones.map((p) => (
            <a key={p.intl} href={waLink(p.intl)} target="_blank" rel="noopener" className="text-mint hover:text-white">{p.name} · <span className="num select-all" dir="ltr">{p.display}</span></a>
          ))}
          <a href="#register" className="text-mint hover:text-white">טופס הרשמה לשיעור ניסיון</a>
        </div>
        <nav aria-label="מידע משפטי" className="flex flex-col gap-2">
          <b className="font-display text-lg mb-1">מידע</b>
          <a href="#terms" className="text-mint hover:text-white">תקנון ותנאי שימוש</a>
          <a href="#privacy" className="text-mint hover:text-white">מדיניות פרטיות</a>
          <a href="#accessibility" className="text-mint hover:text-white">הצהרת נגישות</a>
          <a href="./course-plan.pdf" target="_blank" rel="noopener" className="text-mint hover:text-white">תוכנית הקורס למוסדות (PDF)</a>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="gutter mx-auto max-w-6xl py-5 flex flex-col md:flex-row gap-3 justify-between text-sm text-mint/80">
          <p>© 2026 צומחים – חינוך פיננסי לנוער. כל הזכויות שמורות.</p>
          <p className="max-w-2xl">התוכן באתר ובקורס הוא חינוכי בלבד ואינו מהווה ייעוץ השקעות, שיווק השקעות או המלצה לפעולה בניירות ערך. סימולציות ותיקי דמה מוצגים להמחשה בלבד.</p>
        </div>
      </div>
    </footer>
  );
}
