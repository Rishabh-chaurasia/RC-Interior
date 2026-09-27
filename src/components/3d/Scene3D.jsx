import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei';
import Room from './Room.jsx';
import { prefersReducedMotion } from '../../hooks/scroll.jsx';

export default function Scene3D() {
  const reduced = useRef(prefersReducedMotion()).current;
  const [autoRotate, setAutoRotate] = useState(!reduced);
  const idleTimer = useRef(null);

  // pause the idle spin while the visitor is actively dragging, resume a moment after they let go
  const onStart = () => { clearTimeout(idleTimer.current); setAutoRotate(false); };
  const onEnd = () => { if (!reduced) idleTimer.current = setTimeout(() => setAutoRotate(true), 2200); };

  return (
    <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'low-power' }}>
      <PerspectiveCamera makeDefault position={[3.4, 2.5, 4.2]} fov={38} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#cddc2f" />
      <Suspense fallback={null}>
        <Room autoRotate={autoRotate} />
        <Environment preset="apartment" environmentIntensity={0.5} />
      </Suspense>
      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={8} blur={2.2} far={2} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.15}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.08}
        onStart={onStart}
        onEnd={onEnd}
      />
    </Canvas>
  );
}
