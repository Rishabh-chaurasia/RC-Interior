import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../hooks/scroll.jsx';

const COLUMNS = 5;

/**
 * Intro: the RC house mark draws itself, "Your space / Your style / Your choice" plays,
 * then the curtain lifts in staggered columns to reveal the hero. Calls onDone as it lifts.
 */
export default function Loader({ onDone }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const ms = prefersReducedMotion() ? 100 : 2000;
    const t0 = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min(1, (now - t0) / ms);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // finish on a timer so a background tab (where rAF pauses) never gets stuck
    const finish = setTimeout(() => { setLeaving(true); onDone(); }, ms);
    const remove = setTimeout(() => setGone(true), ms + 1500);
    return () => { cancelAnimationFrame(raf); clearTimeout(finish); clearTimeout(remove); };
  }, [onDone]);

  if (gone) return null;
  return (
    <div className={`loader ${leaving ? 'is-done' : ''}`} aria-hidden="true">
      {Array.from({ length: COLUMNS }, (_, i) => (
        <span key={i} className="loader__col" style={{ '--i': i, left: `${(100 / COLUMNS) * i}%` }} />
      ))}
      <div className="loader__inner">
        <svg className="loader__mark" viewBox="0 0 40 40">
          <path d="M4 19 20 5l16 14" />
          <path d="M9 17v18h22V17" />
          <path d="M16 35V23h8v12" />
        </svg>
        <div className="loader__words">
          <span className="loader__word">Your space</span>
          <span className="loader__word">Your style</span>
          <span className="loader__word loader__word--em">Your choice</span>
        </div>
      </div>
      <span className="loader__count">{String(count).padStart(3, '0')}</span>
      <span className="loader__brand">RC Interior — Gurugram</span>
    </div>
  );
}
