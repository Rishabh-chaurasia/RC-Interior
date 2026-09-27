import { useRef, useState } from 'react';
import { navLinks, contact } from '../data/content.js';
import { useOnScroll } from '../hooks/scroll.jsx';
import { Btn } from './ui.jsx';

export function BrandMark({ className = 'brand__mark' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M4 19 20 5l16 14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17v18h22V17" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      <rect x="16" y="23" width="8" height="12" rx="1" fill="currentColor" />
    </svg>
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
    if (!menuOpen) setHidden(y > lastY.current && y > 500);
    lastY.current = y;

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
          <BrandMark />
          <span className="brand__rc">RC</span><span className="brand__word">Interior</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} className={current === l.id ? 'is-current' : ''}>
              <span className="roll" data-text={l.label}><span>{l.label}</span></span>
            </a>
          ))}
        </nav>
        <Btn href="#contact" variant="pill" className="nav__cta">Let’s discuss</Btn>
        <button className="nav__toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu}>
          <span /><span />
        </button>
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
