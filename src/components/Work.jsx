import { useEffect, useRef } from 'react';
import { projects, img } from '../data/content.js';
import { useOnScroll, isDesktop } from '../hooks/scroll.jsx';
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

  useEffect(() => {
    size();
    addEventListener('resize', size);
    addEventListener('load', size);
    return () => { removeEventListener('resize', size); removeEventListener('load', size); };
  }, []);

  useOnScroll(() => {
    if (!isDesktop() || !dist.current) return;
    const r = section.current.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / dist.current));
    track.current.style.transform = `translate3d(${-p * dist.current}px,0,0)`;
    bar.current.style.transform = `scaleX(${p})`;
  });

  return (
    <section ref={section} className="work" id="work" data-nav="dark">
      <div className="work__pin">
        <div className="work__head">
          <p className="kicker">(07) Selected work</p>
          <h2 className="h2" data-split>Recent <em>work.</em></h2>
          <p className="work__hint"><span className="hint-desktop">Scroll</span><span className="hint-mobile">Swipe</span> to explore →</p>
        </div>
        <div ref={track} className="work__track">
          {projects.map(p => (
            <a
              key={p.image}
              className={`proj proj--${p.shape}`}
              href={img(p.image)}
              data-lightbox
              onClick={e => { e.preventDefault(); onOpenImage({ src: img(p.image), alt: `${p.client} — ${p.title}` }); }}
            >
              <figure><img src={img(p.image)} alt={`${p.client} — ${p.title}`} loading="lazy" onLoad={size} /></figure>
              <figcaption><span>{p.client}</span><b>{p.title}</b></figcaption>
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
