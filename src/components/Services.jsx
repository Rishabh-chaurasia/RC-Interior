import { Fragment, useEffect, useState } from 'react';
import { services, spaces, styles, img } from '../data/content.js';
import { Reveal, SectionHead, Btn } from './ui.jsx';

const icons = {
  plan: <><rect x="6" y="6" width="36" height="36" rx="2" /><path d="M6 20h14V6M20 20v22M20 30h22M30 30v12" /><path d="M34 12l4 4-10 10h-4v-4z" /></>,
  key: <><circle cx="16" cy="24" r="9" /><circle cx="16" cy="24" r="3" /><path d="M25 24h18M37 24v7M31 24v5" /></>,
  shield: <><path d="M24 5l15 6v11c0 10-6.5 17-15 21C15.5 39 9 32 9 22V11z" /><path d="M26 14l-6 11h7l-3 10 8-13h-7l3-8z" /></>,
  hammer: <><path d="M8 40l18-18M22 10l6-4 14 14-4 6z" /><path d="M26 14l8 8" /><path d="M8 40h8" /></>,
  wrench: <path d="M30 8a9 9 0 0 0-8.5 12L8 33.5a3.5 3.5 0 0 0 5 5L26.5 25A9 9 0 0 0 38 14l-5 5-5-1-1-5z" />,
};

/** Background that walks through every part of an office, one zone every few seconds, named in a small tag. */
function Tour({ keys }) {
  const zones = keys.map(k => spaces.find(z => z.key === k)).filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % zones.length), 2800);
    return () => clearInterval(t);
  }, [zones.length]);
  return (
    <>
      {zones.map((z, k) => <img key={z.key} className={`card__tour ${k === i ? 'is-on' : ''}`} src={img(`spaces/sm/${z.key}-1.jpg`)} alt="" loading="lazy" />)}
      <span className="card__zone" aria-hidden="true"><b key={i}>{zones[i].title}</b><small>{i + 1} / {zones.length}</small></span>
    </>
  );
}

export default function Services() {
  return (
    <section className="services section" id="services">
      <SectionHead kicker="Services">From first sketch <em>to final screw.</em></SectionHead>

      <div className="bento">
        {services.map((s, i) => (
          <Reveal as="article" key={s.title} className={`card ${s.wide ? 'card--wide' : ''} ${s.tour ? 'card--tour' : ''}`}>
            {s.tour ? <Tour keys={s.tour} /> : <img className="card__bg" src={img(s.image)} alt="" loading="lazy" />}
            <svg className="card__icon" viewBox="0 0 48 48" aria-hidden="true">{icons[s.icon]}</svg>
            <span className="card__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {s.chips && <ul className="chips chips--sm">{s.chips.map(c => <li key={c}>{c}</li>)}</ul>}
          </Reveal>
        ))}
        <Reveal as="article" className="card card--lime">
          <span className="card__n">Styles</span>
          <h3 className="card__big">
            {styles.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && <> <i>/</i> </>}
                {i === styles.length - 1 ? <em>{s}</em> : s}
              </Fragment>
            ))}
          </h3>
          <Btn href="#contact">Let’s discuss</Btn>
        </Reveal>
      </div>
    </section>
  );
}
