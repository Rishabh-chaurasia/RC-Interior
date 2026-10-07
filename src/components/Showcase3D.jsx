import { useCallback, useEffect, useRef, useState } from 'react';
import { STOPS, stopFromProgress } from './3d/stops.js';
import { useOnScroll, useScrollApi, prefersReducedMotion } from '../hooks/scroll.jsx';
import { img } from '../data/content.js';
import { Btn } from './ui.jsx';

const LAST = STOPS.length - 1;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * Pinned walkthrough of a real office. The section is several screens tall and the stage sticks to
 * the viewport; scroll progress "walks" the camera into each photo (a zoom-through with a 3D tilt)
 * and on into the next room. Captions, step list and progress bar follow the same progress.
 */
export default function Showcase3D() {
  const section = useRef(null);
  const stage = useRef(null);
  const layers = useRef([]);
  const bar = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const scroll = useScrollApi();
  const [near, setNear] = useState(false); // load full-size photos only when the section is close
  const [stop, setStop] = useState({ index: 0, parked: true, start: true });

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1400px 0px' });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  // Draw every layer for a fractional stop position s.
  const s = useRef(0);
  const paint = useCallback(() => {
    const { x, y } = pointer.current;
    layers.current.forEach((el, i) => {
      if (!el) return;
      const d = s.current - i; // 0 = parked here, 0→1 = walking out of it, -1→0 = walking in
      if (d <= -1 || d >= 1) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      let scale, opacity, blur = 0, z = 0;
      if (d >= 0) { // leaving: push forward into the room, then dissolve
        scale = 1.06 + d * 0.55;
        z = d * 220;
        opacity = 1 - smooth(0.25, 0.85, d);
        blur = smooth(0.35, 1, d) * 6;
      } else { // arriving: settles back from slightly wide
        scale = 1.06 - d * 0.1;
        z = d * 60;
        opacity = 1;
      }
      const rx = -y * 3, ry = x * 5; // gentle 3D tilt that follows the mouse
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(LAST - i + 1);
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
      el.style.transform = `translate3d(${(-x * 14).toFixed(1)}px, ${(-y * 10).toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    });
  }, []);

  useOnScroll(() => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    s.current = stopFromProgress(p);
    paint();
    const index = Math.round(s.current);
    const parked = Math.abs(s.current - index) < 0.18;
    const start = p < 0.015;
    setStop(prev => (prev.index === index && prev.parked === parked && prev.start === start ? prev : { index, parked, start }));
  });

  // mouse tilt (desktop, motion allowed): ease towards the pointer while the section is on screen
  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const ptr = pointer.current;
    let raf = 0, running = false;
    const loop = () => {
      ptr.x += (ptr.tx - ptr.x) * 0.08; ptr.y += (ptr.ty - ptr.y) * 0.08;
      paint();
      if (Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 0.001) raf = requestAnimationFrame(loop); else running = false;
    };
    const move = e => {
      ptr.tx = e.clientX / innerWidth - 0.5; ptr.ty = e.clientY / innerHeight - 0.5;
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    };
    const pin = stage.current.parentElement;
    pin.addEventListener('mousemove', move);
    return () => { pin.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, [paint]);

  useEffect(() => { paint(); }, [near, paint]);

  const jump = useCallback(k => {
    const el = section.current;
    const top = el.getBoundingClientRect().top + scrollY;
    const total = el.offsetHeight - innerHeight;
    scroll.scrollTo(top + (k / LAST) * total + 2);
  }, [scroll]);

  const current = STOPS[stop.index];

  return (
    <section ref={section} className="walk" id="walkthrough" style={{ '--stops': LAST }}>
      <div className="walk__pin">
        <div ref={stage} className="walk__stage">
          {STOPS.map((st, i) => (
            <div key={st.key} ref={el => { layers.current[i] = el; }} className="walk__layer">
              {/* first photo loads straight away; the rest once the section is near */}
              {(i === 0 || near) && (
                <img src={img(st.image)} alt={i === stop.index ? st.title : ''} style={{ objectPosition: st.focus }} decoding="async" fetchPriority={i === 0 ? 'high' : 'low'} />
              )}
            </div>
          ))}
        </div>
        <div className="walk__shade" aria-hidden="true" />

        <header className={`walk__head ${stop.index === 0 ? 'is-on' : ''}`}>
          <p className="kicker">Walk through our work</p>
          <h2 className="walk__title" data-split>Step inside, <em>room by room.</em></h2>
        </header>

        <div className={`walk__caption ${stop.parked ? 'is-on' : ''}`} aria-live="polite">
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          {current.cta && <Btn href="#contact" variant="lime">Plan my office</Btn>}
        </div>

        <ol className="walk__steps" aria-label="Walkthrough stops">
          {STOPS.map((st, i) => (
            <li key={st.key}>
              <button type="button" className={i === stop.index ? 'is-on' : ''} onClick={() => jump(i)} aria-current={i === stop.index || undefined}>
                <span>{st.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <p className={`walk__hint ${stop.start ? 'is-on' : ''}`}>Scroll to walk through <i aria-hidden="true">↓</i></p>
        <div className="walk__bar" aria-hidden="true"><span ref={bar} /></div>
      </div>
    </section>
  );
}
