import { useCallback, useEffect, useRef, useState } from 'react';
import { testimonials, img } from '../data/content.js';
import { Words, ParallaxImg } from './ui.jsx';

const AUTOPLAY_MS = 7000;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  const restart = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive(i => (i + 1) % testimonials.length), AUTOPLAY_MS);
  }, []);
  useEffect(() => { restart(); return () => clearInterval(timer.current); }, [restart]);

  const step = dir => {
    setActive(i => (i + dir + testimonials.length) % testimonials.length);
    restart();
  };

  return (
    <section className="voices" data-nav="dark">
      <ParallaxImg className="voices__bg" src={img('spaces/lounge-5.jpg')} alt="" loading="lazy" strength={12} />
      <div className="voices__inner">
        <div className="voices__head">
          <p className="kicker">(10) Client words</p>
          <div className="voices__nav">
            <button className="round round--light" onClick={() => step(-1)} aria-label="Previous testimonial">←</button>
            <span className="voices__count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(testimonials.length).padStart(2, '0')}</span>
            <button className="round round--light" onClick={() => step(1)} aria-label="Next testimonial">→</button>
          </div>
        </div>
        <div className="voices__stage" aria-live="polite">
          {testimonials.map((t, i) => (
            <figure key={t.name} className={`quote ${i === active ? 'is-active' : ''}`}>
              <blockquote>
                <Words segments={[{ t: `“${t.quote}”` }]} wordStyle={k => ({ transitionDelay: `${k * 0.025}s` })} />
              </blockquote>
              <figcaption><b>{t.name}</b><span>{t.company}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
