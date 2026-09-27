import { useEffect, useState } from 'react';

/** True once the element has entered the viewport (never resets). */
export function useInView(ref, { rootMargin = '0px 0px -10% 0px', threshold = 0 } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, inView]);
  return inView;
}
