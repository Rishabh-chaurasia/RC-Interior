import { useMemo } from 'react';
import * as THREE from 'three';

/*
  A cut-away office floor (~12 × 8 m) built from primitive geometry, so there are no model files to load.
  Zones: reception (front-left), workstations (centre), glass cabin (back-right),
  boardroom (front-right), café (back-left). Colours follow the site palette.
*/

const C = {
  oak: '#9c6b43', oakDark: '#6e4a2e', walnut: '#5b3b24', ink: '#221b17', lime: '#cddc2f',
  bone: '#f2ede5', sand: '#e6ded1', white: '#faf7f1', carpet: '#d6cfc2', rug: '#bfb39d',
  grey: '#8b857b', fabric: '#cfc6b6', terracotta: '#b5654a', leaf: '#5c7a4a', leaf2: '#7a9a5c', glass: '#bcd6dc',
};

// Shared materials, created once for the whole scene
const M = {
  floor: new THREE.MeshStandardMaterial({ color: C.bone, roughness: 0.85 }),
  slabEdge: new THREE.MeshStandardMaterial({ color: '#cfc5b5', roughness: 0.9 }),
  wall: new THREE.MeshStandardMaterial({ color: C.sand, roughness: 0.95 }),
  oak: new THREE.MeshStandardMaterial({ color: C.oak, roughness: 0.55 }),
  oakDark: new THREE.MeshStandardMaterial({ color: C.oakDark, roughness: 0.6 }),
  walnut: new THREE.MeshStandardMaterial({ color: C.walnut, roughness: 0.4 }),
  ink: new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.55, metalness: 0.15 }),
  metal: new THREE.MeshStandardMaterial({ color: '#2d2723', roughness: 0.35, metalness: 0.7 }),
  white: new THREE.MeshStandardMaterial({ color: C.white, roughness: 0.35 }),
  lime: new THREE.MeshStandardMaterial({ color: C.lime, roughness: 0.45 }),
  limeGlow: new THREE.MeshStandardMaterial({ color: C.lime, emissive: C.lime, emissiveIntensity: 1.4, roughness: 0.3 }),
  warmGlow: new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffe2ad', emissiveIntensity: 1.6 }),
  carpet: new THREE.MeshStandardMaterial({ color: C.carpet, roughness: 1 }),
  rug: new THREE.MeshStandardMaterial({ color: C.rug, roughness: 1 }),
  grey: new THREE.MeshStandardMaterial({ color: C.grey, roughness: 0.7 }),
  fabric: new THREE.MeshStandardMaterial({ color: C.fabric, roughness: 0.95 }),
  pot: new THREE.MeshStandardMaterial({ color: C.terracotta, roughness: 0.8 }),
  potWhite: new THREE.MeshStandardMaterial({ color: '#ece6dc', roughness: 0.6 }),
  leaf: new THREE.MeshStandardMaterial({ color: C.leaf, roughness: 0.8, flatShading: true }),
  leaf2: new THREE.MeshStandardMaterial({ color: C.leaf2, roughness: 0.8, flatShading: true }),
  glass: new THREE.MeshStandardMaterial({ color: C.glass, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.2, depthWrite: false, side: THREE.DoubleSide }),
  frost: new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, roughness: 0.6, depthWrite: false }),
  screen: new THREE.MeshStandardMaterial({ color: '#1b2226', roughness: 0.2, metalness: 0.4, emissive: '#2b4450', emissiveIntensity: 0.7 }),
  sky: new THREE.MeshStandardMaterial({ color: '#e4f1f2', emissive: '#eef7f8', emissiveIntensity: 1.1 }),
};

function Box({ args, position, rotation, m, shadow = true }) {
  return (
    <mesh position={position} rotation={rotation} material={m} castShadow={shadow} receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  );
}

function Cyl({ args, position, rotation, m, shadow = true }) {
  return (
    <mesh position={position} rotation={rotation} material={m} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={args} />
    </mesh>
  );
}

/* ---------- furniture ---------- */

function TaskChair({ position, rotation = 0, m = M.ink }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Cyl args={[0.28, 0.28, 0.03, 20]} position={[0, 0.04, 0]} m={M.metal} shadow={false} />
      <Cyl args={[0.025, 0.025, 0.42, 8]} position={[0, 0.26, 0]} m={M.metal} />
      <Box args={[0.48, 0.07, 0.46]} position={[0, 0.49, 0]} m={m} />
      <Box args={[0.46, 0.52, 0.06]} position={[0, 0.8, 0.22]} m={m} />
    </group>
  );
}

