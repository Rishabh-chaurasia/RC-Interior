import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { clientWork, SAMPLE } from '../data/clientWork.js';
import { prefersReducedMotion } from '../hooks/scroll.jsx';

const TAU = Math.PI * 2;
const AUTO_SPEED = 0.07;                         // radians per second
const signed = a => { a = ((a % TAU) + TAU) % TAU; return a > Math.PI ? a - TAU : a; }; // to -π…π

/**
 * Ring geometry for a stage `w` px wide. The ring is an ellipse (a circle seen from slightly above);
 * the centre is kept clear for the preview, sized to sit between the back and front rows.
 */
function layoutFor(w, items) {
  const narrow = w < 700;
  const cw = Math.round(Math.min(96, Math.max(40, w * 0.062)));
  const ch = Math.round(cw * 1.42);
  const rx = w / 2 - cw * 0.62;
  const ry = rx * (narrow ? 0.9 : 0.3);
  const cy = ry + ch * 0.4 + 6;                  // back row (scaled down) clears the top edge
  const height = Math.round(cy + ry + ch * 0.5 + 10);
  // preview: below the back row, above the front row
  const top = cy - ry + ch * 0.25;
  const bottom = cy + ry - ch * 0.5 - 10;
  const cap = narrow ? 88 : 74;
  let ih = bottom - top - cap, iw = ih * 1.5;
  const maxW = Math.min(w * (narrow ? 0.6 : 0.36), 560);
  if (iw > maxW) { iw = maxW; ih = iw / 1.5; }
  // enough cards to read as a continuous ring: the projects repeat around it
  const perimeter = TAU * Math.sqrt((rx * rx + ry * ry) / 2);
  const reps = Math.max(1, Math.min(4, Math.round(perimeter / (cw * 0.42) / items)));
  return { w, cw, ch, rx, ry, cy, height, count: items * reps, preview: { w: iw, h: ih, left: (w - iw) / 2, top: top + (bottom - top - ih - cap) / 2 } };
}

/**
 * "Our client work": project images on a slowly turning 3D ring. Hover (or tap) a card to preview it
 * in the centre, drag or swipe to spin, click the preview for the full-screen viewer.
 */
