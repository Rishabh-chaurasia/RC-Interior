const links = [['studio', 'Studio'], ['services', 'Services'], ['spaces', 'Spaces'], ['work', 'Work'], ['team', 'Team'], ['contact', 'Contact']];

export default function Footer() {
  return (
    <footer className="footer" data-nav="dark">
      <div className="footer__top">
        <p className="footer__tag">Small change,<br /><em>big differences.</em></p>
        <nav className="footer__nav" aria-label="Footer">
          {links.map(([id, label]) => <a key={id} href={`#${id}`}><span className="roll" data-text={label}><span>{label}</span></span></a>)}
        </nav>
        <a href="#top" className="round round--light" aria-label="Back to top">↑</a>
      </div>
      <div className="footer__word" aria-hidden="true" data-split>RC Interior</div>
      <div className="footer__base">
        <span>© {new Date().getFullYear()} RC Interior, Gurugram</span>
        <span>Corporate · Retail · Turnkey · Renovation · R&amp;M</span>
        <a href="https://www.rcinterior.co.in">www.rcinterior.co.in</a>
      </div>
    </footer>
  );
}
