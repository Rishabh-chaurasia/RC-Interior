import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, RoundedBox } from '@react-three/drei';
import { asset, usePBR, FINISHES } from './materials.js';

/*
  A 10 m × 7 m corner office floor, lit like an interior photo.
  Axes: x = left(-5) → right(+5), z = back wall(-3.5) → front(+3.5), y = up. Units are metres.
  Zones: executive desk (centre-back), lounge (left, by the windows), glass meeting room (right).
  Walls and ceiling face inwards, so from the overview camera outside the room they are culled
  (a clean cut-away), while eye-level views inside see a complete room.
*/

const W = 10, D = 7, H = 3;
const X0 = -W / 2, X1 = W / 2, Z0 = -D / 2, Z1 = D / 2;

/* ---------- shared plain materials ---------- */
export const mat = {
  steel: new THREE.MeshStandardMaterial({ color: '#1b1b1d', roughness: 0.35, metalness: 0.85 }),
  white: new THREE.MeshStandardMaterial({ color: '#f4f2ee', roughness: 0.6 }),
  ceiling: new THREE.MeshStandardMaterial({ color: '#f6f5f2', roughness: 0.9, side: THREE.FrontSide }),
  skirting: new THREE.MeshStandardMaterial({ color: '#ebe8e2', roughness: 0.5 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#e6f1f2', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.1, envMapIntensity: 1.4, depthWrite: false, side: THREE.DoubleSide }),
  frost: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, transparent: true, opacity: 0.32, depthWrite: false }),
  screen: new THREE.MeshStandardMaterial({ color: '#0b0d10', roughness: 0.12, metalness: 0.2 }),
  screenOn: new THREE.MeshStandardMaterial({ color: '#0b0d10', roughness: 0.2, emissive: '#6c8fa6', emissiveIntensity: 0.35 }),
  lightStrip: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff4e0', emissiveIntensity: 2.2 }),
  book: ['#6b4629', '#cddc2f', '#2b3a3a', '#b5654a', '#d9d1c3', '#1f2a44', '#8a7a5c'].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 })),
};

/* ---------- models ---------- */
const MODELS = ['mid_century_lounge_chair', 'modern_arm_chair_01', 'modern_coffee_table_01', 'modern_wooden_cabinet', 'steel_frame_shelves_01', 'potted_plant_01', 'potted_plant_02', 'potted_plant_04', 'desk_lamp_arm_01', 'modern_ceiling_lamp_01', 'ceramic_vase_01', 'ceramic_vase_03', 'dining_chair_02', 'side_table_01'];
export const preloadModels = () => MODELS.forEach(m => useGLTF.preload(asset(`models/${m}.glb`)));

export function Model({ name, position = [0, 0, 0], rotation = 0, scale = 1 }) {
  const { scene } = useGLTF(asset(`models/${name}.glb`));
  const obj = useMemo(() => scene.clone(true), [scene]);
  useLayoutEffect(() => {
    obj.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) o.material.envMapIntensity = 1;
      }
    });
  }, [obj]);
  return <primitive object={obj} position={position} rotation={[0, rotation, 0]} scale={scale} />;
}

/* ---------- architecture ---------- */

function Floor({ floor }) {
  const f = FINISHES.floor.find(o => o.id === floor);
  const m = usePBR(floor, [W / f.repeat, D / f.repeat], { roughness: f.roughness, envMapIntensity: 0.7 }, { useRoughMap: f.useRoughMap });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={m} receiveShadow>
      <planeGeometry args={[W, D]} />
    </mesh>
  );
}

