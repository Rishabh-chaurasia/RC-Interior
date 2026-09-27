import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { STOPS, ZONES, stopFromProgress } from './3d/stops.js';
import { useOnScroll, useScrollApi, prefersReducedMotion } from '../hooks/scroll.jsx';
import { img } from '../data/content.js';
import { Btn } from './ui.jsx';

const Walkthrough = lazy(() => import('./3d/Walkthrough.jsx'));
const pad = n => String(n).padStart(2, '0');
const LAST = STOPS.length - 1;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Catches WebGL/driver errors so one visitor's GPU quirk falls back to a photo instead of blanking the page. */
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('3D walkthrough unavailable, showing a photo instead.', err); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const Poster = () => <img className="walk__poster" src={img('atrium.jpg')} alt="" />;

/**
 * Pinned 3D walkthrough: the section is several screens tall, the stage sticks to the viewport,
 * and scroll progress drives the camera through the office (see 3d/stops.js).
 */
export default function Showcase3D() {
  const section = useRef(null);
  const bar = useRef(null);
  const progress = useRef(0);
  const labels = useRef([]);
  const scroll = useScrollApi();
  const [webgl, setWebgl] = useState(null);   // null until checked
  const [near, setNear] = useState(false);    // start loading the 3D chunk when the section is close
  const [active, setActive] = useState(false); // render frames only while on screen
  const [stop, setStop] = useState({ index: 0, parked: true, start: true });
  const [env] = useState(() => ({ reduced: prefersReducedMotion(), mobile: innerWidth < 700 }));

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = section.current;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1200px 0px' });
    const onIO = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px 0px' });
    nearIO.observe(el); onIO.observe(el);
    return () => { nearIO.disconnect(); onIO.disconnect(); };
  }, []);

  useOnScroll(() => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    progress.current = p;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    const s = stopFromProgress(p);
    const index = Math.round(s);
    const parked = Math.abs(s - index) < 0.2;
    setStop(prev => (prev.index === index && prev.parked === parked && prev.start === (p < 0.015) ? prev : { index, parked, start: p < 0.015 }));
  });

  // scroll so the camera parks at stop k
  const jump = useCallback(k => {
    const el = section.current;
    const top = el.getBoundingClientRect().top + scrollY;
    const total = el.offsetHeight - innerHeight;
    scroll.scrollTo(top + (k / LAST) * total + 2);
  }, [scroll]);

  const current = STOPS[stop.index];
  const showLabels = stop.parked && (stop.index === 0 || stop.index === LAST);

  return (
    <section ref={section} className="walk" id="walkthrough" data-nav="dark" style={{ '--stops': LAST }}>
      <div className="walk__pin">
        <div className="walk__stage">
          {webgl === false && <Poster />}
          {webgl && near && (
            <Boundary fallback={<Poster />}>
              <Suspense fallback={<><Poster /><p className="walk__loading">Loading 3D floor…</p></>}>
                <Walkthrough progress={progress} active={active} labels={labels} reduced={env.reduced} mobile={env.mobile} />
              </Suspense>
            </Boundary>
          )}
        </div>
        <div className="walk__shade" aria-hidden="true" />

        {/* zone labels: DOM buttons, moved each frame to follow their 3D positions */}
        {webgl && (
          <div className="walk__labels">
            {ZONES.map((z, i) => (
              <button
                key={z.label}
                ref={el => { labels.current[i] = el; }}
                type="button"
                className={`zone-pin ${showLabels ? 'is-on' : ''}`}
                onClick={() => jump(z.stop)}
                tabIndex={showLabels ? 0 : -1}
                aria-hidden={!showLabels}
              >
                <i aria-hidden="true" />{z.label}
              </button>
            ))}
          </div>
        )}

        <header className={`walk__head ${stop.index === 0 ? 'is-on' : ''}`}>
          <p className="kicker">(01) Walk through in 3D</p>
          <h2 className="walk__title" data-split>Step inside, <em>floor by floor.</em></h2>
        </header>

        <div className={`walk__caption ${stop.parked ? 'is-on' : ''}`} aria-live="polite">
          <span className="walk__num">{pad(stop.index + 1)} / {pad(STOPS.length)}</span>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          {current.cta && <Btn href="#contact" variant="lime">Plan my floor in 3D</Btn>}
        </div>

        <ol className="walk__steps" aria-label="Walkthrough stops">
          {STOPS.map((s, i) => (
            <li key={s.key}>
              <button type="button" className={i === stop.index ? 'is-on' : ''} onClick={() => jump(i)} aria-current={i === stop.index || undefined}>
                <b>{pad(i + 1)}</b><span>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <p className={`walk__hint ${stop.start ? 'is-on' : ''}`}>Scroll to walk through <i aria-hidden="true">↓</i></p>
        <div className="walk__bar" aria-hidden="true"><span ref={bar} /></div>
      </div>
    </section>
  );
}
