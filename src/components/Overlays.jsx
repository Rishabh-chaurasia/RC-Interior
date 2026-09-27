import { useEffect, useRef, useState } from 'react';
import { contact } from '../data/content.js';
import { prefersReducedMotion } from '../hooks/scroll.jsx';

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

/** Lime dot that trails the mouse; grows to "View" over project images. Desktop only. */
export function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || prefersReducedMotion()) return;
    const cur = ref.current;
    let cx = 0, cy = 0, mx = 0, my = 0, raf;
    const move = e => {
      if (!cur.classList.contains('is-on')) { cx = e.clientX; cy = e.clientY; cur.classList.add('is-on'); }
      mx = e.clientX; my = e.clientY;
    };
    const leave = () => cur.classList.remove('is-on');
    const over = e => {
      const view = e.target.closest('[data-lightbox]');
      const link = !view && e.target.closest('a, button, label, .panel');
      cur.classList.toggle('is-view', !!view);
      cur.classList.toggle('is-link', !!link);
    };
    const loop = () => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseover', over);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseover', over);
    };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true"><span>View</span></div>;
}

/**
 * Full-screen viewer. `data` = { images: [{ src, alt, title }], index, heading?, sub? }.
 * With more than one image it becomes a gallery: arrows, ← / → keys, swipe, and a counter.
 */
export function Lightbox({ data, onClose, onStep }) {
  const open = !!data;
  const count = open ? data.images.length : 0;
  const multi = count > 1;
  const current = open ? data.images[data.index] : null;
  const touchX = useRef(null);

  useEffect(() => {
    if (!open) return;
    const key = e => {
      if (e.key === 'Escape') onClose();
      else if (multi && e.key === 'ArrowRight') onStep(1);
      else if (multi && e.key === 'ArrowLeft') onStep(-1);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [open, multi, onClose, onStep]);

  // preload the neighbours so arrowing through a gallery feels instant
  useEffect(() => {
    if (!multi) return;
    [1, -1].forEach(d => { const im = new Image(); im.src = data.images[(data.index + d + count) % count].src; });
  }, [multi, data, count]);

  // slideshow: galleries opened with `autoplay` advance on their own; any manual step restarts the timer
  const [paused, setPaused] = useState(false);
  useEffect(() => { setPaused(false); }, [open]);
  useEffect(() => {
    if (!open || !multi || !data.autoplay || paused) return;
    const t = setTimeout(() => onStep(1), 4000);
    return () => clearTimeout(t);
  }, [open, multi, data, paused, onStep]);

  const onBackdrop = e => { if (e.target === e.currentTarget) onClose(); };
  return (
    <div
      className={`lightbox ${open ? 'on' : ''} ${multi ? 'lightbox--gallery' : ''}`}
      aria-hidden={!open}
      role={open ? 'dialog' : undefined}
      aria-modal={open || undefined}
      aria-label={open ? (data.heading || 'Image viewer') : undefined}
      onClick={onBackdrop}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (!multi || touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {open && data.heading && (
        <header className="lightbox__head">
          <b>{data.heading}</b>
          {data.sub && <span>{data.sub}</span>}
        </header>
      )}
      <button className="lightbox__close round round--light" aria-label="Close" onClick={onClose}>✕</button>
      {current && <img key={current.src} src={current.src} alt={current.alt} />}
      {multi && (
        <>
          <button className="lightbox__nav lightbox__nav--prev round round--light" aria-label="Previous photo" onClick={() => onStep(-1)}>←</button>
          <button className="lightbox__nav lightbox__nav--next round round--light" aria-label="Next photo" onClick={() => onStep(1)}>→</button>
          {/* thumbnail strip + slideshow progress */}
          <div className="lightbox__thumbs">
            {data.images.map((im, i) => (
              <button
                key={im.src}
                type="button"
                className={i === data.index ? 'is-on' : ''}
                aria-label={`Photo ${i + 1}`}
                onClick={() => { setPaused(true); onStep(i - data.index); }}
              >
                <img src={im.src} alt="" loading="lazy" />
                {i === data.index && data.autoplay && !paused && <i key={data.index} className="lightbox__timer" />}
              </button>
            ))}
            {data.autoplay && (
              <button type="button" className="lightbox__play" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
                {paused ? '▶' : '❚❚'}
              </button>
            )}
          </div>
        </>
      )}
      {open && (current.title || multi) && (
        <p className="lightbox__caption">
          {current.title && <span>{current.title}</span>}
          {multi && <b>{String(data.index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</b>}
        </p>
      )}
    </div>
  );
}

export function WhatsAppButton() {
  const text = encodeURIComponent('Hi RC Interior, I’d like to discuss an office interior project.');
  return (
    <a className="wa" href={`https://wa.me/${contact.whatsapp}?text=${text}`} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2l-1 1.2c-.2.2-.4.3-.7.1a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6 0-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.6-.4Z" /></svg>
    </a>
  );
}
