import { marqueeClients } from '../data/content.js';

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Clients">
      <p className="marquee__label">Trusted by teams at</p>
      <div className="marquee__track">
        {[0, 1].map(copy => (
          <div key={copy} className="marquee__row" aria-hidden={copy === 1 || undefined}>
            {marqueeClients.map(c => <span key={c}>{c}</span>)}
          </div>
        ))}
      </div>
    </section>
  );
}