function Armchair({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box args={[0.78, 0.38, 0.74]} position={[0, 0.19, 0]} m={M.fabric} />
      <Box args={[0.78, 0.5, 0.14]} position={[0, 0.58, 0.3]} m={M.fabric} />
      <Box args={[0.12, 0.22, 0.74]} position={[-0.39, 0.46, 0]} m={M.fabric} />
      <Box args={[0.12, 0.22, 0.74]} position={[0.39, 0.46, 0]} m={M.fabric} />
      <Box args={[0.34, 0.26, 0.1]} position={[0.12, 0.5, 0.2]} rotation={[-0.2, 0, 0.1]} m={M.lime} />
    </group>
  );
}

function Plant({ position, scale = 1, white = false }) {
  return (
    <group position={position} scale={scale}>
      <Cyl args={[0.2, 0.15, 0.45, 18]} position={[0, 0.225, 0]} m={white ? M.potWhite : M.pot} />
      <Cyl args={[0.015, 0.015, 0.5, 6]} position={[0, 0.65, 0]} m={M.leaf} shadow={false} />
      <mesh position={[0, 0.9, 0]} material={M.leaf} castShadow><icosahedronGeometry args={[0.32, 0]} /></mesh>
      <mesh position={[0.14, 1.2, 0.05]} material={M.leaf2} castShadow><icosahedronGeometry args={[0.22, 0]} /></mesh>
      <mesh position={[-0.12, 1.1, -0.08]} material={M.leaf2} castShadow><icosahedronGeometry args={[0.2, 0]} /></mesh>
    </group>
  );
}

/* ---------- shell ---------- */

function Shell() {
  return (
    <group>
      {/* floor slab */}
      <Box args={[12.4, 0.3, 8.4]} position={[0, -0.15, 0]} m={M.floor} />
      <Box args={[12.44, 0.26, 8.44]} position={[0, -0.18, 0]} m={M.slabEdge} shadow={false} />
      {/* back wall */}
      <Box args={[12.4, 3, 0.15]} position={[0, 1.5, -4.125]} m={M.wall} />
      {/* left wall: windows at the back (café), solid feature wall at the front (reception) */}
      <Box args={[0.15, 0.8, 4.8]} position={[-6.125, 0.4, -1.8]} m={M.wall} />
      <Box args={[0.15, 0.5, 4.8]} position={[-6.125, 2.75, -1.8]} m={M.wall} />
      <Box args={[0.15, 1.7, 0.3]} position={[-6.125, 1.65, -4.05]} m={M.wall} />
      <Box args={[0.15, 1.7, 0.2]} position={[-6.125, 1.65, -2.4]} m={M.wall} />
      <Box args={[0.15, 1.7, 1.5]} position={[-6.125, 1.65, -0.15]} m={M.wall} />
      <Box args={[0.04, 1.7, 1.4]} position={[-6.14, 1.65, -3.2]} m={M.sky} shadow={false} />
      <Box args={[0.04, 1.7, 1.4]} position={[-6.14, 1.65, -1.6]} m={M.sky} shadow={false} />
      <Box args={[0.15, 3, 3.6]} position={[-6.125, 1.5, 2.4]} m={M.wall} />
    </group>
  );
}

/* ---------- zones ---------- */

function useHouseShape() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.5, 0); s.lineTo(-0.5, 0.55); s.lineTo(0, 0.95); s.lineTo(0.5, 0.55); s.lineTo(0.5, 0);
    s.lineTo(0.13, 0); s.lineTo(0.13, 0.36); s.lineTo(-0.13, 0.36); s.lineTo(-0.13, 0); s.closePath();
    return s;
  }, []);
}

