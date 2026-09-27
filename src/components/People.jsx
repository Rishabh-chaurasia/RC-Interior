import { clients, team, csrPoints, caseStudies, img } from '../data/content.js';
import { Reveal, SectionHead, Counter, ParallaxImg, Btn } from './ui.jsx';

/** Client grid. Clients with photos in `caseStudies` become buttons that open their finished project. */
export function ClientWall({ onOpenCase }) {
  const open = name => {
    const cs = caseStudies[name];
    onOpenCase({
      heading: `${name}${cs.place ? `, ${cs.place}` : ''}`,
      sub: 'Finished project by RC Interior',
      index: 0,
      images: cs.images.map(p => ({ src: img(p.image), alt: `${name}: ${p.title}`, title: p.title })),
    });
  };
  return (
    <section className="wall section" id="clients">
      <SectionHead kicker="(11) Valued collaborators">30+ companies <em>call us back.</em></SectionHead>
      <p className="wall__hint"><span className="wall__dot" aria-hidden="true" /> Tap a highlighted client to see the finished project.</p>
      <ul className="wall__grid">
        {clients.map(c => caseStudies[c] ? (
          <li key={c} className="wall__case">
            <button type="button" onClick={() => open(c)} aria-label={`${c}: view finished project photos`}>
              <span className="wall__name">{c}</span>
              <span className="wall__cta">View project <i aria-hidden="true">→</i></span>
            </button>
          </li>
        ) : <li key={c}>{c}</li>)}
        <li className="wall__more">&amp; many more</li>
      </ul>
    </section>
  );
}

export function Team() {
  return (
    <section className="team section" id="team">
      <SectionHead kicker="(12) Core team">The people <em>on your site.</em></SectionHead>
      <ul className="team__grid">
        {team.map(m => (
          <Reveal as="li" key={m.name} className="member">
            <span className="member__i">{m.initials}</span>
            <div><b>{m.name}</b><span>{m.role}</span></div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export function Csr() {
  return (
    <section className="csr" data-nav="dark">
      <figure className="csr__img" data-reveal data-radius="0px">
        <ParallaxImg src={img('csr.jpg')} alt="Volunteers planting a sapling" loading="lazy" />
      </figure>
      <div className="csr__copy">
        <p className="kicker">(13) CSR · Designing spaces, nurturing nature</p>
        <h2 className="csr__big"><Counter value={1000} /><small>trees</small></h2>
        <p className="csr__lede">planted for every business we take on. Every project leaves a legacy of green cover, and every client becomes a partner in it.</p>
        <ul className="csr__list">
          {csrPoints.map(p => <li key={p.title}><b>{p.title}</b><span>{p.text}</span></li>)}
        </ul>
      </div>
    </section>
  );
}

export function Cta({ phone }) {
  return (
    <section className="cta" data-nav="dark">
      <ParallaxImg className="cta__bg" src={img('spaces/workstation-3.jpg')} alt="" loading="lazy" strength={12} />
      <div className="cta__inner">
        <p className="kicker">Next steps</p>
        <h2 className="cta__title" data-split>Ready to transform <em>your workspace?</em></h2>
        <Reveal as="p" className="cta__lede">Tell us about your floor plate. We’ll visit, measure and come back with a plan, free.</Reveal>
        <Reveal className="cta__actions">
          <Btn href="#contact" variant="lime">Book a free site visit</Btn>
          <a href={phone.href} className="link-under link-under--light">or call {phone.label}</a>
        </Reveal>
      </div>
    </section>
  );
}