function Walls() {
  const plaster = usePBR('plaster_white', [3, 1], { roughness: 1 });
  return (
    <group>
      {/* back wall (faces +z) */}
      <mesh position={[0, H / 2, Z0]} material={plaster} receiveShadow>
        <planeGeometry args={[W, H]} />
      </mesh>
      {/* right wall (faces -x): culled from the overview camera */}
      <mesh position={[X1, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={plaster} receiveShadow>
        <planeGeometry args={[D, H]} />
      </mesh>
      {/* front wall (faces -z): only seen from inside */}
      <mesh position={[0, H / 2, Z1]} rotation={[0, Math.PI, 0]} material={plaster} receiveShadow>
        <planeGeometry args={[W, H]} />
      </mesh>
      {/* ceiling (faces down) with linear lights */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat.ceiling}>
        <planeGeometry args={[W, D]} />
      </mesh>
      {[-2.6, 0, 2.6].map(z => (
        <mesh key={z} position={[-1.6, H - 0.01, z * 0.9]} rotation={[Math.PI / 2, 0, 0]} material={mat.lightStrip}>
          <planeGeometry args={[4.2, 0.06]} />
        </mesh>
      ))}
      {/* skirting */}
      <mesh position={[0, 0.05, Z0 + 0.01]} material={mat.skirting} receiveShadow><boxGeometry args={[W, 0.1, 0.02]} /></mesh>
    </group>
  );
}

/** Floor-to-ceiling glazing on the left, with slim black mullions; sunlight comes through here. */
function WindowWall({ evening }) {
  const sky = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 4; c.height = 256;
    const g = c.getContext('2d'); const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, evening ? '#1c2640' : '#cfe3f3'); grd.addColorStop(0.62, evening ? '#46405a' : '#f4f7f8'); grd.addColorStop(1, evening ? '#2a2630' : '#e9ece8');
    g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [evening]);
  const skyRef = useRef(null);
  useFrame(({ camera }) => {
    const p = camera.position;
    if (skyRef.current) skyRef.current.visible = p.x > X0 && p.x < X1 && p.z > Z0 && p.z < Z1 + 0.5 && p.y < H;
  });
  const mullions = [];
  for (let z = Z0; z <= Z1 + 0.001; z += 1.4) mullions.push(z);
  return (
    <group>
      {/* bright exterior, blown-out like an interior photo */}
      <mesh ref={skyRef} position={[X0 - 1.2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D + 4, H + 2]} />
        <meshBasicMaterial map={sky} toneMapped={false} color={evening ? '#8a8aa8' : '#ffffff'} />
      </mesh>
      <mesh position={[X0, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.glass}>
        <planeGeometry args={[D, H]} />
      </mesh>
      {mullions.map(z => (
        <mesh key={z} position={[X0, H / 2, z]} material={mat.steel} castShadow><boxGeometry args={[0.07, H, 0.05]} /></mesh>
      ))}
      <mesh position={[X0, 2.55, 0]} material={mat.steel} castShadow><boxGeometry args={[0.07, 0.05, D]} /></mesh>
      <mesh position={[X0, 0.04, 0]} material={mat.steel}><boxGeometry args={[0.1, 0.08, D]} /></mesh>
      <mesh position={[X0, H - 0.04, 0]} material={mat.steel}><boxGeometry args={[0.1, 0.08, D]} /></mesh>
    </group>
  );
}

/** Feature wall behind the desk: walnut battens, a stone panel, or plain plaster. */
function FeatureWall({ wall }) {
  const width = 3.6, cx = -0.3;
  const slatId = wall === 'oak_light' ? 'oak_light' : 'walnut_dark';
  const wood = usePBR(slatId, [0.3, 2.4], { roughness: 0.55 });
  const stone = usePBR('marble_01', [1.4, 1.2], { roughness: 0.6 });
  if (wall === 'walnut_dark' || wall === 'oak_light') {
    const n = 26;
    return (
      <group position={[cx, 0, Z0]}>
        <mesh position={[0, H / 2, 0.012]} material={mat.steel}><boxGeometry args={[width, H, 0.01]} /></mesh>
        {Array.from({ length: n }, (_, i) => (
          <mesh key={i} position={[-width / 2 + (i + 0.5) * (width / n), H / 2, 0.035]} material={wood} castShadow receiveShadow>
            <boxGeometry args={[width / n - 0.028, H, 0.04]} />
          </mesh>
        ))}
      </group>
    );
  }
  if (wall === 'marble_01') {
    return (
      <mesh position={[cx, H / 2, Z0 + 0.02]} material={stone} receiveShadow>
        <boxGeometry args={[width, H, 0.03]} />
      </mesh>
    );
  }
  return null;
}

/* ---------- furniture built from textured parts ---------- */

export function Desk({ position }) {
  const walnut = usePBR('walnut_dark', [1, 1], { roughness: 0.45 });
  const w = 2.0, d = 0.85, h = 0.74;
  return (
    <group position={position}>
      <RoundedBox args={[w, 0.05, d]} radius={0.012} smoothness={3} position={[0, h, 0]} material={walnut} castShadow receiveShadow />
      {/* sled legs */}
      {[-w / 2 + 0.12, w / 2 - 0.12].map(x => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, h / 2, -d / 2 + 0.06]} material={mat.steel} castShadow><boxGeometry args={[0.04, h, 0.04]} /></mesh>
          <mesh position={[0, h / 2, d / 2 - 0.06]} material={mat.steel} castShadow><boxGeometry args={[0.04, h, 0.04]} /></mesh>
          <mesh position={[0, 0.02, 0]} material={mat.steel} castShadow><boxGeometry args={[0.04, 0.04, d - 0.08]} /></mesh>
          <mesh position={[0, h - 0.04, 0]} material={mat.steel}><boxGeometry args={[0.04, 0.04, d - 0.08]} /></mesh>
        </group>
      ))}
      {/* modesty panel */}
      <mesh position={[0, h - 0.2, d / 2 - 0.08]} material={walnut} castShadow><boxGeometry args={[w - 0.3, 0.32, 0.02]} /></mesh>
    </group>
  );
}

