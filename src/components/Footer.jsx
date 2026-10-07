import Logo from './Logo.jsx';
import { Btn } from './ui.jsx';
import { contact, services } from '../data/content.js';

const links = [['about', 'About'], ['services', 'Services'], ['spaces', 'Spaces'], ['design3d', '3D Studio'], ['work', 'Work'], ['client-work', 'Client work'], ['team', 'Team'], ['contact', 'Contact']];
const wa = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hi RC Interior, I would like to discuss an office interior project.')}`;

export default function Footer() {
  return (
    <footer className="footer">
      {/* call to action band */}
      <div className="footer__cta">
        <div>
          <p className="footer__eyebrow">Start a project</p>
          <h2 className="footer__title">Have a space <em>in mind?</em></h2>
          <p className="footer__lede">Tell us about it. We will visit, measure and plan it with you, from first sketch to handover.</p>
        </div>
        <div className="footer__actions">
          <Btn href="#contact">Book a free site visit</Btn>
          <a href={wa} target="_blank" rel="noopener" className="footer__wa">Chat on WhatsApp ↗</a>
        </div>
      </div>

      <div className="footer__grid">
        <div className="footer__brand">
          <Logo className="footer__logo" tagline />
          <p className="footer__tag">Small change, <em>big differences.</em></p>
          <p className="footer__since">Designing and building workplaces across Delhi NCR since 2007.</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h3>Explore</h3>
          <ul>{links.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul>
        </nav>

        <div className="footer__col">
          <h3>Services</h3>
          <ul>{services.map(s => <li key={s.title}><a href="#services">{s.title}</a></li>)}</ul>
        </div>

        <div className="footer__col footer__contact">
          <h3>Contact</h3>
          <ul>
            {contact.phones.map(p => <li key={p.href}><a href={p.href}>{p.label}</a> <small>{p.type}</small></li>)}
            <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          </ul>
          <address>{contact.address.map((l, i) => <span key={l}>{l}{i < contact.address.length - 1 && <br />}</span>)}</address>
        </div>
      </div>

      <div className="footer__word" aria-hidden="true" data-split>RC Interior</div>

      <div className="footer__base">
        <span>© {new Date().getFullYear()} RC Interior, Gurugram</span>
        <a href={contact.website.href}>{contact.website.label}</a>
        <a href="#top" className="footer__top-link">Back to top <i aria-hidden="true">↑</i></a>
      </div>
    </footer>
  );
}
