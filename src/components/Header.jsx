import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const NAV = [
  ['#path', 'המסלול'],
  ['#simulator', 'הסימולטור'],
  ['#price', 'מחיר'],
  ['#about', 'עלינו'],
  ['#faq', 'שאלות'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header className={`sticky z-40 transition-colors ${scrolled ? 'bg-cream/90 backdrop-blur border-b border-sand' : 'bg-transparent'}`} style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="gutter mx-auto max-w-6xl flex items-center justify-between gap-4 py-3">
        <a href="#top" aria-label="צומחים – לראש העמוד"><Logo size={40} /></a>
        <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-1">
          {NAV.map(([h, t]) => (
            <a key={h} href={h} className="px-3 py-2 rounded-full text-[15px] font-semibold text-ink/80 hover:text-forest hover:bg-mint/70 transition-colors">{t}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#register" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-forest text-cream px-5 py-2.5 text-[15px] font-bold shadow-[0_6px_18px_rgba(15,81,50,.25)] hover:bg-forest-2 transition-colors">
            שיעור ניסיון חינם
          </a>
          <button type="button" className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-sand bg-paper" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <span className="sr-only">{open ? 'סגירת תפריט' : 'פתיחת תפריט'}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F5132" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="ניווט נייד" className="md:hidden gutter pb-4 flex flex-col gap-1 bg-cream border-b border-sand">
          {NAV.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-lg font-semibold border-b border-sand/70">{t}</a>
          ))}
          <a href="#register" onClick={() => setOpen(false)} className="mt-3 text-center rounded-full bg-forest text-cream py-3 font-bold">שיעור ניסיון חינם</a>
        </nav>
      )}
    </header>
  );
}