function Reception() {
  const house = useHouseShape();
  return (
    <group>
      {/* fluted oak feature wall */}
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} args={[0.06, 2.6, 0.08]} position={[-6.0, 1.3, 0.9 + i * 0.2]} m={M.oak} />
      ))}
      {/* backlit RC house mark */}
      <mesh position={[-5.93, 1.55, 2.4]} rotation={[0, Math.PI / 2, 0]} scale={0.62} material={M.limeGlow}>
        <extrudeGeometry args={[house, { depth: 0.05, bevelEnabled: false }]} />
      </mesh>
      {/* curved reception desk */}
      <group position={[-4.7, 0, 2.4]}>
        <mesh position={[0, 0.52, 0]} material={M.white} castShadow receiveShadow>
          <cylinderGeometry args={[0.95, 0.95, 1.04, 40, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position={[0, 1.07, 0]} material={M.oak} castShadow receiveShadow>
          <cylinderGeometry args={[1.02, 1.02, 0.06, 40, 1, false, 0, Math.PI]} />
        </mesh>
        <mesh position={[0, 0.03, 0]} material={M.limeGlow}>
          <cylinderGeometry args={[0.97, 0.97, 0.04, 40, 1, true, 0, Math.PI]} />
        </mesh>
        <Box args={[0.04, 0.3, 0.5]} position={[0.25, 1.28, 0]} m={M.screen} />
      </group>
      {/* waiting area */}
      <Armchair position={[-2.9, 0, 3.4]} rotation={Math.PI * 0.85} />
      <Armchair position={[-1.8, 0, 3.4]} rotation={Math.PI * 1.15} />
      <Cyl args={[0.32, 0.32, 0.04, 28]} position={[-2.35, 0.42, 2.8]} m={M.white} />
      <Cyl args={[0.03, 0.03, 0.4, 8]} position={[-2.35, 0.2, 2.8]} m={M.metal} />
      <Plant position={[-5.55, 0, 3.85]} scale={1.3} white />
    </group>
  );
}

function Workstations() {
  const xs = [-1.6, 0, 1.6];
  const screens = [M.oak, M.lime, M.oak];
  return (
    <group>
      <Box args={[5.2, 0.01, 3.4]} position={[0, 0.005, -0.3]} m={M.carpet} shadow={false} />
      {xs.map((x, i) => (
        <group key={x}>
          {/* front and back desks sharing a screen */}
          {[0.25, -0.55].map(z => (
            <group key={z}>
              <Box args={[1.5, 0.04, 0.72]} position={[x, 0.74, z]} m={M.white} />
              <Box args={[0.04, 0.72, 0.66]} position={[x - 0.72, 0.36, z]} m={M.ink} />
              <Box args={[0.04, 0.72, 0.66]} position={[x + 0.72, 0.36, z]} m={M.ink} />
            </group>
          ))}
          <Box args={[1.5, 0.36, 0.03]} position={[x, 0.94, -0.15]} m={screens[i]} />
          <Box args={[0.52, 0.3, 0.03]} position={[x, 1.02, 0.05]} m={M.screen} />
          <Box args={[0.52, 0.3, 0.03]} position={[x, 1.02, -0.35]} m={M.screen} />
          <TaskChair position={[x, 0, 0.95]} rotation={Math.PI} />
          <TaskChair position={[x, 0, -1.25]} />
        </group>
      ))}
      {/* planters at the ends of the cluster */}
      {[-2.75, 2.75].map(x => (
        <group key={x}>
          <Box args={[0.42, 0.55, 1.5]} position={[x, 0.275, -0.15]} m={M.white} />
          <mesh position={[x, 0.7, -0.5]} material={M.leaf} castShadow><icosahedronGeometry args={[0.28, 0]} /></mesh>
          <mesh position={[x, 0.72, 0.1]} material={M.leaf2} castShadow><icosahedronGeometry args={[0.26, 0]} /></mesh>
          <mesh position={[x, 0.66, 0.45]} material={M.leaf} castShadow><icosahedronGeometry args={[0.22, 0]} /></mesh>
        </group>
      ))}
      {/* suspended linear lights */}
      {[0.25, -0.55].map(z => (
        <group key={z}>
          <Box args={[4.6, 0.05, 0.1]} position={[0, 2.5, z]} m={M.warmGlow} shadow={false} />
          <Cyl args={[0.006, 0.006, 0.7, 4]} position={[-2.1, 2.87, z]} m={M.metal} shadow={false} />
          <Cyl args={[0.006, 0.006, 0.7, 4]} position={[2.1, 2.87, z]} m={M.metal} shadow={false} />
        </group>
      ))}
    </group>
  );
}

