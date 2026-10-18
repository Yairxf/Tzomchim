import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Twins from './components/Twins.jsx';
import Simulator from './components/Simulator.jsx';
import Path from './components/Path.jsx';
import League from './components/League.jsx';
import Pricing from './components/Pricing.jsx';
import About from './components/About.jsx';
import Register from './components/Register.jsx';
import Footer from './components/Footer.jsx';
import A11y from './components/A11y.jsx';
import { Terms, Privacy, Accessibility } from './components/Legal.jsx';

const PAGES = { terms: Terms, privacy: Privacy, accessibility: Accessibility };
const TITLES = { terms: 'תקנון ותנאי שימוש', privacy: 'מדיניות פרטיות', accessibility: 'הצהרת נגישות' };
const HOME_TITLE = 'צומחים | קורס שוק ההון וחינוך פיננסי לבני נוער';

const currentPage = () => {
  const h = (typeof window !== 'undefined' ? window.location.hash : '').replace('#', '');
  return PAGES[h] ? h : null;
};

export default function App() {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    const onHash = () => {
      const p = currentPage();
      setPage((prev) => {
        if (prev && !p) {
          // returning home from a legal page: jump to the requested section after render
          const id = window.location.hash.replace('#', '');
          requestAnimationFrame(() => { const el = id && document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'instant' }); else window.scrollTo({ top: 0, behavior: 'instant' }); });
        }
        return p;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => { document.title = page ? `${TITLES[page]} | צומחים` : HOME_TITLE; }, [page]);

  const Page = page ? PAGES[page] : null;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[60] focus:bg-forest focus:text-cream focus:px-4 focus:py-2 focus:rounded-full">דילוג לתוכן הראשי</a>
      <Header />
      {Page ? <Page /> : (
        <main id="main">
          <Hero />
          <Twins />
          <Simulator />
          <Path />
          <League />
          <Pricing />
          <About />
          <Register />
        </main>
      )}
      <Footer />
      <A11y />
    </>
  );
}
