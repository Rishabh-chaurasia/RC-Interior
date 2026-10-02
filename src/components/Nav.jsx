import { useRef, useState } from 'react';
import { navLinks, contact } from '../data/content.js';
import { useOnScroll } from '../hooks/scroll.jsx';
import { Btn } from './ui.jsx';
import Logo from './Logo.jsx';
import { THEMES, useTheme } from '../hooks/theme.js';

/** Cycles the colour theme: Ivory → Espresso → Sage → Terracotta. */
function ThemeButton() {
  const [theme, next] = useTheme();
  const upcoming = THEMES[(THEMES.findIndex(t => t.id === theme.id) + 1) % THEMES.length];
  return (
    <button type="button" className="theme-btn" onClick={next} aria-label={`Colour theme: ${theme.label}. Switch to ${upcoming.label}`} title={`Theme: ${theme.label} (next: ${upcoming.label})`}>
      <span key={theme.id} className="theme-btn__dot" style={{ '--a': theme.swatch[0], '--b': theme.swatch[1] }} aria-hidden="true" />
      <span className="theme-btn__label" aria-hidden="true">{theme.label}</span>
    </button>
  );
}

// data-nav="dark" marks sections whose darkness comes from photos/children rather than their own background
function isDarkBg(el) {
  if (el.dataset.nav === 'dark') return true;
  const [r, g, b, a = 1] = (getComputedStyle(el).backgroundColor.match(/[\d.]+/g) || []).map(Number);
  if (!a) return false;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}

export default function Nav({ menuOpen, onToggleMenu }) {
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [current, setCurrent] = useState(null);
  const lastY = useRef(0);

  useOnScroll(() => {
    const y = scrollY;
    // only react to real movement: repeated events at the same position (e.g. when scrolling stops)
    // must not bring the nav back after the visitor scrolled down
    if (Math.abs(y - lastY.current) > 2) {
      if (!menuOpen) setHidden(y > lastY.current && y > 500);
      lastY.current = y;
    }
    if (y < 80 && !menuOpen) setHidden(false);

    // dark style while the nav floats over a dark section. Reads the section's live background colour,
    // so it also follows the scroll-driven colour shifts in hooks/motion.js.
    const mid = 46;
    const under = [...document.querySelectorAll('main > section, footer')].find(z => {
      const r = z.getBoundingClientRect();
      return r.top <= mid && r.bottom >= mid;
    });
    setDark(under ? isDarkBg(under) : false);

    let cur = null;
    document.querySelectorAll('main section[id]').forEach(s => {
      if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id;
    });
    setCurrent(cur);
  });

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <header className={`nav ${hidden ? 'is-hidden' : ''} ${dark ? 'is-dark' : ''}`} id="top">
        <a href="#top" className="brand" aria-label="RC Interior home">
          <Logo className="brand__logo" />
        </a>
        <nav className="nav__links" aria-label="Primary">
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} className={current === l.id ? 'is-current' : ''}>
              <span className="roll" data-text={l.label}><span>{l.label}</span></span>
            </a>
          ))}
        </nav>
        <div className="nav__end">
          <ThemeButton />
          <Btn href="#contact" variant="pill" className="nav__cta">Let’s discuss</Btn>
          <button className="nav__toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className="menu" aria-hidden={!menuOpen}>
        <nav>
          {[...navLinks.filter(l => l.id !== 'clients'), { id: 'contact', label: 'Contact' }].map((l, i) => (
            <a key={l.id} href={`#${l.id}`}><small>{String(i + 1).padStart(2, '0')}</small>{l.label}</a>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={contact.phones[0].href}>{contact.phones[0].label}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
    </>
  );
}
