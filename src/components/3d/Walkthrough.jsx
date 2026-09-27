import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import Office from './Office.jsx';
import { STOPS, ZONES, stopFromProgress } from './stops.js';

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const proj = new THREE.Vector3();

/** Pins the page's DOM zone labels (labels.current[i]) to their 3D positions every frame. */
function LabelProjector({ labels }) {
  const { camera, size } = useThree();
  useFrame(() => {
    ZONES.forEach((z, i) => {
      const el = labels.current[i];
      if (!el) return;
      proj.fromArray(z.position).project(camera);
      const behind = proj.z > 1;
      // keep the whole pill on screen (narrow phones show the floor wider than the viewport)
      const half = el.offsetWidth / 2 + 10;
      const x = Math.min(size.width - half, Math.max(half, (proj.x * 0.5 + 0.5) * size.width));
      const y = Math.min(size.height - 40, Math.max(80, (-proj.y * 0.5 + 0.5) * size.height));
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      el.style.visibility = behind ? 'hidden' : '';
    });
  });
  return null;
}

/** Moves the camera along the stops using the scroll progress in `progress.current` (0–1). */
function CameraRig({ progress, parallax }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(...STOPS[0].look));
  const first = useRef(true);

  useFrame((state, dt) => {
    const s = stopFromProgress(progress.current);
    const i = Math.min(Math.floor(s), STOPS.length - 2);
    const t = s - i;
    const from = STOPS[i], to = STOPS[i + 1];

    tmpPos.copy(a.fromArray(from.pos)).lerp(b.fromArray(to.pos), t);
    tmpPos.y += Math.sin(t * Math.PI) * 1.2; // lift mid-move so the camera swoops over furniture
    tmpLook.copy(a.fromArray(from.look)).lerp(b.fromArray(to.look), t);

    if (parallax) {
      tmpPos.x += state.pointer.x * 0.35;
      tmpPos.y += state.pointer.y * 0.18;
    }

    // wider lens on tall/narrow screens so each zone still fits
    const aspect = size.width / size.height;
    const fov = aspect < 0.8 ? 60 : aspect < 1.25 ? 48 : 38;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }

    const k = first.current ? 1 : 1 - Math.exp(-dt * 5);
    first.current = false;
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpLook, k);
    camera.lookAt(look.current);
  });
  return null;
}

export default function Walkthrough({ progress, active, labels, reduced, mobile }) {
  return (
    <Canvas
      shadows
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: STOPS[0].pos, fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CameraRig progress={progress} parallax={!reduced && !mobile} />
      <LabelProjector labels={labels} />
      <hemisphereLight args={['#fff6ea', '#7d6d5a', 0.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[6, 12, 7]}
        intensity={2.1}
        castShadow
        shadow-mapSize={mobile ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-10, 4, -2]} intensity={0.55} color="#dff0ff" />
      {/* local, procedural reflections: no HDR file is downloaded */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2} position={[0, 6, -6]} scale={[12, 5, 1]} />
        <Lightformer intensity={1.2} position={[-6, 3, 6]} rotation-y={Math.PI / 4} scale={[6, 6, 1]} color="#fff1dc" />
        <Lightformer intensity={0.8} form="ring" position={[6, 4, 2]} scale={3} color="#cddc2f" />
      </Environment>
      <Office />
      <ContactShadows position={[0, -0.33, 0]} scale={22} opacity={0.55} blur={2.6} far={3} frames={1} />
    </Canvas>
  );
}
