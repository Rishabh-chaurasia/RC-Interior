import { useEffect, useRef, useState } from 'react';
import { WORDMARK_WIDTH, HOUSE, FLOOR, CHAIR_SOLID, CHAIR_LINES, CASTERS, RC_GLYPHS, INTERIOR_GLYPHS } from './logoPaths.js';
import { prefersReducedMotion } from '../hooks/scroll.jsx';

const W = WORDMARK_WIDTH, H = 106;

// Drawing order: [start, duration] in seconds. Every outline is traced in turn, then fills in.
const T = {
  house: [0.2, 1.4], floor: [1.3, 1], chair: [2, 0.9],
  rc: i => [2.7 + i * 0.7, 1],
  word: i => [4.2 + i * 0.28, 0.7],
};
const TAG = ['Your space', 'Your style', 'Your choice'];
const TAG_START = 6.6; // the tagline then writes itself out, letter by letter
const step = ([d, dur]) => ({ '--d': `${d}s`, '--dur': `${dur}s` });

/**
 * The RC Interior logo, drawn line by line when it scrolls into view: the house outline, the floor
 * line, the chair, R, C and then INTERIOR letter by letter, each filling in once traced. It redraws
 * whenever the visitor comes back to it, also with reduced motion on, and tilts gently in 3D with the pointer once drawn.
 */
export default function LogoBuild() {
  const ref = useRef(null);
  const stage = useRef(null);
  const [built, setBuilt] = useState(false);

  useEffect(() => {
    // played even with the OS "reduce motion" setting on (owner's request): it only traces and fades, nothing moves
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.85) setBuilt(true); // start only once it is in full view
      else if (!e.isIntersecting) setBuilt(false); // fully out of view: ready to draw again
    }, { threshold: [0, 0.85] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const tilt = e => {
    if (!built || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.setProperty('--ry', `${(nx * 14).toFixed(2)}deg`);
    stage.current.style.setProperty('--rx', `${(-ny * 12).toFixed(2)}deg`);
  };
  const untilt = () => { stage.current.style.removeProperty('--ry'); stage.current.style.removeProperty('--rx'); };

  return (
    <div ref={ref} className={`lb ${built ? 'is-built' : ''}`} role="img" aria-label="RC Interior. Your space, your style, your choice." onPointerMove={tilt} onPointerLeave={untilt}>
      <svg ref={stage} className="lb__stage" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path className="lb__ink lb__house" d={HOUSE} pathLength="1" style={step(T.house)} />
        <path className="lb__ink lb__line lb__floor" d={FLOOR} pathLength="1" style={step(T.floor)} />
        <g className="lb__chair">
          <path className="lb__ink" d={CHAIR_SOLID} pathLength="1" style={step(T.chair)} />
          <path className="lb__ink lb__line" d={CHAIR_LINES} pathLength="1" style={step(T.chair)} />
          {CASTERS.map(([cx, cy]) => <circle key={cx} className="lb__ink" cx={cx} cy={cy} r="1.3" pathLength="1" style={step(T.chair)} />)}
        </g>
        {RC_GLYPHS.map((g, i) => <path key={g.box[0]} className="lb__ink lb__rc" d={g.d} pathLength="1" style={step(T.rc(i))} />)}
        {INTERIOR_GLYPHS.map((g, i) => <path key={g.box[0]} className="lb__ink lb__word" d={g.d} pathLength="1" style={step(T.word(i))} />)}
      </svg>
      <p className="lb__tag" aria-hidden="true">
        {TAG.map((words, w) => {
          const before = TAG.slice(0, w).join('').length;
          return (
            <span key={words}>
              {w > 0 && <i style={{ '--d': `${TAG_START + (before + w) * 0.05}s` }} />}
              {[...words].map((ch, c) => <b key={c} style={{ '--d': `${TAG_START + (before + w + c) * 0.05}s` }}>{ch}</b>)}
            </span>
          );
        })}
      </p>
    </div>
  );
}