export default function ClientRing({ onOpenImage, viewerOpen }) {
  const items = clientWork;
  const n = items.length;
  const wrap = useRef(null);
  const stage = useRef(null);
  const cards = useRef([]);
  const [layout, setLayout] = useState(null);
  const [active, setActive] = useState(null);     // item shown in the centre
  const [focusIdx, setFocusIdx] = useState(0);    // roving tab stop
  const [playing, setPlaying] = useState(true);
  const [layers, setLayers] = useState([]);       // cross-fading preview images

  // motion state lives in refs so the animation loop never re-renders React
  const m = useRef({ rot: 0, vel: 0, target: null, hover: false, focus: false, drag: null, inView: false, viewer: false, playing: true, reduced: false });

  useEffect(() => {
    const reduced = prefersReducedMotion();
    m.current.reduced = reduced;
    if (reduced) setPlaying(false);
  }, []);
  useEffect(() => { m.current.playing = playing; }, [playing]);
  useEffect(() => { m.current.viewer = viewerOpen; }, [viewerOpen]);

  useLayoutEffect(() => {
    const el = stage.current;
    const ro = new ResizeObserver(([e]) => setLayout(l => (l && l.w === Math.round(e.contentRect.width) ? l : layoutFor(Math.round(e.contentRect.width), n))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  // which item each card shows, and the first card of each item (the one keyboard focus uses)
  const ring = useMemo(() => (layout ? Array.from({ length: layout.count }, (_, k) => ({ k, i: k % n, primary: k < n })) : []), [layout, n]);
  const angleOf = useCallback(k => (k / ring.length) * TAU, [ring.length]);

  /** Position every card for the current rotation. */
  const draw = useCallback(() => {
    if (!layout) return;
    const { rx, ry, cy, w, cw, ch } = layout;
    const { rot } = m.current;
    for (let k = 0; k < ring.length; k++) {
      const el = cards.current[k];
      if (!el) continue;
      const a = angleOf(k) + rot;
      const s = Math.sin(a), c = Math.cos(a);
      const t = (c + 1) / 2;                       // 0 at the back, 1 at the front
      const x = w / 2 + rx * s - cw / 2, y = cy + ry * c - ch / 2;
      const turn = -Math.asin(s) * 0.78;           // upright, angled along the ring
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(0.52 + 0.48 * t).toFixed(3)}) perspective(700px) rotateY(${turn.toFixed(3)}rad)`;
      el.style.opacity = (0.36 + 0.64 * t ** 1.3).toFixed(3);
      el.style.zIndex = String(Math.round(t * 1000));
    }
  }, [layout, ring.length, angleOf]);

  useLayoutEffect(draw, [draw]);

  // animation loop, only while the gallery is on screen
  useEffect(() => {
    let raf, last = performance.now();
    const io = new IntersectionObserver(([e]) => { m.current.inView = e.isIntersecting; if (e.isIntersecting) { last = performance.now(); loop(last); } }, { rootMargin: '100px 0px' });
    const loop = now => {
      cancelAnimationFrame(raf);
      const st = m.current;
      if (!st.inView) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const held = st.hover || st.focus || st.drag || st.viewer;
      if (st.target != null) {
        const d = signed(st.target - st.rot);
        st.rot += st.reduced ? d : d * Math.min(1, dt * 7);
        if (Math.abs(d) < 0.0005) st.target = null;
      } else if (!st.drag) {
        st.rot += st.vel * dt;
        st.vel *= Math.exp(-dt * 3.2);
        if (Math.abs(st.vel) < 0.002) st.vel = 0;
        // reduced motion starts paused; pressing Play is an explicit opt-in
        if (!held && st.playing && !st.vel) st.rot += AUTO_SPEED * dt;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    io.observe(wrap.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [draw]);

  // cross-fade: each newly selected item becomes a new top layer; older layers fade out and are dropped
  useEffect(() => {
    if (active == null) return;
    setLayers(ls => (ls.length && ls[ls.length - 1].i === active ? ls : [...ls.slice(-2), { i: active, key: `${active}-${performance.now()}` }]));
  }, [active]);
  useEffect(() => {
    if (layers.length < 2) return;
    const t = setTimeout(() => setLayers(ls => ls.slice(-1)), 600);
    return () => clearTimeout(t);
  }, [layers]);

  const bringToFront = i => {
    const st = m.current;
    st.vel = 0;
    st.target = st.rot + signed(-angleOf(i) - st.rot);
  };
  const open = i => onOpenImage({
    images: items.map(it => ({ src: it.src, alt: it.alt, title: `${it.client} · ${it.title}` })),
    index: i,
    heading: 'Our client work',
    sub: SAMPLE ? 'Sample design concepts' : undefined,
  });
  const clear = () => { m.current.hover = false; if (!m.current.focus) setActive(null); };

  /* ---------- pointer: hover to preview, drag / swipe to spin, tap to preview on touch ---------- */
  const lastPointer = useRef('mouse');
  const onPointerDown = e => {
    lastPointer.current = e.pointerType;
    if (e.button !== 0) return;
    m.current.drag = { x: e.clientX, start: e.clientX, t: performance.now(), moved: false };
    m.current.dragged = false;
    m.current.target = null;
  };
  useEffect(() => {
    const move = e => {
      const d = m.current.drag;
      if (!d || !layout) return;
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(e.clientX - d.start) > 6) d.moved = true;
      if (!d.moved) return;
      const now = performance.now();
      const da = dx / layout.rx;
      m.current.rot += da;
      m.current.vel = da / Math.max(0.008, (now - d.t) / 1000);
      d.x = e.clientX; d.t = now;
    };
    const up = () => {
      const d = m.current.drag;
      if (!d) return;
      if (!d.moved) m.current.vel = 0;
      else if (m.current.reduced) m.current.vel = 0;
      m.current.drag = null;
      m.current.dragged = d.moved; // read by the click that follows
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); };
  }, [layout]);

  const onCardOver = e => {
    if (e.pointerType !== 'mouse' || m.current.drag?.moved) return;
    const el = e.target.closest('[data-item]');
    if (!el) return;
    m.current.hover = true;
    setActive(+el.dataset.item);
  };
  const onCardClick = (i, k) => e => {
    if (m.current.dragged) { m.current.dragged = false; e.preventDefault(); return; }
    if (lastPointer.current === 'mouse' || e.detail === 0) open(i); // mouse click or keyboard: enlarge
    else { m.current.hover = true; setActive(i); bringToFront(k); }  // tap: preview it in the centre
  };

  // a tap anywhere outside the gallery lets the ring turn again on touch screens
  useEffect(() => {
    const down = e => { if (!wrap.current.contains(e.target) && !m.current.viewer) clear(); };
    addEventListener('pointerdown', down);
    return () => removeEventListener('pointerdown', down);
  });

  /* ---------- keyboard: arrows browse, Enter enlarges ---------- */
  const focusItem = i => {
    setFocusIdx(i);
    cards.current[i]?.focus({ preventScroll: true });
  };
  const onKeyDown = e => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) { e.preventDefault(); focusItem((focusIdx + keys[e.key] + n) % n); }
    else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
    else if (e.key === 'End') { e.preventDefault(); focusItem(n - 1); }
  };
  const onFocusCard = i => () => { m.current.focus = true; setFocusIdx(i); setActive(i); bringToFront(i); };
  const onBlurWrap = e => {
    if (wrap.current.contains(e.relatedTarget)) return;
    m.current.focus = false;
    if (!m.current.hover) setActive(null);
  };

  const shown = active != null ? items[active] : null;
  const pv = layout?.preview;

  return (
    <section className="cring section" id="client-work" aria-labelledby="cring-title">
      <header className="cring__head">
        <p className="kicker">Client work</p>
        <h2 className="h2" id="cring-title">Our client <em>work.</em></h2>
        <p className="cring__lede">Workplaces we have planned, built and handed over across Delhi NCR. Hover over a project to preview it, drag to spin the ring, and click the preview to see it full size.</p>
        {SAMPLE && <p className="cring__sample"><span>Sample</span>These are AI-generated design concepts shown as placeholders, not completed client projects.</p>}
      </header>

      <div className="cring__wrap" ref={wrap} onPointerLeave={e => e.pointerType === 'mouse' && clear()} onBlur={onBlurWrap}>
        <div
          ref={stage}
          className="cring__stage"
          style={layout ? { height: layout.height, '--cw': `${layout.cw}px`, '--ch': `${layout.ch}px` } : undefined}
          onPointerDown={onPointerDown}
          onPointerOver={onCardOver}
        >
          <div
            className="cring__ring"
            role="group"
            aria-roledescription="carousel"
            aria-label={`Client work, ${n} projects. Use the arrow keys to browse and Enter to enlarge.`}
            onKeyDown={onKeyDown}
          >
            {ring.map(({ k, i, primary }) => {
              const it = items[i];
              return (
                <button
                  key={k}
                  ref={el => { cards.current[k] = el; }}
                  type="button"
                  className={`cring__card ${active === i ? 'is-active' : ''}`}
                  data-item={i}
                  tabIndex={primary && i === focusIdx ? 0 : -1}
                  aria-hidden={primary ? undefined : true}
                  aria-label={primary ? `${it.client}: ${it.title}. ${it.caption}` : undefined}
                  onFocus={primary ? onFocusCard(i) : undefined}
                  onClick={onCardClick(i, k)}
                >
                  <img src={it.thumb} alt="" draggable={false} decoding="async" />
                </button>
              );
            })}
          </div>

          {pv && (
            <div className={`cring__preview ${shown ? 'is-on' : ''}`} style={{ top: pv.top, left: pv.left, width: pv.w }}>
              <button
                type="button"
                className="cring__frame"
                style={{ height: pv.h }}
                tabIndex={shown ? 0 : -1}
                aria-label={shown ? `Enlarge ${shown.client}: ${shown.title}` : undefined}
                onPointerEnter={e => { if (e.pointerType === 'mouse') m.current.hover = true; }}
                onClick={() => shown && open(active)}
              >
                {layers.map((l, idx) => (
                  <span key={l.key} className={`cring__layer ${idx === layers.length - 1 ? 'is-top' : 'is-out'}`} style={{ backgroundImage: `url(${items[l.i].thumb})` }}>
                    <img src={items[l.i].src} alt={items[l.i].alt} onLoad={e => e.currentTarget.classList.add('is-loaded')} draggable={false} />
                  </span>
                ))}
                {SAMPLE && shown && <i className="cring__badge">Sample</i>}
              </button>
              {shown && (
                <div className="cring__caption" key={active}>
                  <b>{shown.client}</b>
                  <span>{shown.title} · {shown.caption}</span>
                  <em>Click to enlarge +</em>
                </div>
              )}
            </div>
          )}
          {pv && <p className={`cring__idle ${shown ? '' : 'is-on'}`} style={{ top: pv.top + pv.h / 2 }} aria-hidden="true">Hover or tap a project</p>}
        </div>

        <div className="cring__controls">
          <button type="button" className="cring__play" aria-pressed={!playing} onClick={() => setPlaying(p => !p)}>
            {playing ? <><i aria-hidden="true">❚❚</i>Pause rotation</> : <><i aria-hidden="true">▶</i>Play rotation</>}
          </button>
          <span className="cring__help cring__help--mouse">Drag to spin · ← → keys to browse</span>
          <span className="cring__help cring__help--touch">Tap a project to preview · swipe to spin</span>
        </div>
      </div>
    </section>
  );
}
