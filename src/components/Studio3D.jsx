import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { SectionHead } from './ui.jsx';
import { img } from '../data/content.js';
import { useThemeToken } from '../hooks/theme.js';
// plain data (no three.js), so the controls render before the 3D bundle arrives
import { FINISHES, DEFAULT_FINISHES, OFFICES, VIEW_LABELS as VIEWS } from './studio3d/finishes.js';

const Scene = lazy(() => import('./studio3d/Scene.jsx'));
const GROUPS = [['floor', 'Floor'], ['wall', 'Feature wall'], ['fabric', 'Sofa']];
const swatch = id => `${import.meta.env.BASE_URL}3d/tex/${id}/diff.webp`;

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.warn('3D studio unavailable, showing a photo instead.', e); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const Fallback = () => (
  <div className="s3d__fallback">
    <img src={img('spaces/cabin-3.jpg')} alt="Office interior" />
    <p>3D view isn’t supported on this device.</p>
  </div>
);

/** Interactive, realistic 3D office: orbit it, jump between zones, and swap the finishes live. */
export default function Studio3D() {
  const section = useRef(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [webgl, setWebgl] = useState(null);
  const [office, setOffice] = useState('small');
  const viewerBg = useThemeToken('--viewer');
  const [view, setView] = useState('overview');
  const [finishes, setFinishes] = useState(DEFAULT_FINISHES);
  const [evening, setEvening] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState({ dir: 0, n: 0 });
  const [load, setLoad] = useState({ progress: 0, done: false });
  const [mobile] = useState(() => innerWidth < 760);
  const [panelOpen, setPanelOpen] = useState(() => innerWidth > 900); // collapsed on phones and portrait tablets (matches the CSS breakpoint)

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = section.current;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '900px 0px' });
    const onIO = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '150px 0px' });
    nearIO.observe(el); onIO.observe(el);
    return () => { nearIO.disconnect(); onIO.disconnect(); };
  }, []);

  const onProgress = useCallback((progress, done) => {
    setLoad(prev => (prev.done ? prev : { progress: Math.max(prev.progress, progress), done }));
  }, []);
  const stopRotate = useCallback(() => setAutoRotate(false), []);
  const pickOffice = id => { setAutoRotate(false); setOffice(id); setView('overview'); };

  return (
    <section ref={section} className="s3d section" id="design3d">
      <SectionHead kicker="(06) 3D design studio">Your office in 3D, <em>before we build it.</em></SectionHead>
      <p className="s3d__lede">This is how we present every project: a realistic 3D model you can walk around. Pick a project size, drag to look around, jump between zones, and try different finishes.</p>

      <div className="s3d__offices" role="group" aria-label="Project">
        {OFFICES.map(o => (
          <button key={o.id} type="button" className={office === o.id ? 'is-on' : ''} aria-pressed={office === o.id} onClick={() => pickOffice(o.id)}>
            {o.label}<small>{o.size}</small>
          </button>
        ))}
      </div>

      <div className={`s3d__viewer ${load.done ? 'is-ready' : ''}`}>
        {webgl === false && <Fallback />}
        {webgl && near && (
          <Boundary fallback={<Fallback />}>
            <Suspense fallback={null}>
              <Scene background={viewerBg} office={office} view={view} finishes={finishes} evening={evening} autoRotate={autoRotate} active={active} mobile={mobile} zoom={zoom} onProgress={onProgress} onUserMove={stopRotate} />
            </Suspense>
          </Boundary>
        )}

        {webgl !== false && !load.done && (
          <div className="s3d__loading" aria-live="polite">
            <span>Loading 3D office</span>
            <b>{Math.round(load.progress)}%</b>
            <i><em style={{ transform: `scaleX(${load.progress / 100})` }} /></i>
          </div>
        )}

        {/* zone buttons */}
        <div className="s3d__views" role="group" aria-label="Camera views">
          {VIEWS[office].map(v => (
            <button key={v.id} type="button" className={view === v.id ? 'is-on' : ''} aria-pressed={view === v.id} onClick={() => { setAutoRotate(false); setView(v.id); }}>{v.label}</button>
          ))}
        </div>

        {/* right-hand tools */}
        <div className="s3d__tools">
          <button type="button" className="s3d__icon" onClick={() => setZoom(z => ({ dir: 1, n: z.n + 1 }))} aria-label="Zoom in">+</button>
          <button type="button" className="s3d__icon" onClick={() => setZoom(z => ({ dir: -1, n: z.n + 1 }))} aria-label="Zoom out">−</button>
          <button type="button" className={`s3d__icon ${autoRotate ? 'is-on' : ''}`} onClick={() => setAutoRotate(a => !a)} aria-label="Auto-rotate" aria-pressed={autoRotate}>⟳</button>
          <button type="button" className={`s3d__icon ${evening ? 'is-on' : ''}`} onClick={() => setEvening(e => !e)} aria-label={evening ? 'Daylight' : 'Evening lighting'} aria-pressed={evening}>{evening ? '☀' : '☾'}</button>
        </div>

        {/* finish configurator (collapsible on phones) */}
        <button type="button" className={`s3d__toggle ${panelOpen ? 'is-on' : ''}`} aria-expanded={panelOpen} onClick={() => setPanelOpen(o => !o)}>
          {panelOpen ? 'Hide finishes' : 'Change finishes'}
        </button>
        <div className={`s3d__finishes ${panelOpen ? 'is-open' : ''}`}>
          {GROUPS.map(([key, label]) => (
            <div key={key} className="s3d__group">
              <span>{label}: <b>{FINISHES[key].find(f => f.id === finishes[key]).label}</b></span>
              <div>
                {FINISHES[key].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    className={`s3d__swatch ${finishes[key] === f.id ? 'is-on' : ''}`}
                    style={{ backgroundImage: `url(${swatch(f.id)})` }}
                    title={f.label}
                    aria-label={`${label}: ${f.label}`}
                    aria-pressed={finishes[key] === f.id}
                    onClick={() => setFinishes(s => ({ ...s, [key]: f.id }))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="s3d__hint">Drag to look around</p>
      </div>
    </section>
  );
}
