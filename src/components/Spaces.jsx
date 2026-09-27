import { useState } from 'react';
import { spaces, img } from '../data/content.js';
import { isDesktop } from '../hooks/scroll.jsx';
import { SectionHead } from './ui.jsx';

/** Expanding photo panels: hover (desktop), focus or tap to open one. */
export default function Spaces() {
  const [open, setOpen] = useState(0);
  return (
    <section className="spaces section section--dark" id="spaces" data-nav="dark">
      <SectionHead kicker="(04) Spaces we design">Every room <em>has a job.</em></SectionHead>
      <div className="panels">
        {spaces.map((s, i) => (
          <article
            key={s.title}
            className={`panel ${i === open ? 'is-open' : ''}`}
            tabIndex={0}
            data-reveal="noimg"
            data-delay={i * 0.1}
            onMouseEnter={() => isDesktop() && setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            <img src={img(s.image)} alt={s.title} loading="lazy" />
            <div className="panel__txt">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
