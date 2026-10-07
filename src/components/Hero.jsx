import { useCallback, useEffect, useRef, useState } from 'react';
import { heroSlides, img } from '../data/content.js';
import { Btn } from './ui.jsx';

const SLIDE_MS = 6500;

export default function Hero({ ready }) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  // Slides always auto-advance (it's rotating content, not a decorative effect); reduced-motion
  // only turns off the zoom/parallax touches elsewhere, handled separately in CSS.
  const restart = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive(i => (i + 1) % heroSlides.length), SLIDE_MS);
  }, []);

  useEffect(() => {
    if (!ready) return;
    restart();
    return () => clearInterval(timer.current);
  }, [ready, restart]);

  const go = i => { setActive(i); restart(); };
  const slide = heroSlides[active];

  return (
    <section className="hero" aria-label="Introduction" style={{ '--dur': `${SLIDE_MS}ms` }}>
      <div className="hero__slides">
        {heroSlides.map((s, i) => (
          <figure key={s.src} className={`slide ${i === active ? 'is-active' : ''}`}>
            <img src={img(s.src)} alt={s.alt} fetchPriority={i === 0 ? 'high' : undefined} />
          </figure>
        ))}
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content">
        <p className="eyebrow"><span className="dot" />Commercial interiors · Since 2007</p>
        {/* letters are split and animated by hooks/motion.js once the loader lifts */}
        <h1 className="hero__title" data-split="hero">
          <span>Your space.</span>
          <span>Your style.</span>
          <span><em>Your choice.</em></span>
        </h1>
        <div className="hero__bottom">
          <div className="hero__left">
            <p className="hero__lede">Since 2007, RC Interior has designed and built commercial workspaces across Delhi NCR — from first sketch and 3D visualisation to civil work, MEP and final handover, all under one roof.</p>
            <div className="hero__actions">
              <Btn href="#contact" variant="lime">Book a site visit</Btn>
              <a href="#work" className="link-under">See our work</a>
            </div>
          </div>
          <div className="hero__ctrl">
            <div className="hero__meta">
              <span className="hero__count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(heroSlides.length).padStart(2, '0')}</span>
              <span className="hero__caption">{slide.caption}</span>
            </div>
            <div className="hero__bars" role="tablist" aria-label="Slides">
              {heroSlides.map((s, i) => (
                <button
                  key={s.src}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Slide ${i + 1}`}
                  className={i === active && ready ? 'is-active' : i < active ? 'is-done' : ''}
                  onClick={() => go(i)}
                >
                  {/* key forces a fresh element so the progress animation restarts */}
                  <i key={i === active ? `on-${active}` : 'off'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
