import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useOnScroll, prefersReducedMotion } from '../hooks/scroll.jsx';

/** Fades/slides its content in when scrolled into view. */
export function Reveal({ as: Tag = 'div', className = '', delay, style, children, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? { '--d': `${delay}s`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A line of display type that slides up from a mask. `show` forces it in (used by the hero). */
export function Line({ children, show, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const on = show ?? inView;
  return (
    <span ref={ref} className={`line ${on ? 'is-in' : ''}`}>
      <span style={delay ? { '--d': `${delay}s` } : undefined}>{children}</span>
    </span>
  );
}

/** Counts up from 0 to `value` when visible. */
export function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.6, rootMargin: '0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800, start = performance.now();
    let raf;
    const step = now => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // rAF pauses in background tabs; make sure we land on the final number anyway
    const done = setTimeout(() => setN(value), dur + 100);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [inView, value]);
  return <span ref={ref}>{n.toLocaleString('en-IN')}</span>;
}

/** Splits text segments ({t, em}) into word spans. `wordClass(i)` / `wordStyle(i)` customise each word. */
export function Words({ segments, wordClass = () => 'w', wordStyle }) {
  let i = 0;
  return segments.map((seg, s) => {
    const words = seg.t.split(/(\s+)/).map((part, k) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return part;
      const idx = i++;
      return <span key={k} className={wordClass(idx)} style={wordStyle?.(idx)}>{part}</span>;
    });
    return seg.em ? <em key={s}>{words}</em> : <span key={s}>{words}</span>;
  });
}

/** Image that drifts and slowly un-zooms as it scrolls past. Animated by hooks/motion.js. */
export function ParallaxImg({ strength = 10, ...imgProps }) {
  return <img data-parallax={strength} {...imgProps} />;
}

export function Btn({ href, variant = '', className = '', children, arrow = '→', ...rest }) {
  const cls = `btn ${variant ? `btn--${variant}` : ''} ${className}`.trim();
  const inner = <><span>{children}</span><i aria-hidden="true">{arrow}</i></>;
  return href
    ? <a href={href} className={cls} {...rest}>{inner}</a>
    : <button className={cls} {...rest}>{inner}</button>;
}

export function SectionHead({ kicker, children }) {
  return (
    <div className="section__head section__head--split">
      <p className="kicker">{kicker}</p>
      <h2 className="h2" data-split>{children}</h2>
    </div>
  );
}