export function Monitor({ position, on }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.34, 0]} material={mat.steel} castShadow><boxGeometry args={[0.62, 0.37, 0.025]} /></mesh>
      <mesh position={[0, 0.34, 0.0135]} material={on ? mat.screenOn : mat.screen}><planeGeometry args={[0.59, 0.34]} /></mesh>
      <mesh position={[0, 0.12, -0.03]} material={mat.steel} castShadow><boxGeometry args={[0.04, 0.24, 0.02]} /></mesh>
      <mesh position={[0, 0.006, -0.02]} material={mat.steel} castShadow><boxGeometry args={[0.24, 0.012, 0.16]} /></mesh>
    </group>
  );
}

export function Sofa({ position, rotation = 0, fabric }) {
  const cloth = usePBR(fabric, [2, 2], { roughness: 1 });
  const L = 2.3, Dp = 0.95;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-L / 2 + 0.12, L / 2 - 0.12].flatMap(x => [-Dp / 2 + 0.1, Dp / 2 - 0.1].map(z => (
        <mesh key={`${x}${z}`} position={[x, 0.04, z]} material={mat.steel}><cylinderGeometry args={[0.02, 0.02, 0.08, 10]} /></mesh>
      )))}
      <RoundedBox args={[L, 0.26, Dp]} radius={0.05} smoothness={4} position={[0, 0.21, 0]} material={cloth} castShadow receiveShadow />
      {[-L / 4 + 0.03, L / 4 - 0.03].map(x => (
        <RoundedBox key={x} args={[L / 2 - 0.2, 0.16, Dp - 0.28]} radius={0.07} smoothness={4} position={[x, 0.42, 0.1]} material={cloth} castShadow receiveShadow />
      ))}
      <RoundedBox args={[L, 0.5, 0.22]} radius={0.08} smoothness={4} position={[0, 0.58, -Dp / 2 + 0.11]} material={cloth} castShadow receiveShadow />
      {[-L / 2 + 0.09, L / 2 - 0.09].map(x => (
        <RoundedBox key={x} args={[0.18, 0.34, Dp]} radius={0.07} smoothness={4} position={[x, 0.46, 0]} material={cloth} castShadow receiveShadow />
      ))}
      <RoundedBox args={[0.42, 0.34, 0.12]} radius={0.05} smoothness={3} position={[-0.6, 0.62, -0.2]} rotation={[-0.25, 0.15, 0]} castShadow>
        <meshStandardMaterial color="#b9c43a" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.34, 0.12]} radius={0.05} smoothness={3} position={[0.62, 0.62, -0.2]} rotation={[-0.25, -0.1, 0]} castShadow>
        <meshStandardMaterial color="#8a5a3c" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}

export function Rug({ position, size }) {
  const m = usePBR('rug_cream', [size[0] / 0.9, size[1] / 0.9], { roughness: 1 });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} material={m} receiveShadow>
      <planeGeometry args={size} />
    </mesh>
  );
}

function MeetingTable({ position }) {
  const walnut = usePBR('walnut_dark', [1, 2], { roughness: 0.4 });
  const w = 1.1, l = 2.4, h = 0.75;
  return (
    <group position={position}>
      <RoundedBox args={[w, 0.05, l]} radius={0.02} smoothness={3} position={[0, h, 0]} material={walnut} castShadow receiveShadow />
      {[-l / 2 + 0.35, l / 2 - 0.35].map(z => (
        <mesh key={z} position={[0, h / 2, z]} material={mat.steel} castShadow><boxGeometry args={[0.7, h - 0.03, 0.05]} /></mesh>
      ))}
    </group>
  );
}