function Cabin() {
  return (
    <group>
      {/* glass partition: front and side, with a frosted privacy band */}
      <Box args={[3.4, 2.5, 0.02]} position={[4.3, 1.3, -1.2]} m={M.glass} shadow={false} />
      <Box args={[3.4, 0.1, 0.025]} position={[4.3, 1.15, -1.2]} m={M.frost} shadow={false} />
      <Box args={[0.02, 2.5, 2.85]} position={[2.6, 1.3, -2.625]} m={M.glass} shadow={false} />
      <Box args={[0.025, 0.1, 2.85]} position={[2.6, 1.15, -2.625]} m={M.frost} shadow={false} />
      {[[4.3, 2.56, -1.2, 3.4, 0.04], [4.3, 0.03, -1.2, 3.4, 0.04]].map(([x, y, z, w, h], i) => (
        <Box key={i} args={[w, h, 0.05]} position={[x, y, z]} m={M.metal} />
      ))}
      {[2.6, 3.9, 4.7, 6.0].map(x => <Box key={x} args={[0.04, 2.55, 0.05]} position={[x, 1.3, -1.2]} m={M.metal} />)}
      <Box args={[0.05, 0.04, 2.85]} position={[2.6, 2.56, -2.625]} m={M.metal} />
      {/* furniture */}
      <Box args={[1.6, 0.05, 0.8]} position={[4.4, 0.75, -2.6]} m={M.walnut} />
      <Box args={[1.5, 0.66, 0.04]} position={[4.4, 0.4, -2.95]} m={M.walnut} />
      <Box args={[0.45, 0.72, 0.72]} position={[5.0, 0.36, -2.6]} m={M.walnut} />
      <Box args={[0.36, 0.02, 0.26]} position={[4.2, 0.785, -2.55]} m={M.grey} />
      <TaskChair position={[4.4, 0, -3.35]} m={M.ink} />
      <TaskChair position={[4.0, 0, -1.85]} rotation={Math.PI} m={M.fabric} />
      <TaskChair position={[4.8, 0, -1.85]} rotation={Math.PI} m={M.fabric} />
      <Box args={[1.8, 0.6, 0.45]} position={[4.4, 0.3, -3.8]} m={M.oakDark} />
      {/* framed art on the back wall */}
      <Box args={[1.1, 0.75, 0.03]} position={[4.4, 1.7, -4.03]} m={M.ink} />
      <Box args={[0.45, 0.6, 0.01]} position={[4.2, 1.7, -4.01]} m={M.oak} shadow={false} />
      <Box args={[0.3, 0.6, 0.01]} position={[4.62, 1.7, -4.01]} m={M.lime} shadow={false} />
      <Plant position={[5.65, 0, -3.65]} />
    </group>
  );
}

function Boardroom() {
  const chairsX = [2.95, 3.72, 4.48, 5.25];
  return (
    <group>
      <Box args={[4.2, 0.01, 2.8]} position={[4.1, 0.006, 2.3]} m={M.rug} shadow={false} />
      <Box args={[3.0, 0.06, 1.2]} position={[4.1, 0.76, 2.3]} m={M.walnut} />
      <Box args={[0.35, 0.72, 0.7]} position={[3.1, 0.36, 2.3]} m={M.ink} />
      <Box args={[0.35, 0.72, 0.7]} position={[5.1, 0.36, 2.3]} m={M.ink} />
      {chairsX.map(x => (
        <group key={x}>
          <TaskChair position={[x, 0, 1.3]} rotation={Math.PI} m={M.fabric} />
          <TaskChair position={[x, 0, 3.3]} m={M.fabric} />
        </group>
      ))}
      {/* lime halo pendant */}
      <mesh position={[4.1, 2.35, 2.3]} rotation={[Math.PI / 2, 0, 0]} material={M.limeGlow}>
        <torusGeometry args={[1.05, 0.03, 12, 64]} />
      </mesh>
      <mesh position={[4.1, 2.2, 2.3]} rotation={[Math.PI / 2, 0, 0]} material={M.limeGlow}>
        <torusGeometry args={[0.7, 0.025, 12, 56]} />
      </mesh>
      {[0, 2.1, 4.2].map(a => (
        <Cyl key={a} args={[0.005, 0.005, 0.8, 4]} position={[4.1 + Math.cos(a) * 1.05, 2.75, 2.3 + Math.sin(a) * 1.05]} m={M.metal} shadow={false} />
      ))}
      {/* presentation screen */}
      <Cyl args={[0.03, 0.03, 1.2, 8]} position={[5.95, 0.6, 2.3]} m={M.metal} />
      <Box args={[0.3, 0.03, 0.5]} position={[5.95, 0.015, 2.3]} m={M.metal} />
      <Box args={[0.05, 0.85, 1.45]} position={[5.92, 1.35, 2.3]} m={M.screen} />
      <Plant position={[5.7, 0, 3.85]} scale={1.1} white />
    </group>
  );
}

