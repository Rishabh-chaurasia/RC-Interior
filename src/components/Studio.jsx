import { useRef, useState } from 'react';
import { statement, stats, pillars, expertise, img } from '../data/content.js';
import { useOnScroll } from '../hooks/scroll.jsx';
import { Reveal, Counter, Words, ParallaxImg } from './ui.jsx';

const wordCount = statement.reduce((n, s) => n + s.t.split(/\s+/).filter(Boolean).length, 0);

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
function Statement() {
  const ref = useRef(null);
  const [lit, setLit] = useState(0);
  useOnScroll(() => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = Math.min(1, Math.max(0, (innerHeight * 0.9 - r.top) / (r.height + innerHeight * 0.3)));
    setLit(Math.floor(p * wordCount * 1.05));
  });
  return (
    <p ref={ref} className="statement">
      <Words segments={statement} wordClass={i => (i < lit ? 'w on' : 'w')} />
    </p>
  );
}

export default function Studio() {
  return (
    <section className="studio section" id="studio">
      <div className="studio__top">
        <div className="studio__intro">
          <p className="kicker">(02) The studio</p>
          <h2 className="studio__at" data-split><small>At</small> RC Interior<span className="comma">,</span></h2>
          <Statement />
        </div>
        <div className="stats">
          {stats.map(s => (
            <Reveal key={s.text} className="stat">
              <p>{s.text}</p>
              <b><Counter value={s.value} />{s.suffix}</b>
            </Reveal>
          ))}
          <Reveal className="stat stat--dark">
            <p>Design isn’t just what you see. It’s how your team works in it.</p>
            <a href="#services" className="link-under">Our services</a>
          </Reveal>
        </div>
      </div>

      <div className="studio__grid">
        <figure className="studio__img" data-reveal>
          <ParallaxImg src={img('spaces/entrance-5.jpg')} alt="Lift lobby with a green wall and lounge chair" loading="lazy" />
          <figcaption>Est. 2007 · Sikandarpur, Gurugram</figcaption>
        </figure>
        <div className="studio__cols">
          {pillars.map(p => (
            <Reveal as="article" key={p.n} className="pillar">
              <span className="pillar__n">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
          <Reveal className="expertise">
            <p className="kicker">Expertise</p>
            <ul className="chips">{expertise.map(e => <li key={e}>{e}</li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
