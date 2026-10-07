import { useEffect, useRef, useState } from 'react';
import { navLinks, contact } from '../data/content.js';
import { useOnScroll } from '../hooks/scroll.jsx';
import { Btn } from './ui.jsx';
import Logo from './Logo.jsx';
import { THEMES, useTheme } from '../hooks/theme.js';

/** Colour theme picker: the button shows the current theme, its menu lists every theme. */
function ThemePicker() {
  const [theme, choose] = useTheme();
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return;
    // focus the current theme when the menu opens
    wrap.current.querySelector('[aria-checked="true"]')?.focus();
    const down = e => { if (!wrap.current.contains(e.target)) setOpen(false); };
    const key = e => { if (e.key === 'Escape') { setOpen(false); trigger.current.focus(); } };
    addEventListener('pointerdown', down);
    addEventListener('keydown', key);
    return () => { removeEventListener('pointerdown', down); removeEventListener('keydown', key); };
  }, [open]);

  // arrow keys move between swatches, wrapping around
  const onKeyDown = e => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const items = [...wrap.current.querySelectorAll('[role="menuitemradio"]')];
    const i = items.indexOf(document.activeElement);
    items[(i + keys[e.key] + items.length) % items.length].focus();
  };

  const pick = id => { choose(id); setOpen(false); trigger.current.focus(); };
  const group = (title, list) => (
    <div className="theme-menu__group" role="group" aria-label={title}>
      <span aria-hidden="true">{title}</span>
      <div>
        {list.map(t => (
          <button
            key={t.id}
            type="button"
            role="menuitemradio"
            aria-checked={t.id === theme.id}
            className="theme-menu__item"
            tabIndex={-1}
            onClick={() => pick(t.id)}
          >
            <i style={{ '--a': t.swatch[0], '--b': t.swatch[1] }} aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="theme" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="theme-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Colour theme: ${theme.label}. Choose a theme`}
        onClick={() => setOpen(o => !o)}
      >
        <span key={theme.id} className="theme-btn__dot" style={{ '--a': theme.swatch[0], '--b': theme.swatch[1] }} aria-hidden="true" />
        <span className="theme-btn__label" aria-hidden="true">{theme.label}</span>
      </button>
      {open && (
        <div className="theme-menu" role="menu" aria-label="Colour themes" onKeyDown={onKeyDown}>
          {group('Light', THEMES.filter(t => !t.dark))}
          {group('Dark', THEMES.filter(t => t.dark))}
        </div>
      )}
    </div>
  );
}

/** The same themes as swatches inside the phone menu, where the header button is easy to miss. */
function ThemeSwatches() {
  const [theme, choose] = useTheme();
  return (
    <div className="menu__themes" role="radiogroup" aria-label="Colour theme">
      <span>Theme · <b>{theme.label}</b></span>
      <div>
        {THEMES.map(t => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={t.id === theme.id}
            aria-label={t.label}
            title={t.label}
            onClick={() => choose(t.id)}
            style={{ '--a': t.swatch[0], '--b': t.swatch[1] }}
          />
        ))}
      </div>
    </div>
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
          <ThemePicker />
          <Btn href="#contact" variant="pill" className="nav__cta">Let’s discuss</Btn>
          <button className="nav__toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className="menu" aria-hidden={!menuOpen}>
        <nav>
          {[...navLinks.filter(l => l.id !== 'clients'), { id: 'contact', label: 'Contact' }].map(l => (
            <a key={l.id} href={`#${l.id}`}>{l.label}</a>
          ))}
        </nav>
        <div className="menu__foot">
          <ThemeSwatches />
          <a href={contact.phones[0].href}>{contact.phones[0].label}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
    </>
  );
}
