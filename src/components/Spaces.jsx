import { useEffect, useState } from 'react';
import { spaces, img } from '../data/content.js';
import { isDesktop } from '../hooks/scroll.jsx';
import { SectionHead } from './ui.jsx';

/**
 * Expanding photo panels, one per office zone. Hover (desktop) or focus expands a panel;
 * clicking opens that zone's photos as a slideshow in the lightbox.
 */
export default function Spaces({ onOpenGallery }) {
  const [open, setOpen] = useState(0);
  // hover slideshow: the hovered panel cycles through its photos
  const [hovered, setHovered] = useState(-1);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    setFrame(0);
    if (hovered < 0) return;
    const t = setInterval(() => setFrame(f => f + 1), 1300);
    return () => clearInterval(t);
  }, [hovered]);

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
            onMouseEnter={() => { if (isDesktop()) setOpen(i); setHovered(i); }}
            onMouseLeave={() => setHovered(-1)}
            onFocus={() => setOpen(i)}
            onClick={() => { setOpen(i); show(s); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(s); } }}
          >
            {s.gallery.map((g, k) => {
              const on = (hovered === i ? frame % s.gallery.length : 0) === k;
              // only the first photo loads up front; the rest load when the panel is hovered
              if (k > 0 && hovered !== i && !on) return null;
              return <img key={g.image} className={on ? 'is-on' : ''} src={img(g.image.replace('spaces/', 'spaces/sm/'))} alt="" loading="lazy" />;
            })}
            {hovered === i && (
              <span className="panel__dots" aria-hidden="true">
                {s.gallery.map((g, k) => <i key={g.image} className={frame % s.gallery.length === k ? 'is-on' : ''} />)}
              </span>
            )}
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
