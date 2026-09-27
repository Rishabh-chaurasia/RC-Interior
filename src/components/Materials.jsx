import { materials, img } from '../data/content.js';
import { Reveal } from './ui.jsx';

export default function Materials() {
  return (
    <section className="materials section">
      <div className="materials__head">
        <div>
          <p className="kicker">(09) Material library</p>
          <h2 className="h2" data-split>Textures that <em>tell stories.</em></h2>
        </div>
        <Reveal as="p" className="materials__lede">We pick every finish by hand: how it looks under office light, how it wears after five years, and how it feels when you touch it.</Reveal>
      </div>
      <div className="swatches">
        {materials.map((m, i) => (
          <Reveal as="figure" key={m.name} className="swatch">
            <div className="swatch__tex" data-reveal="noimg" data-radius="18px" data-delay={i * 0.08} style={{ backgroundImage: `url(${img(m.image)})`, '--pos': m.pos, '--zoom': m.zoom }} />
            <figcaption><b>{m.name}</b><span>{m.use}</span></figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