function GlassRoom() {
  const x = 2.2, zf = 0.4;
  const frame = [];
  // side partition (x = 2.2, from back wall to zf) and front partition (z = zf, from x to right wall)
  return (
    <group>
      <mesh position={[x, H / 2, (Z0 + zf) / 2]} rotation={[0, Math.PI / 2, 0]} material={mat.glass}><planeGeometry args={[zf - Z0, H]} /></mesh>
      <mesh position={[(x + X1) / 2, H / 2, zf]} material={mat.glass}><planeGeometry args={[X1 - x, H]} /></mesh>
      {/* frosted manifestation band */}
      <mesh position={[x + 0.001, 1.15, (Z0 + zf) / 2]} rotation={[0, Math.PI / 2, 0]} material={mat.frost}><planeGeometry args={[zf - Z0, 0.12]} /></mesh>
      <mesh position={[(x + X1) / 2, 1.15, zf + 0.001]} material={mat.frost}><planeGeometry args={[X1 - x, 0.12]} /></mesh>
      {/* black frames */}
      {[[x, zf], [x, Z0 + 0.03], [X1 - 0.03, zf], [x + 1.4, zf]].map(([px, pz], i) => (
        <mesh key={i} position={[px, H / 2, pz]} material={mat.steel} castShadow><boxGeometry args={[0.05, H, 0.05]} /></mesh>
      ))}
      {[0.03, H - 0.03].map(y => (
        <group key={y}>
          <mesh position={[x, y, (Z0 + zf) / 2]} material={mat.steel}><boxGeometry args={[0.05, 0.05, zf - Z0]} /></mesh>
          <mesh position={[(x + X1) / 2, y, zf]} material={mat.steel}><boxGeometry args={[X1 - x, 0.05, 0.05]} /></mesh>
        </group>
      ))}
      {frame}
    </group>
  );
}

export function Books({ position, count = 9, seed = 1 }) {
  const items = useMemo(() => {
    let r = seed * 9301;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    let x = 0;
    return Array.from({ length: count }, () => {
      const w = 0.025 + rnd() * 0.03, h = 0.2 + rnd() * 0.09, d = 0.15 + rnd() * 0.06;
      const b = { x: x + w / 2, w, h, d, m: mat.book[Math.floor(rnd() * mat.book.length)] };
      x += w + 0.004;
      return b;
    });
  }, [count, seed]);
  return (
    <group position={position}>
      {items.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, 0]} material={b.m} castShadow receiveShadow><boxGeometry args={[b.w, b.h, b.d]} /></mesh>
      ))}
    </group>
  );
}

export function TV({ position, on }) {
  return (
    <group position={position}>
      <mesh material={mat.steel} castShadow><boxGeometry args={[1.45, 0.84, 0.04]} /></mesh>
      <mesh position={[0, 0, 0.021]} material={on ? mat.screenOn : mat.screen}><planeGeometry args={[1.4, 0.79]} /></mesh>
    </group>
  );
}

