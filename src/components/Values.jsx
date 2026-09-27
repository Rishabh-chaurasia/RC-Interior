import { values } from '../data/content.js';
import { Reveal, SectionHead } from './ui.jsx';

export default function Values() {
  return (
    <section className="values section section--dark" data-nav="dark">
      <SectionHead kicker="(03) What we stand for">Four values, <em>every project.</em></SectionHead>
      <div className="values__grid">
        {values.map((v, i) => (
          <Reveal as="article" key={v.title} className="value">
            <span className="value__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
