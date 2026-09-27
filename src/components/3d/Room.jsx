import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/*
  A stylised, low-poly office corner built entirely from primitive geometry —
  no external model files needed. Colours match the site's palette so it reads
  as part of the same brand, not a stock 3D asset dropped in.
*/
const OAK = '#9c6b43';
const OAK_DARK = '#6e4a2e';
const INK = '#221b17';
const LIME = '#cddc2f';
const BONE = '#f2ede5';
const SAND = '#e4dccf';
const TERRACOTTA = '#b5654a';
const LEAF = '#5c7a4a';

function Leg({ position }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.025, 0.025, 0.72, 12]} />
      <meshStandardMaterial color={INK} roughness={0.5} metalness={0.3} />
    </mesh>
  );
}

function Desk() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.75]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      <Leg position={[-0.68, 0.37, -0.3]} />
      <Leg position={[0.68, 0.37, -0.3]} />
      <Leg position={[-0.68, 0.37, 0.3]} />
      <Leg position={[0.68, 0.37, 0.3]} />
      {/* laptop, as two simple boxes */}
      <mesh position={[0.15, 0.775, -0.05]} castShadow>
        <boxGeometry args={[0.34, 0.02, 0.24]} />
        <meshStandardMaterial color={SAND} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.9, -0.16]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.34, 0.22, 0.015]} />
        <meshStandardMaterial color={SAND} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0, 0.85]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.06, 0.46]} />
        <meshStandardMaterial color={INK} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.75, 0.2]} castShadow>
        <boxGeometry args={[0.46, 0.55, 0.06]} />
        <meshStandardMaterial color={INK} roughness={0.6} />
      </mesh>
      <Leg position={[-0.19, 0.22, -0.19]} />
      <Leg position={[0.19, 0.22, -0.19]} />
      <Leg position={[-0.19, 0.22, 0.19]} />
      <Leg position={[0.19, 0.22, 0.19]} />
    </group>
  );
}

function Lamp() {
  return (
    <group position={[-0.55, 0.775, -0.2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 10]} />
        <meshStandardMaterial color={INK} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={LIME} roughness={0.3} emissive={LIME} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Shelf() {
  const books = useMemo(() => ['#9c6b43', '#cddc2f', '#221b17', '#b5654a', '#e4dccf'], []);
  return (
    <group position={[1.35, 0, -0.9]}>
      {[0.5, 1.05, 1.6].map(y => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.035, 0.32]} />
          <meshStandardMaterial color={OAK_DARK} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-0.25, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.035, 1.6, 0.32]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0.25, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.035, 1.6, 0.32]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.6} />
      </mesh>
      {books.map((c, i) => (
        <mesh key={i} position={[-0.16 + i * 0.08, 0.62, 0.02]} castShadow>
          <boxGeometry args={[0.06, 0.2 + (i % 2) * 0.05, 0.22]} />
          <meshStandardMaterial color={c} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Plant({ position }) {
  return (
    <Float speed={1.4} floatIntensity={0.3} rotationIntensity={0.15}>
      <group position={position}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.11, 0.32, 16]} />
          <meshStandardMaterial color={TERRACOTTA} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial color={LEAF} roughness={0.75} flatShading />
        </mesh>
        <mesh position={[0.08, 0.72, 0.05]} castShadow>
          <icosahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color={LEAF} roughness={0.75} flatShading />
        </mesh>
      </group>
    </Float>
  );
}

function Rug() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.001, 0.3]} receiveShadow>
      <circleGeometry args={[1.9, 48]} />
      <meshStandardMaterial color={BONE} roughness={0.9} />
    </mesh>
  );
}

/** The whole vignette, slowly turning on its own axis when idle (paused while the user drags, or if reduced motion is set). */
export default function Room({ autoRotate = true }) {
  const group = useRef(null);
  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.18;
  });
  return (
    <group ref={group}>
      <Rug />
      <Desk />
      <Chair />
      <Lamp />
      <Shelf />
      <Plant position={[-1.3, 0, 0.7]} />
    </group>
  );
}
