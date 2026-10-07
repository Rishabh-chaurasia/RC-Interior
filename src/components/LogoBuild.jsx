import { useEffect, useRef, useState } from 'react';
import { WORDMARK_WIDTH, HOUSE, FLOOR, CHAIR_SOLID, CHAIR_LINES, CASTERS, RC_GLYPHS, INTERIOR_GLYPHS } from './logoPaths.js';
import { prefersReducedMotion } from '../hooks/scroll.jsx';

const W = WORDMARK_WIDTH, H = 106;

/** One piece of the logo on its own layer (full-size viewBox), so it can move in real 3D around its own centre. */
function Layer({ box: [x0, y0, x1, y1], cls, delay, children }) {
  const origin = `${(((x0 + x1) / 2 / W) * 100).toFixed(2)}% ${(((y0 + y1) / 2 / H) * 100).toFixed(2)}%`;
  return (
    <svg className={`lb__layer ${cls}`} viewBox={`0 0 ${W} ${H}`} style={{ transformOrigin: origin, '--d': `${delay}s` }} aria-hidden="true">
      {children}
    </svg>
  );
}

/**
 * The RC Interior logo, built in 3D when it scrolls into view: the roof swings down, the floor line
 * draws, the chair drops in, R and C turn to face you, then INTERIOR rises letter by letter.
 * It rebuilds each time the visitor comes back to it, and tilts gently with the pointer once built.
 */
export default function LogoBuild() {
  const ref = useRef(null);
  const stage = useRef(null);
  const [built, setBuilt] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setBuilt(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.4) setBuilt(true);
      else if (!e.isIntersecting) setBuilt(false); // fully out of view: ready to build again
    }, { threshold: [0, 0.4] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const tilt = e => {
    if (!built || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.setProperty('--ry', `${(nx * 14).toFixed(2)}deg`);
    stage.current.style.setProperty('--rx', `${(-ny * 12).toFixed(2)}deg`);
  };
  const untilt = () => { stage.current.style.removeProperty('--ry'); stage.current.style.removeProperty('--rx'); };

  return (
    <div ref={ref} className={`lb ${built ? 'is-built' : ''}`} role="img" aria-label="RC Interior. Your space, your style, your choice." onPointerMove={tilt} onPointerLeave={untilt}>
      <div ref={stage} className="lb__stage">
        <Layer box={[4, 10, 102, 101]} cls="lb__roof" delay={0}><path className="logo__house" d={HOUSE} /></Layer>
        <Layer box={[19, 63, 92, 101]} cls="lb__floor" delay={0.35}><path className="logo__floor" d={FLOOR} pathLength="1" /></Layer>
        <Layer box={[45, 66, 70, 100]} cls="lb__chair" delay={0.6}>
          <path d={CHAIR_SOLID} fill="currentColor" />
          <path d={CHAIR_LINES} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          {CASTERS.map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="1.3" fill="currentColor" />)}
        </Layer>
        {RC_GLYPHS.map((g, i) => (
          <Layer key={g.box[0]} box={g.box} cls="lb__rc" delay={0.8 + i * 0.16}><path d={g.d} fill="currentColor" /></Layer>
        ))}
        {INTERIOR_GLYPHS.map((g, i) => (
          <Layer key={g.box[0]} box={g.box} cls="lb__word" delay={1.15 + i * 0.07}><path className="logo__word" d={g.d} /></Layer>
        ))}
      </div>
      <p className="lb__tag" aria-hidden="true">Your space<i />Your style<i />Your choice</p>
    </div>
  );
}
