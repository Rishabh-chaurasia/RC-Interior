import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isDesktop = () => innerWidth > 900;

const ScrollContext = createContext(null);

/** Runs Lenis smooth scrolling and lets components subscribe to scroll/resize ticks. */
export function ScrollProvider({ children }) {
  const subscribers = useRef(new Set());
  const lenisRef = useRef(null);

  useEffect(() => {
    const emit = () => subscribers.current.forEach(fn => fn());
    let raf = 0;
    if (!prefersReducedMotion()) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on('scroll', emit);
      lenis.on('scroll', ScrollTrigger.update); // keep GSAP scroll animations in sync with smooth scroll
      const loop = t => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    } else {
      addEventListener('scroll', emit, { passive: true });
    }
    addEventListener('resize', emit);
    addEventListener('load', emit);
    return () => {
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      removeEventListener('scroll', emit);
      removeEventListener('resize', emit);
      removeEventListener('load', emit);
    };
  }, []);

  const api = useMemo(() => ({
    subscribe(fn) {
      subscribers.current.add(fn);
      fn();
      return () => subscribers.current.delete(fn);
    },
    scrollTo(target) {
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.4 });
      else if (typeof target === 'number') scrollTo({ top: target, behavior: 'smooth' });
      else target.scrollIntoView({ behavior: 'smooth' });
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }), []);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export const useScrollApi = () => useContext(ScrollContext);

/** Calls `fn` on every scroll/resize tick (and once on mount). Always uses the latest `fn`. */
export function useOnScroll(fn) {
  const api = useScrollApi();
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => api.subscribe(() => fnRef.current()), [api]);
}
