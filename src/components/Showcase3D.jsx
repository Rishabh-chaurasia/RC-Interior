import { Component, Suspense, lazy, useEffect, useState } from 'react';
import { SectionHead } from './ui.jsx';

const Scene3D = lazy(() => import('./3d/Scene3D.jsx'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

/** Swallows WebGL/Three.js runtime errors so a driver quirk on one visitor's machine can't blank the page. */
class Canvas3DBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.warn('3D scene failed to render, falling back to a static image.', err); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function StaticFallback() {
  return (
    <div className="scene3d__static" role="img" aria-label="A desk, chair, lamp, shelf and plant, rendered in 3D">
      <svg viewBox="0 0 200 120" aria-hidden="true">
        <rect x="20" y="70" width="90" height="6" rx="2" fill="#9c6b43" />
        <rect x="28" y="76" width="6" height="30" fill="#221b17" />
        <rect x="94" y="76" width="6" height="30" fill="#221b17" />
        <rect x="130" y="60" width="34" height="46" fill="#221b17" opacity=".85" />
        <circle cx="150" cy="50" r="6" fill="#cddc2f" />
        <rect x="149" y="50" width="2" height="16" fill="#221b17" />
      </svg>
    </div>
  );
}

/** Section-level gate: skips the 3D bundle entirely on devices with no WebGL, or if it errors at runtime. */
export default function Showcase3D() {
  const [ready, setReady] = useState(null); // null = checking, true/false after
  useEffect(() => setReady(hasWebGL()), []);

  return (
    <section className="showcase3d section section--dark" data-nav="dark">
      <SectionHead kicker="(05) Explore in 3D">Step inside, <em>in three dimensions.</em></SectionHead>
      <div className="scene3d">
        {ready === false && <StaticFallback />}
        {ready && (
          <Canvas3DBoundary fallback={<StaticFallback />}>
            <Suspense fallback={<div className="scene3d__loading">Loading 3D scene…</div>}>
              <Scene3D />
            </Suspense>
          </Canvas3DBoundary>
        )}
        <p className="scene3d__hint">Drag to rotate · scroll to continue</p>
      </div>
    </section>
  );
}
