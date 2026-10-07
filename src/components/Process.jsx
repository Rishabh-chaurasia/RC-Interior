import { useRef, useState } from 'react';
import { steps } from '../data/content.js';
import { useOnScroll } from '../hooks/scroll.jsx';
import { SectionHead } from './ui.jsx';

/** Numbered steps joined by a line that fills as you scroll. */
export default function Process() {
  const list = useRef(null);
  const [progress, setProgress] = useState(0);

  useOnScroll(() => {
    const r = list.current?.getBoundingClientRect();
    if (!r) return;
    setProgress(Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (innerHeight * 0.45))));
  });

  return (
    <section className="process section section--paper">
      <SectionHead kicker="How we work">One team, <em>start to handover.</em></SectionHead>
      <ol ref={list} className="steps" style={{ '--p': progress.toFixed(3) }}>
        {steps.map((s, i) => (
          <li key={s.title} className={`step ${progress >= i / (steps.length - 1) - 0.02 ? 'is-lit' : ''}`}>
            <span className="step__dot">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