function Cafe() {
  return (
    <group>
      {/* pantry counter with a lime splashback */}
      <Box args={[3.2, 0.9, 0.6]} position={[-4.1, 0.45, -3.75]} m={M.oak} />
      <Box args={[3.3, 0.05, 0.65]} position={[-4.1, 0.925, -3.75]} m={M.white} />
      <Box args={[3.2, 0.5, 0.02]} position={[-4.1, 1.2, -4.04]} m={M.lime} shadow={false} />
      <Box args={[2.2, 0.04, 0.26]} position={[-4.1, 1.75, -3.92]} m={M.oakDark} />
      {[-4.8, -4.55, -4.3].map(x => <Cyl key={x} args={[0.05, 0.04, 0.1, 12]} position={[x, 1.82, -3.92]} m={M.white} />)}
      <Plant position={[-3.3, 1.77, -3.92]} scale={0.35} white />
      {/* high table and stools */}
      <Cyl args={[0.46, 0.46, 0.04, 32]} position={[-3.0, 1.05, -2.6]} m={M.white} />
      <Cyl args={[0.035, 0.035, 1.03, 8]} position={[-3.0, 0.52, -2.6]} m={M.metal} />
      <Cyl args={[0.3, 0.3, 0.03, 24]} position={[-3.0, 0.015, -2.6]} m={M.metal} />
      {[0, 2.1, 4.2].map(a => {
        const x = -3.0 + Math.cos(a) * 0.72, z = -2.6 + Math.sin(a) * 0.72;
        return (
          <group key={a}>
            <Cyl args={[0.19, 0.19, 0.05, 20]} position={[x, 0.74, z]} m={M.oak} />
            <Cyl args={[0.02, 0.02, 0.72, 6]} position={[x, 0.37, z]} m={M.metal} />
            <Cyl args={[0.17, 0.17, 0.02, 18]} position={[x, 0.01, z]} m={M.metal} />
          </group>
        );
      })}
      {/* globe pendants */}
      {[-3.3, -3.0, -2.7].map((x, i) => (
        <group key={x}>
          <mesh position={[x, 2.0 - (i % 2) * 0.15, -2.6]} material={M.warmGlow}><sphereGeometry args={[0.11, 16, 16]} /></mesh>
          <Cyl args={[0.005, 0.005, 1.0, 4]} position={[x, 2.6 - (i % 2) * 0.08, -2.6]} m={M.metal} shadow={false} />
        </group>
      ))}
      {/* sofa by the windows */}
      <group position={[-5.45, 0, -1.8]}>
        <Box args={[0.8, 0.4, 2.0]} position={[0, 0.2, 0]} m={M.fabric} />
        <Box args={[0.2, 0.48, 2.0]} position={[-0.32, 0.62, 0]} m={M.fabric} />
        <Box args={[0.8, 0.26, 0.16]} position={[0, 0.5, -0.92]} m={M.fabric} />
        <Box args={[0.8, 0.26, 0.16]} position={[0, 0.5, 0.92]} m={M.fabric} />
        <Box args={[0.12, 0.34, 0.4]} position={[-0.15, 0.58, -0.4]} rotation={[0, 0, 0.25]} m={M.lime} />
        <Box args={[0.12, 0.34, 0.4]} position={[-0.15, 0.58, 0.35]} rotation={[0, 0, 0.25]} m={M.oak} />
      </group>
      <Plant position={[-5.55, 0, -0.35]} scale={1.2} />
    </group>
  );
}

export default function Office() {
  return (
    <group>
      <Shell />
      <Reception />
      <Workstations />
      <Cabin />
      <Boardroom />
      <Cafe />
    </group>
  );
}
