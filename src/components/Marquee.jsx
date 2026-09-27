import { clientLogos, img } from '../data/content.js';

/** Endless logo carousel. Two identical rows scroll left; hovering pauses it. */
export default function Marquee() {
  return (
    <section className="marquee" aria-label="Clients">
      <p className="marquee__label">Trusted by teams at</p>
      <div className="marquee__track">
        {[0, 1].map(copy => (
          <ul key={copy} className="marquee__row" aria-hidden={copy === 1 || undefined}>
            {clientLogos.map(c => (
              <li key={c.name} className="logo-card" style={c.bg ? { background: c.bg, borderColor: c.bg } : undefined}>
                <img src={img(`logos/${c.file}`)} alt={copy === 0 ? c.name : ''} loading="lazy" draggable="false" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
