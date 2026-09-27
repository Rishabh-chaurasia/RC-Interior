import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, SoftShadows } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping, Bloom, SMAA } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import Room, { H } from './Room.jsx';
import { asset, preloadFinishes } from './materials.js';

RectAreaLightUniformsLib.init();

/** Camera presets. pos = camera, target = where it looks. Interior views are at eye level. */
export const VIEWS = [
  { id: 'overview', label: 'Overview', pos: [7.2, 6.4, 8.6], target: [-0.4, 0.4, -0.6] },
  { id: 'desk', label: 'Director’s desk', pos: [-0.1, 1.5, 1.9], target: [-0.3, 0.95, -2.6] },
  { id: 'lounge', label: 'Lounge', pos: [-0.9, 1.45, 3.1], target: [-3.8, 0.75, 1.0] },
  { id: 'meeting', label: 'Meeting room', pos: [1.9, 1.55, 2.4], target: [3.7, 0.95, -1.9] },
];

/** Glides camera + orbit target to the chosen view; the visitor can orbit freely once it arrives. */
function CameraRig({ view, controls, onSettled }) {
  const { camera, size } = useThree();
  const anim = useRef(null);
  const aspect = size.width / size.height;

  // Narrow / portrait screens: a wider lens, and the overview camera pulled back so the whole floor fits.
  useEffect(() => {
    const fov = aspect < 0.8 ? 58 : aspect < 1.2 ? 50 : 42;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }, [aspect, camera]);

  useEffect(() => {
    const v = VIEWS.find(x => x.id === view);
    if (!controls.current) return;
    const target = new THREE.Vector3(...v.target);
    const pos = new THREE.Vector3(...v.pos);
    if (v.id === 'overview' && aspect < 0.8) {
      const k = THREE.MathUtils.clamp(0.8 / aspect, 1, 1.8);
      pos.sub(target).multiplyScalar(k).add(target);
    }
    anim.current = {
      t: 0,
      fromPos: camera.position.clone(), toPos: pos,
      fromTarget: controls.current.target.clone(), toTarget: target,
    };
  }, [view, camera, controls, aspect]);
  useFrame((_, dt) => {
    const a = anim.current;
    if (!a || !controls.current) return;
    a.t = Math.min(1, a.t + dt / 1.6);
    const e = a.t < 0.5 ? 4 * a.t ** 3 : 1 - (-2 * a.t + 2) ** 3 / 2; // easeInOutCubic
    camera.position.lerpVectors(a.fromPos, a.toPos, e);
    controls.current.target.lerpVectors(a.fromTarget, a.toTarget, e);
    controls.current.update();
    if (a.t >= 1) { anim.current = null; onSettled?.(); }
  });
  return null;
}

/** +/- buttons: dolly the camera towards / away from the orbit target. */
function ZoomRig({ zoom, controls }) {
  const { camera } = useThree();
  const goal = useRef(null);
  useEffect(() => {
    if (!zoom.n || !controls.current) return;
    const t = controls.current.target;
    const dir = camera.position.clone().sub(t);
    const len = THREE.MathUtils.clamp(dir.length() * (zoom.dir > 0 ? 0.78 : 1.28), 1.2, 28);
    goal.current = t.clone().add(dir.setLength(len));
  }, [zoom, camera, controls]);
  useFrame(() => {
    if (!goal.current || !controls.current) return;
    camera.position.lerp(goal.current, 0.12);
    controls.current.update();
    if (camera.position.distanceTo(goal.current) < 0.01) goal.current = null;
  });
  return null;
}

/**
 * Load progress from three's loading manager. Updates are deferred with setTimeout because loads
 * start while React is rendering, and React must not re-render another component mid-render.
 */
