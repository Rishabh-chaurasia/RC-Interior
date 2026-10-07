import { whyCards, img } from '../data/content.js';
import { Reveal, Counter } from './ui.jsx';

export default function Why() {
  return (
    <section className="why section">
      <div className="why__sticky">
        <p className="kicker">Why it matters</p>
        <h2 className="h2" data-split>Good design is a <em>business decision.</em></h2>
        <div className="why__stat">
          <span className="why__num"><Counter value={85} />%</span>
          <p>Efficient storage alone can raise productivity by keeping workspaces organised and distraction-free.</p>
        </div>
      </div>
      <div className="why__cards">
        {whyCards.map(c => (
          <Reveal as="article" key={c.tag} className="wcard" data-reveal>
            <img src={img(c.image)} alt={c.alt} loading="lazy" />
            <div className="wcard__txt">
              <span className="wcard__tag">{c.tag}</span>
              <p>{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
