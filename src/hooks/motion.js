import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { prefersReducedMotion } from './scroll.jsx';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger };

/*
  All page motion lives here and is driven by data attributes / class names in the markup:
    [data-split]            heading: letters slide up out of a mask when scrolled into view
    [data-split="hero"]     hero heading: same, but plays immediately after the loader
    [data-reveal]           image block: "curtain" wipe up + photo settles from a zoom
    [data-reveal="noimg"]   curtain only (for images that already have their own hover zoom)
    img[data-parallax=N]    image drifts ±N% and slowly un-zooms while scrolling past
  plus magnetic buttons, 3D tilt cards, velocity skew, section colour shifts and hero mouse parallax.
  Returns a cleanup function.
*/
export function setupMotion() {
  const reduce = prefersReducedMotion();
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cleanups = [];
  const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); cleanups.push(() => el.removeEventListener(type, fn, opts)); };

  if (reduce) {
    // Reduced motion: nothing moves, but headings and images still fade in gently
    const soft = gsap.context(() => {
      gsap.set('.progress', { display: 'none' });
      // (.reveal elements already fade in via CSS, so they're left alone here)
      gsap.utils.toArray('[data-split], [data-reveal]:not(.reveal)').forEach(el => {
        gsap.set(el, { visibility: 'visible' });
        gsap.from(el, { opacity: 0, duration: 0.9, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    });
    return () => soft.revert();
  }

  let dead = false;
  const splits = [];
  const splitOpts = { type: 'lines,words,chars', mask: 'lines', linesClass: 'split-line', charsClass: 'char' };

  /* ---------- split-letter headings (after fonts load, so line breaks are final) ---------- */
  const splitHeadings = () => {
    if (dead) return;
    ctx.add(() => {
      document.querySelectorAll('[data-split]').forEach(el => {
        const hero = el.dataset.split === 'hero';
        const split = SplitText.create(el, splitOpts);
        splits.push(split);
        gsap.set(el, { visibility: 'visible' });
        gsap.from(split.chars, {
          yPercent: 115,
          rotate: hero ? 4 : 7,
          duration: hero ? 1.3 : 1.1,
          ease: 'expo.out',
          stagger: hero ? 0.028 : 0.014,
          delay: hero ? 0.2 : 0,
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
      });
    });
  };
  // line breaks change with width: re-split (without replaying) after a resize settles
  let lastW = innerWidth, resizeTimer;
  const onResize = () => {
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      splits.forEach(s => { s.revert(); s.split(splitOpts); gsap.set(s.chars, { clearProps: 'transform' }); });
      ScrollTrigger.refresh();
    }, 250);
  };

  const ctx = gsap.context(() => {

    /* ---------- curtain image reveals ---------- */
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      const r = el.dataset.radius || '22px';
      const img = el.dataset.reveal === 'noimg' ? null : el.querySelector('img:not([data-parallax])');
      const tl = gsap.timeline({ delay: +el.dataset.delay || 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      tl.fromTo(el,
        { clipPath: `inset(100% 0% 0% 0% round ${r})` },
        { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' });
      if (img) {
        gsap.set(img, { transition: 'none' });
        tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform,transition' }, 0);
      }
    });

    // project photos in the horizontal gallery open one after another as the section arrives
    gsap.fromTo('.proj figure',
      { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'expo.inOut', stagger: 0.09, clearProps: 'clipPath',
        scrollTrigger: { trigger: '.work', start: 'top 65%', once: true } });

    /* ---------- scroll parallax + zoom-out ---------- */
    gsap.utils.toArray('img[data-parallax]').forEach(img => {
      const s = +img.dataset.parallax || 8;
      gsap.fromTo(img, { yPercent: -s / 2, scale: 1.18 }, {
        yPercent: s / 2, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* ---------- section colour shift: Services melts into the dark Spaces section below it ----------
       (only used where the section's heading has already scrolled away, so text never sits on a half-dark background) */
    [['.services', '.spaces', '#1f1915']].forEach(([from, into, colour]) => {
      gsap.to(from, {
        backgroundColor: colour, color: '#f2ede5', ease: 'none',
        scrollTrigger: { trigger: into, start: 'top bottom', end: 'top 35%', scrub: true },
      });
    });

    /* ---------- 3D flip-in: cards swing up from a tilted plane as they enter ----------
       (uses the `rotate`/`translate` CSS properties so it never fights the fade-up transform) */
    gsap.utils.toArray('.bento .card, .why__cards .wcard, .team__grid .member, .swatches .swatch, .steps .step').forEach((el, i) => {
      const st = { a: 60, z: -160 };
      const apply = () => {
        el.style.rotate = st.a > 0.05 ? `1 0 0 ${st.a.toFixed(2)}deg` : '';
        el.style.translate = st.z < -0.5 ? `0 0 ${st.z.toFixed(1)}px` : '';
      };
      apply();
      gsap.to(st, {
        a: 0, z: 0, duration: 1.4, ease: 'expo.out', delay: (i % 3) * 0.08, onUpdate: apply,
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      });
    });

    /* ---------- scroll progress line ---------- */
    gsap.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* ---------- velocity: images lean, marquee speeds up / reverses ---------- */
    const skews = gsap.utils.toArray('.proj figure').map(t => gsap.quickTo(t, 'skewY', { duration: 0.6, ease: 'power3' }));
    const rows = gsap.utils.toArray('.marquee__row');
    let dir = 1;
    ScrollTrigger.create({
      onUpdate(self) {
        const v = self.getVelocity();
        const skew = gsap.utils.clamp(-5, 5, v / -350);
        skews.forEach(s => s(skew));
        if (self.direction) dir = self.direction;
        const rate = dir * (1 + Math.min(Math.abs(v) / 600, 4));
        rows.forEach(r => r.getAnimations().forEach(a => { a.playbackRate = rate; }));
      },
    });
    const settle = () => {
      skews.forEach(s => s(0));
      rows.forEach(r => r.getAnimations().forEach(a => gsap.to(a, { playbackRate: dir, duration: 0.8, ease: 'power2.out' })));
    };
    ScrollTrigger.addEventListener('scrollEnd', settle);
    cleanups.push(() => ScrollTrigger.removeEventListener('scrollEnd', settle));
  });

  /* ---------- pointer-only effects ---------- */
  if (fine) {
    // magnetic buttons (uses the `translate` property so it never fights CSS transforms)
    document.querySelectorAll('.btn, .round, .wa, .nav__toggle').forEach(el => {
      const st = { x: 0, y: 0 };
      const apply = () => { el.style.translate = `${st.x.toFixed(2)}px ${st.y.toFixed(2)}px`; };
      on(el, 'mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(st, { x: (e.clientX - (r.left + r.width / 2)) * 0.32, y: (e.clientY - (r.top + r.height / 2)) * 0.42, duration: 0.6, ease: 'power3.out', overwrite: true, onUpdate: apply });
      });
      on(el, 'mouseleave', () => gsap.to(st, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.35)', overwrite: true, onUpdate: apply }));
    });

    // 3D tilt (uses the `rotate` axis-angle property, again independent of CSS transforms)
    document.querySelectorAll('.card:not(.card--lime), .wcard, .member, .swatch__tex').forEach(el => {
      const st = { rx: 0, ry: 0 };
      const apply = () => {
        const a = Math.hypot(st.rx, st.ry);
        el.style.rotate = a < 0.02 ? 'none' : `${(st.rx / a).toFixed(3)} ${(st.ry / a).toFixed(3)} 0 ${a.toFixed(2)}deg`;
      };
      on(el, 'mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(st, { rx: -py * 9, ry: px * 9, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: apply });
      });
      on(el, 'mouseleave', () => gsap.to(st, { rx: 0, ry: 0, duration: 0.9, ease: 'power3.out', overwrite: true, onUpdate: apply }));
    });

    // hero: photo and heading tilt in 3D in opposite directions with the mouse (depth)
    const hero = document.querySelector('.hero');
    const slides = document.querySelector('.hero__slides');
    const title = document.querySelector('.hero__title');
    if (hero && slides && title) {
      const st = { x: 0, y: 0 };
      const tilt = (el, rx, ry) => {
        const a = Math.hypot(rx, ry);
        el.style.rotate = a < 0.02 ? 'none' : `${(rx / a).toFixed(3)} ${(ry / a).toFixed(3)} 0 ${a.toFixed(2)}deg`;
      };
      slides.style.scale = '1.07'; // so tilted edges never show the background
      const apply = () => {
        slides.style.translate = `${(st.x * -14).toFixed(2)}px ${(st.y * -10).toFixed(2)}px`;
        title.style.translate = `${(st.x * 16).toFixed(2)}px ${(st.y * 8).toFixed(2)}px`;
        tilt(slides, st.y * -4, st.x * 6);
        tilt(title, st.y * 5, st.x * -8);
      };
      on(hero, 'mousemove', e => gsap.to(st, { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5, duration: 1.2, ease: 'power3.out', overwrite: true, onUpdate: apply }));
      on(hero, 'mouseleave', () => gsap.to(st, { x: 0, y: 0, duration: 1.2, ease: 'power3.out', overwrite: true, onUpdate: apply }));
    }
  }

  // layout settles after fonts/images; split headings and recompute trigger positions then
  const refresh = () => ScrollTrigger.refresh();
  on(window, 'load', refresh);
  on(window, 'resize', onResize);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { splitHeadings(); refresh(); });

  return () => { dead = true; clearTimeout(resizeTimer); cleanups.forEach(fn => fn()); ctx.revert(); };
}
