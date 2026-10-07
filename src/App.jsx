import { useCallback, useEffect, useState } from 'react';
import { ScrollProvider, useScrollApi } from './hooks/scroll.jsx';
import { setupMotion } from './hooks/motion.js';
import { contact } from './data/content.js';
import Loader from './components/Loader.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Studio from './components/Studio.jsx';
import Values from './components/Values.jsx';
import Services from './components/Services.jsx';
import Spaces from './components/Spaces.jsx';
import Studio3D from './components/Studio3D.jsx';
import Showcase3D from './components/Showcase3D.jsx';
import Why from './components/Why.jsx';
import Work from './components/Work.jsx';
import ClientRing from './components/ClientRing.jsx';
import Materials from './components/Materials.jsx';
import Process from './components/Process.jsx';
import Testimonials from './components/Testimonials.jsx';
import { ClientWall, Team, Csr, Cta } from './components/People.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { Grain, Cursor, Lightbox, WhatsAppButton } from './components/Overlays.jsx';

function Site() {
  const scroll = useScrollApi();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { images, index, heading?, sub? }
  const onLoaded = useCallback(() => setReady(true), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback(d => setLightbox(l => l && { ...l, index: (l.index + d + l.images.length) % l.images.length }), []);

  // Page-level state lives on <body> because the CSS keys off these classes
  useEffect(() => {
    const b = document.body.classList;
    b.toggle('is-loading', !ready);
    b.toggle('is-ready', ready);
    b.toggle('menu-open', menuOpen);
  }, [ready, menuOpen]);

  // Start all GSAP motion (split headings, curtains, parallax, magnetic, tilt…) once the loader lifts
  useEffect(() => {
    if (!ready) return;
    return setupMotion();
  }, [ready]);

  // Pause smooth scroll while the menu or lightbox covers the page
  useEffect(() => {
    if (menuOpen || lightbox) scroll.stop(); else scroll.start();
  }, [menuOpen, lightbox, scroll]);

  // Every in-page "#section" link: close the menu and smooth-scroll there
  useEffect(() => {
    const onClick = e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      setMenuOpen(false);
      scroll.start();
      scroll.scrollTo(target);
    };
    const onKey = e => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('click', onClick);
    addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); removeEventListener('keydown', onKey); };
  }, [scroll]);

  return (
    <>
      <Loader onDone={onLoaded} />
      <Grain />
      <Cursor />
      <Nav menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      <main>
        <Hero ready={ready} />
        <Studio />
        <Marquee />
        <Showcase3D />
        <Values />
        <Services />
        <Spaces onOpenGallery={setLightbox} />
        <Studio3D />
        <Why />
        <Work onOpenImage={setLightbox} />
        <ClientRing onOpenImage={setLightbox} viewerOpen={!!lightbox} />
        <Materials />
        <Process />
        <Testimonials />
        <ClientWall onOpenCase={setLightbox} />
        <Team />
        <Csr />
        <Cta phone={contact.phones[0]} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Lightbox data={lightbox} onClose={closeLightbox} onStep={stepLightbox} />
    </>
  );
}

export default function App() {
  return (
    <ScrollProvider>
      <Site />
    </ScrollProvider>
  );
}
