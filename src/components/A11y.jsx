import { useEffect, useState } from 'react';

const KEY = 'tzomchim-a11y';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

export default function A11y() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(() => ({ text: 0, contrast: false, links: false, font: false, still: false, ...load() }));

  useEffect(() => {
    const c = document.documentElement.classList;
    c.toggle('a11y-text-1', s.text === 1);
    c.toggle('a11y-text-2', s.text === 2);
    c.toggle('a11y-contrast', s.contrast);
    c.toggle('a11y-links', s.links);
    c.toggle('a11y-font', s.font);
    c.toggle('a11y-still', s.still);
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
  }, [s]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const Toggle = ({ k, label }) => (
    <button type="button" aria-pressed={s[k]} onClick={() => setS({ ...s, [k]: !s[k] })}
      className={`w-full text-right rounded-xl px-4 py-3 font-semibold border-2 transition-colors ${s[k] ? 'bg-forest text-cream border-forest' : 'bg-paper border-sand hover:border-forest/40'}`}>
      {label}
    </button>
  );

  return (
    <div className="fixed z-50" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', left: 'calc(16px + env(safe-area-inset-left, 0px))' }}>
      {open && (
        <div id="a11y-panel" role="dialog" aria-label="תפריט נגישות" className="mb-3 w-[290px] max-w-[calc(100vw-32px)] rounded-3xl bg-cream border border-sand shadow-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <b className="font-display text-lg text-forest">נגישות</b>
            <button type="button" onClick={() => setOpen(false)} className="w-9 h-9 rounded-full bg-mint text-forest font-bold" aria-label="סגירת תפריט הנגישות">✕</button>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="גודל טקסט">
            <span className="text-sm font-semibold flex-1">גודל טקסט</span>
            {[0, 1, 2].map((v) => (
              <button key={v} type="button" aria-pressed={s.text === v} onClick={() => setS({ ...s, text: v })}
                className={`w-11 h-11 rounded-xl font-bold border-2 ${s.text === v ? 'bg-forest text-cream border-forest' : 'bg-paper border-sand'}`} style={{ fontSize: 13 + v * 3 }}>
                א<span className="sr-only">{['רגיל', 'גדול', 'גדול מאוד'][v]}</span>
              </button>
            ))}
          </div>
          <Toggle k="contrast" label="ניגודיות גבוהה" />
          <Toggle k="links" label="הדגשת קישורים" />
          <Toggle k="font" label="גופן קריא" />
          <Toggle k="still" label="עצירת אנימציות" />
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setS({ text: 0, contrast: false, links: false, font: false, still: false })} className="flex-1 rounded-xl py-2.5 text-sm font-bold bg-sand/60">איפוס</button>
            <a href="#accessibility" onClick={() => setOpen(false)} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-center bg-mint text-forest">הצהרת נגישות</a>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="a11y-panel"
        className="w-14 h-14 rounded-full bg-[#1D4ED8] text-white grid place-items-center shadow-[0_8px_20px_rgba(29,78,216,.4)] hover:scale-105 transition-transform">
        <span className="sr-only">{open ? 'סגירת תפריט נגישות' : 'פתיחת תפריט נגישות'}</span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3.2 6M12 14.5l3.2 6" />
        </svg>
      </button>
    </div>
  );
}
