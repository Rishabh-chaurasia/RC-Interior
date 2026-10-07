import { useEffect, useState } from 'react';
import { values, img } from '../data/content.js';
import { Reveal, SectionHead } from './ui.jsx';

const icons = {
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  shield: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  leaf: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" /><path d="M5 19l7-7" /></>,
};

const Icon = ({ name }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
);

/** Photo that cross-fades through a small gallery (used for the plantation drives). */
function Slides({ images }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % images.length), 3200);
    return () => clearInterval(t);
  }, [images.length]);
  return images.map((src, k) => (
    <img key={src} src={img(src)} alt="" loading="lazy" className={k === i ? 'vtl__slide is-on' : 'vtl__slide'} />
  ));
}

/** Zigzag timeline: text card and photo alternate sides, joined by a dashed line with numbered stops. */
export default function Values() {
  return (
    <section className="values section">
      <SectionHead kicker="What we stand for">Four values, <em>every project.</em></SectionHead>
      <ol className="vtl">
        {values.map((v, i) => (
          <li key={v.title} className={`vtl__row value--${v.tone} ${i % 2 ? 'is-flip' : ''}`}>
            <Reveal className="vtl__card">
              <span className="vtl__tag">{v.tag}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
              <ul>
                {v.points.map(p => (
                  <li key={p}><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" /><path d="M6 10.5l2.6 2.6L14 7.6" /></svg>{p}</li>
                ))}
              </ul>
            </Reveal>
            <span className="vtl__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <Reveal className="vtl__media" delay={0.1}>
              <figure data-reveal>
                {v.gallery ? <Slides images={v.gallery} /> : <img src={img(v.image)} alt="" loading="lazy" />}
              </figure>
              <div className="vtl__badge">
                <span className="vtl__icon"><Icon name={v.icon} /></span>
                <span><b>{v.badge[0]}</b><small>{v.badge[1]}</small></span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
