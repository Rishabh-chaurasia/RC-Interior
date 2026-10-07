import { useEffect, useRef } from 'react';
import { projects, img } from '../data/content.js';
import { useOnScroll, isDesktop, prefersReducedMotion } from '../hooks/scroll.jsx';
import { Btn } from './ui.jsx';

/**
 * Horizontal gallery. On desktop the section is made as tall as the track is wide,
 * and vertical scrolling slides the sticky track sideways. On mobile it's a swipe row.
 */
export default function Work({ onOpenImage }) {
  const section = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const dist = useRef(0);

  const size = () => {
    if (!section.current) return;
    if (!isDesktop()) { section.current.style.height = ''; dist.current = 0; return; }
    dist.current = Math.max(0, track.current.scrollWidth - innerWidth);
    section.current.style.height = `${innerHeight + dist.current}px`;
  };

  // 3D coverflow: each photo turns towards the centre of the screen and sinks back as it moves away
  const coverflow = () => {
    const t = track.current;
    if (!t || prefersReducedMotion()) return;
    const sr = section.current.getBoundingClientRect();
    if (sr.bottom < 0 || sr.top > innerHeight) return;
    const vw = innerWidth;
    t.style.perspectiveOrigin = `${(vw / 2 - t.getBoundingClientRect().left).toFixed(0)}px 50%`;
    t.querySelectorAll('.proj').forEach(el => {
      const r = el.getBoundingClientRect();
      const o = Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - vw / 2) / vw));
      el.style.rotate = Math.abs(o) < 0.005 ? '' : `0 1 0 ${(-o * 26).toFixed(2)}deg`;
      el.style.translate = `0 0 ${(-Math.abs(o) * 150).toFixed(1)}px`;
    });
  };

  useEffect(() => {
    size();
    addEventListener('resize', size);
    addEventListener('load', size);
    const t = track.current;
    t.addEventListener('scroll', coverflow, { passive: true }); // mobile swipe row
    return () => { removeEventListener('resize', size); removeEventListener('load', size); t.removeEventListener('scroll', coverflow); };
  }, []);

  useOnScroll(() => {
    if (isDesktop() && dist.current) {
      const r = section.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / dist.current));
      track.current.style.transform = `translate3d(${-p * dist.current}px,0,0)`;
      bar.current.style.transform = `scaleX(${p})`;
    }
    coverflow();
  });

  return (
    <section ref={section} className="work" id="work">
      <div className="work__pin">
        <div className="work__head">
          <p className="kicker">Gallery</p>
          <h2 className="h2" data-split>Spaces we <em>imagine.</em></h2>
          <p className="work__hint">
            <span className="hint-desktop">Scroll</span><span className="hint-mobile">Swipe</span> to explore →
            <a href="#clients" className="work__real">Real client projects ↓</a>
          </p>
        </div>
        <div ref={track} className="work__track">
          {projects.map((p, i) => (
            <a
              key={p.image}
              className={`proj proj--${p.shape}`}
              href={img(p.image)}
              data-lightbox
              onClick={e => {
                e.preventDefault();
                onOpenImage({
                  heading: 'Spaces we imagine',
                  sub: 'Office interiors',
                  index: i,
                  images: projects.map(q => ({ src: img(q.image), alt: q.title, title: q.title })),
                });
              }}
            >
              <figure><img src={img(p.image)} alt={p.title} loading="lazy" onLoad={size} /></figure>
              <figcaption><span>{String(i + 1).padStart(2, '0')}</span><b>{p.title}</b></figcaption>
            </a>
          ))}
          <div className="proj proj--end">
            <p>Your office<br /><em>could be next.</em></p>
            <Btn href="#contact" variant="lime">Start a project</Btn>
          </div>
        </div>
        <div className="work__progress"><span ref={bar} /></div>
      </div>
    </section>
  );
}
