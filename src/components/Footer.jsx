import Logo from './Logo.jsx';
import LogoBuild from './LogoBuild.jsx';
import { contact, services } from '../data/content.js';

const links = [['about', 'About'], ['services', 'Services'], ['spaces', 'Spaces'], ['design3d', '3D Studio'], ['work', 'Work'], ['client-work', 'Client work'], ['team', 'Team'], ['contact', 'Contact']];

export default function Footer() {
  return (
    <footer className="footer">
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

      <LogoBuild />

      <div className="footer__base">
        <span>© {new Date().getFullYear()} RC Interior, Gurugram</span>
        <a href={contact.website.href}>{contact.website.label}</a>
        <a href="#top" className="footer__top-link">Back to top <i aria-hidden="true">↑</i></a>
      </div>
    </footer>
  );
}
