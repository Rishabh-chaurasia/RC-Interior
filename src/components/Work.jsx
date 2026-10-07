import { useEffect, useRef } from 'react';
import { projects, img } from '../data/content.js';
import { useOnScroll, isDesktop, prefersReducedMotion } from '../hooks/scroll.jsx';
import { Btn } from './ui.jsx';

/**
 * Horizontal gallery. On desktop it moves with the cursor, not the scroll wheel: rest the pointer
 * towards the left edge and it glides left, towards the right edge and it glides right (arrow
 * buttons do the same in steps), so the page itself never gets stuck here. On mobile it's a swipe row.
 */
export default function Work({ onOpenImage }) {
  const section = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const dist = useRef(0);
  const pan = useRef({ x: 0, target: 0, vel: 0, raf: 0 });

  const size = () => {
    if (!section.current) return;
    dist.current = isDesktop() ? Math.max(0, track.current.scrollWidth - innerWidth) : 0;
    const p = pan.current;
    p.x = p.target = Math.min(p.x, dist.current);
    place();
  };

  const place = () => {
    const p = pan.current;
    if (!isDesktop()) { track.current.style.transform = ''; return; }
    track.current.style.transform = `translate3d(${-p.x}px,0,0)`;
    bar.current.style.transform = `scaleX(${dist.current ? p.x / dist.current : 0})`;
    coverflow();
  };

  // glide towards the target; the cursor's distance from the centre sets the speed
  const tick = () => {
    const p = pan.current;
    p.target = Math.min(dist.current, Math.max(0, p.target + p.vel));
    p.x += (p.target - p.x) * (prefersReducedMotion() ? 1 : 0.12);
    if (Math.abs(p.target - p.x) < 0.3) p.x = p.target;
    place();
    p.raf = p.vel || p.x !== p.target ? requestAnimationFrame(tick) : 0;
  };
  const run = () => { if (!pan.current.raf) pan.current.raf = requestAnimationFrame(tick); };

  const onMove = e => {
    if (e.pointerType !== 'mouse' || !isDesktop()) return;
    const d = e.clientX / innerWidth - 0.5; // -0.5 … 0.5
    const a = Math.max(0, Math.abs(d) - 0.14) / 0.36; // still in the middle, faster towards the edges
    pan.current.vel = Math.sign(d) * a * a * 18;
    run();
  };
  const onLeave = () => { pan.current.vel = 0; };
  const step = dir => { pan.current.target += dir * innerWidth * 0.55; run(); };

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
    return () => { removeEventListener('resize', size); removeEventListener('load', size); t.removeEventListener('scroll', coverflow); cancelAnimationFrame(pan.current.raf); };
  }, []);

  useOnScroll(coverflow);

  return (
    <section ref={section} className="work" id="work">
      <div className="work__pin">
        <div className="work__head">
          <p className="kicker">Gallery</p>
          <h2 className="h2" data-split>Spaces we <em>imagine.</em></h2>
          <p className="work__hint">
            <span className="hint-desktop">Move the cursor left or right</span><span className="hint-mobile">Swipe</span> to explore ↔
            <a href="#clients" className="work__real">Real client projects ↓</a>
          </p>
        </div>
        <div className="work__stage" onPointerMove={onMove} onPointerLeave={onLeave}>
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
        </div>
        <div className="work__nav">
          <button type="button" className="work__arrow" onClick={() => step(-1)} aria-label="Previous designs">←</button>
          <div className="work__progress"><span ref={bar} /></div>
          <button type="button" className="work__arrow" onClick={() => step(1)} aria-label="More designs">→</button>
        </div>
      </div>
    </section>
  );
}