/** Framed abstract print, drawn on a canvas in the brand palette. */
export function ArtFrame({ position, size = [0.9, 1.2], variant = 0 }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 600; c.height = Math.round(600 * size[1] / size[0]);
    const g = c.getContext('2d'); const w = c.width, h = c.height;
    g.fillStyle = '#efe9df'; g.fillRect(0, 0, w, h);
    if (variant === 0) {
      g.fillStyle = '#9c6b43'; g.beginPath(); g.arc(w * 0.5, h * 0.62, w * 0.34, Math.PI, 0); g.lineTo(w * 0.84, h * 0.9); g.lineTo(w * 0.16, h * 0.9); g.fill();
      g.fillStyle = '#cddc2f'; g.beginPath(); g.arc(w * 0.66, h * 0.28, w * 0.12, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#1f1915'; g.fillRect(w * 0.16, h * 0.9, w * 0.68, h * 0.02);
    } else {
      g.fillStyle = '#2b3a3a'; g.fillRect(w * 0.14, h * 0.14, w * 0.44, h * 0.72);
      g.fillStyle = '#b5654a'; g.beginPath(); g.arc(w * 0.58, h * 0.5, w * 0.26, -Math.PI / 2, Math.PI / 2); g.fill();
      g.strokeStyle = '#1f1915'; g.lineWidth = 6; g.beginPath(); g.moveTo(w * 0.14, h * 0.86); g.lineTo(w * 0.86, h * 0.86); g.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }, [size, variant]);
  return (
    <group position={position}>
      <mesh material={mat.steel} castShadow><boxGeometry args={[size[0] + 0.06, size[1] + 0.06, 0.035]} /></mesh>
      <mesh position={[0, 0, 0.024]}><planeGeometry args={[size[0] - 0.1, size[1] - 0.1]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
      <mesh position={[0, 0, 0.02]} material={mat.white}><planeGeometry args={size} /></mesh>
    </group>
  );
}

/* ---------- the room ---------- */

export default function Room({ floor, wall, fabric, evening }) {
  return (
    <group>
      {/* swappable finishes each suspend on their own, so a swap never blanks the whole room */}
      <Suspense fallback={null}><Floor floor={floor} /></Suspense>
      <Walls />
      <WindowWall evening={evening} />
      <Suspense fallback={null}><FeatureWall wall={wall} /></Suspense>

      {/* executive zone */}
      <Model name="modern_wooden_cabinet" position={[-0.3, 0, -3.16]} />
      <Model name="ceramic_vase_01" position={[-1.2, 0.68, -3.18]} />
      <Model name="ceramic_vase_03" position={[-1.02, 0.68, -3.12]} />
      <Books position={[0.25, 0.68, -3.16]} count={10} seed={3} />
      <Model name="potted_plant_04" position={[0.95, 0.68, -3.16]} scale={1.4} />

      <Desk position={[-0.3, 0, -1.75]} />
      <Model name="mid_century_lounge_chair" position={[-0.3, 0, -2.3]} />
      <Monitor position={[-0.05, 0.765, -1.95]} on={evening} />
      <Model name="desk_lamp_arm_01" position={[-1.18, 0.765, -1.9]} rotation={Math.PI / 2 + 0.3} />
      <Model name="potted_plant_04" position={[0.5, 0.765, -1.9]} />
      <Books position={[-0.95, 0.765, -1.55]} count={4} seed={7} />
      <Model name="modern_arm_chair_01" position={[-0.95, 0, -0.55]} rotation={Math.PI + 0.15} />
      <Model name="modern_arm_chair_01" position={[0.35, 0, -0.55]} rotation={Math.PI - 0.15} />

      {/* shelving between the feature wall and the meeting room */}
      <Model name="steel_frame_shelves_01" position={[1.72, 0, -3.2]} scale={0.1} />
      <Books position={[1.25, 0.49, -3.2]} count={11} seed={5} />
      <Books position={[1.4, 1.36, -3.2]} count={8} seed={11} />
      <Model name="ceramic_vase_03" position={[1.95, 0.92, -3.2]} />
      <Model name="potted_plant_04" position={[1.95, 1.79, -3.2]} scale={1.2} />

      {/* lounge by the windows */}
      <Rug position={[-3.35, 0.003, 1.35]} size={[2.9, 3.4]} />
      <Suspense fallback={null}><Sofa position={[-4.45, 0, 1.35]} rotation={Math.PI / 2} fabric={fabric} /></Suspense>
      <Model name="modern_coffee_table_01" position={[-3.3, 0, 1.35]} />
      <Model name="ceramic_vase_01" position={[-3.3, 0.39, 1.05]} scale={0.7} />
      <Model name="modern_arm_chair_01" position={[-2.15, 0, 0.75]} rotation={-Math.PI / 2 - 0.2} />
      <Model name="modern_arm_chair_01" position={[-2.15, 0, 1.95]} rotation={-Math.PI / 2 + 0.2} />
      <Model name="side_table_01" position={[-4.5, 0, 2.95]} />
      <Model name="potted_plant_02" position={[-4.45, 0, -0.3]} />
      <Model name="potted_plant_01" position={[-4.4, 0, -2.9]} scale={1.25} />
      <ArtFrame position={[-2.75, 1.55, Z0 + 0.02]} size={[0.9, 1.2]} variant={0} />
      <ArtFrame position={[-3.85, 1.55, Z0 + 0.02]} size={[0.9, 1.2]} variant={1} />
      <Model name="modern_ceiling_lamp_01" position={[-3.3, H - 1.17, 1.35]} />

      {/* glass meeting room */}
      <GlassRoom />
      <MeetingTable position={[3.6, 0, -1.55]} />
      {[-2.3, -1.55, -0.8].map(z => (
        <group key={z}>
          <Model name="dining_chair_02" position={[2.72, 0, z]} rotation={Math.PI / 2} />
          <Model name="dining_chair_02" position={[4.48, 0, z]} rotation={-Math.PI / 2} />
        </group>
      ))}
      <TV position={[3.6, 1.45, Z0 + 0.03]} on={evening} />
      <Model name="modern_ceiling_lamp_01" position={[3.6, H - 1.17, -2.1]} />
      <Model name="modern_ceiling_lamp_01" position={[3.6, H - 1.17, -1.0]} />
      <Model name="potted_plant_02" position={[4.55, 0, 0.0]} scale={0.9} />
    </group>
  );
}

export { W, D, H, X0, X1, Z0, Z1 };