function Progress({ onProgress }) {
  useEffect(() => {
    const m = THREE.DefaultLoadingManager;
    const prev = m.onProgress;
    let max = 0;
    m.onProgress = (url, loaded, total) => {
      max = Math.max(max, Math.round((loaded / Math.max(total, 1)) * 100));
      const pct = Math.min(max, 99);
      setTimeout(() => onProgress(pct, false), 0);
    };
    return () => { m.onProgress = prev; };
  }, [onProgress]);
  return null;
}

/** Mounted only once everything in the Suspense has loaded: marks the scene ready, then preloads the other finishes. */
function AfterLoad({ onProgress }) {
  useEffect(() => {
    const r = setTimeout(() => onProgress(100, true), 250);
    const t = setTimeout(preloadFinishes, 1500);
    return () => { clearTimeout(r); clearTimeout(t); };
  }, [onProgress]);
  return null;
}

function Lights({ evening, mobile }) {
  return (
    <>
      {/* sun through the window wall */}
      <directionalLight
        position={[-11, 7.5, 2.5]}
        intensity={evening ? 0 : 5.5}
        color="#fff3e2"
        castShadow
        shadow-mapSize={mobile ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={6} shadow-camera-bottom={-6}
        shadow-camera-near={1} shadow-camera-far={30}
        shadow-bias={-0.0003} shadow-normalBias={0.03}
      />
      {/* soft sky fill from the windows */}
      <rectAreaLight position={[-4.9, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} width={7} height={2.6} intensity={evening ? 0.25 : 4} color={evening ? '#5a6690' : '#eef4ff'} />
      <hemisphereLight args={[evening ? '#3a3550' : '#f6f2ea', evening ? '#1a1410' : '#b89a7c', evening ? 0.12 : 0.45]} />
      {/* ceiling lines + pendants, stronger in the evening */}
      {[[-1.6, H - 0.2, -2.3], [-1.6, H - 0.2, 0], [-1.6, H - 0.2, 2.3]].map((p, i) => (
        <pointLight key={i} position={p} intensity={evening ? 6 : 1.2} distance={6} decay={2} color="#ffe6c4" />
      ))}
      {[[-3.3, 1.95, 1.35], [3.6, 1.95, -2.1], [3.6, 1.95, -1.0]].map((p, i) => (
        <pointLight key={`p${i}`} position={p} intensity={evening ? 5 : 0.4} distance={4.5} decay={2} color="#ffd9a8" />
      ))}
      <pointLight position={[-1.18, 1.35, -1.75]} intensity={evening ? 2.5 : 0} distance={2.5} decay={2} color="#ffcf8a" />
    </>
  );
}

export default function Scene({ view, finishes, evening, autoRotate, active, mobile, zoom, onProgress, onUserMove }) {
  const controls = useRef(null);
  const v0 = VIEWS[0];
  return (
    <Canvas
      shadows
      dpr={mobile ? [1, 1.5] : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: v0.pos, fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.NoToneMapping; gl.outputColorSpace = THREE.SRGBColorSpace; }}
    >
      <color attach="background" args={[evening ? '#141019' : '#1f1915']} />
      {!mobile && <SoftShadows size={18} samples={12} focus={0.6} />}
      <Progress onProgress={onProgress} />
      <Suspense fallback={null}>
        <Environment files={asset('hdri/office.hdr')} environmentIntensity={evening ? 0.15 : 0.75} />
        <Lights evening={evening} mobile={mobile} />
        <Room {...finishes} evening={evening} />
        <AfterLoad onProgress={onProgress} />
      </Suspense>
      <OrbitControls
        ref={controls}
        makeDefault
        target={v0.target}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        onStart={onUserMove}
      />
      <CameraRig view={view} controls={controls} />
      <ZoomRig zoom={zoom} controls={controls} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        {!mobile ? <N8AO aoRadius={0.5} distanceFalloff={0.6} intensity={2} quality="medium" halfRes /> : <></>}
        <Bloom luminanceThreshold={0.92} intensity={evening ? 0.55 : 0.2} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
