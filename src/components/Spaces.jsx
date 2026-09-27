import { useState } from 'react';
import { spaces, img } from '../data/content.js';
import { isDesktop } from '../hooks/scroll.jsx';
import { SectionHead } from './ui.jsx';

/**
 * Expanding photo panels, one per office zone. Hover (desktop) or focus expands a panel;
 * clicking opens that zone's photos as a slideshow in the lightbox.
 */
export default function Spaces({ onOpenGallery }) {
  const [open, setOpen] = useState(0);

  const show = s => onOpenGallery({
    heading: s.title,
    sub: `${s.gallery.length} designs`,
    index: 0,
    autoplay: true,
    images: s.gallery.map(g => ({ src: img(g.image), alt: `${s.title}: ${g.title}`, title: g.title })),
  });

  return (
    <section className="spaces section section--dark" id="spaces" data-nav="dark">
      <SectionHead kicker="(05) Spaces we design">Every room <em>has a job.</em></SectionHead>
      <p className="spaces__hint">Every zone of an office, designed by us. Click any space to see {spaces[0].gallery.length} designs.</p>
      <div className="panels">
        {spaces.map((s, i) => (
          <article
            key={s.key}
            className={`panel ${i === open ? 'is-open' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={`${s.title}: view ${s.gallery.length} designs`}
            data-reveal="noimg"
            data-delay={i * 0.06}
            onMouseEnter={() => isDesktop() && setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => { setOpen(i); show(s); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(s); } }}
          >
            <img src={img(s.image)} alt="" loading="lazy" />
            <div className="panel__txt">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <b className="panel__cta">View {s.gallery.length} designs <i aria-hidden="true">→</i></b>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
