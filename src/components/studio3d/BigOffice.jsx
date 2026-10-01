import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, RoundedBox } from '@react-three/drei';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { asset, usePBR, FINISHES } from './materials.js';
import { mat, Model, Desk, Monitor, Sofa, Rug, Books, ArtFrame, TV } from './Room.jsx';
import { WORDMARK_WIDTH, RC_PATH, INTERIOR_PATH, HOUSE, FLOOR, CHAIR_SOLID, CHAIR_LINES, CASTERS } from '../logoPaths.js';

/*
  A 30 m × 18 m corporate floor (about 5,800 sq ft), built like Room.jsx but at company scale.
  Axes: x = window wall(-15) → right(+15), z = back wall(-9) → front(+9), y = up. Units are metres.
  Zones: lounge + café by the windows (left), 48-seat workfloor (centre), huddle room, 3 cabins and
  phone booths along the back wall, 10-seat boardroom (back right), reception with logo wall (front right).
  Repeated furniture (desks, task chairs, dining chairs, plants…) is instanced to keep draw calls low.
*/

export const W = 30, D = 18, H = 3.2;
const X0 = -W / 2, X1 = W / 2, Z0 = -D / 2, Z1 = D / 2;
const FRONT = -5.4;                  // glass line of the back-wall rooms
const BOARD_X = 8.2, BOARD_Z = -2;   // boardroom glass: side wall at x, front wall at z
const CABINS = [-3.5, -0.5, 2.5];    // cabin centres, each 3 m wide
const PARTITIONS = [-9, -5, -2, 1, 4];
const CLUSTERS = [-5.8, 1].flatMap(cx => [-2.2, 1.6, 5.4].map(cz => [cx, cz])); // 6 benches × 8 seats
const BENCH_PITCH = 1.4;

const extra = {
  chairFabric: new THREE.MeshStandardMaterial({ color: '#2a2a2d', roughness: 0.9 }),
  felt: new THREE.MeshStandardMaterial({ color: '#b3bf35', roughness: 1 }),
  shell: new THREE.MeshStandardMaterial({ color: '#2c2a28', roughness: 0.7 }),
  limeLed: new THREE.MeshStandardMaterial({ color: '#cddc2f', emissive: '#cddc2f', emissiveIntensity: 1.6 }),
  downlight: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff1da', emissiveIntensity: 2.4 }),
};

/* ---------- instancing helpers ---------- */

/** Merge [geometry, material] parts into one geometry with one group per material. */
function buildKit(parts) {
  const byMat = new Map();
  // RoundedBoxGeometry is non-indexed and mergeGeometries needs them all alike
  parts.forEach(([g, m]) => { if (!byMat.has(m)) byMat.set(m, []); byMat.get(m).push(g.index ? g.toNonIndexed() : g); });
  const materials = [...byMat.keys()];
  const geometry = mergeGeometries(materials.map(m => mergeGeometries(byMat.get(m))), true);
  return { geometry, materials };
}
const at = (g, x, y, z) => g.translate(x, y, z);

/** One instanced mesh per kit; items = [x, z, rotationY, y?]. */
function Kit({ kit, items }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
    items.forEach(([x, z, r = 0, y = 0], i) => ref.current.setMatrixAt(i, m.compose(p.set(x, y, z), q.setFromAxisAngle(up, r), one)));
    ref.current.instanceMatrix.needsUpdate = true;
  }, [items, kit]);
  return <instancedMesh ref={ref} args={[kit.geometry, kit.materials, items.length]} castShadow receiveShadow frustumCulled={false} />;
}

/** A GLTF model repeated with instancing; items = [x, z, rotationY, y?, scale?]. */
function Models({ name, items }) {
  const { scene } = useGLTF(asset(`models/${name}.glb`));
  const parts = useMemo(() => {
    scene.updateMatrixWorld(true);
    const out = [];
    scene.traverse(o => o.isMesh && out.push({ geometry: o.geometry, material: o.material, matrix: o.matrixWorld.clone() }));
    return out;
  }, [scene]);
  return parts.map((part, i) => <ModelPart key={i} part={part} items={items} />);
}
function ModelPart({ part, items }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), p = new THREE.Vector3(), s = new THREE.Vector3();
    items.forEach(([x, z, r = 0, y = 0, k = 1], i) => {
      m.compose(p.set(x, y, z), q.setFromAxisAngle(up, r), s.set(k, k, k)).multiply(part.matrix);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [items, part]);
  return <instancedMesh ref={ref} args={[part.geometry, part.material, items.length]} castShadow receiveShadow frustumCulled={false} />;
}

/* ---------- kits ---------- */

/** Mesh-back task chair facing +z (backrest on the -z side). */
function useTaskChair() {
  return useMemo(() => {
    const parts = [];
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      parts.push([at(new THREE.BoxGeometry(0.035, 0.03, 0.29), 0, 0.06, 0.145).rotateY(a), mat.steel]);
      parts.push([at(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 10), 0, 0.03, 0.28).rotateY(a), mat.steel]);
    }
    parts.push([at(new THREE.CylinderGeometry(0.022, 0.022, 0.36, 12), 0, 0.25, 0), mat.steel]);
    parts.push([at(new THREE.BoxGeometry(0.34, 0.03, 0.3), 0, 0.44, 0), mat.steel]);
    parts.push([at(new RoundedBoxGeometry(0.5, 0.08, 0.48, 3, 0.03), 0, 0.49, 0.02), extra.chairFabric]);
    parts.push([at(new THREE.BoxGeometry(0.05, 0.32, 0.03), 0, 0.62, -0.24), mat.steel]);
    parts.push([at(new RoundedBoxGeometry(0.46, 0.52, 0.06, 3, 0.03).rotateX(-0.12), 0, 0.88, -0.27), extra.chairFabric]);
    [-0.27, 0.27].forEach(x => {
      parts.push([at(new THREE.BoxGeometry(0.05, 0.03, 0.26), x, 0.68, -0.02), extra.chairFabric]);
      parts.push([at(new THREE.BoxGeometry(0.03, 0.18, 0.03), x, 0.58, -0.08), mat.steel]);
    });
    return buildKit(parts);
  }, []);
}

/** One bench-desk seat: the person sits on the +z side; divider (in the chosen fabric) on the -z edge. */
function useBenchDesk(fabric, on) {
  const oak = usePBR('oak_light', [1, 0.5], { roughness: 0.5 });
  const cloth = usePBR(fabric, [1.4, 0.4], { roughness: 1 });
  return useMemo(() => {
    const parts = [
      [at(new RoundedBoxGeometry(1.38, 0.025, 0.68, 2, 0.008), 0, 0.735, 0), oak],
      [at(new RoundedBoxGeometry(1.36, 0.4, 0.02, 2, 0.008), 0, 0.96, -0.33), cloth],
      [at(new THREE.BoxGeometry(0.56, 0.34, 0.025), 0, 1.03, -0.2), mat.steel],
      [at(new THREE.PlaneGeometry(0.53, 0.31), 0, 1.03, -0.187), on ? mat.screenOn : mat.screen],
      [at(new THREE.BoxGeometry(0.04, 0.2, 0.02), 0, 0.84, -0.22), mat.steel],
      [at(new THREE.BoxGeometry(0.22, 0.012, 0.15), 0, 0.754, -0.2), mat.steel],
      [at(new THREE.BoxGeometry(0.42, 0.015, 0.14), 0, 0.755, 0.08), mat.white],
      [at(new THREE.BoxGeometry(0.4, 0.58, 0.5), 0.42, 0.3, -0.06), mat.white],
    ];
    [-0.66, 0.66].forEach(x => {
      parts.push([at(new THREE.BoxGeometry(0.04, 0.72, 0.04), x, 0.36, 0.26), mat.steel]);
      parts.push([at(new THREE.BoxGeometry(0.04, 0.03, 0.62), x, 0.015, 0), mat.steel]);
      parts.push([at(new THREE.BoxGeometry(0.04, 0.04, 0.62), x, 0.7, 0), mat.steel]);
    });
    return buildKit(parts);
  }, [oak, cloth, on]);
}

function useCafeTable() {
  const walnut = usePBR('walnut_dark', [1, 1], { roughness: 0.45 });
  return useMemo(() => buildKit([
    [at(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 40), 0, 0.74, 0), walnut],
    [at(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 12), 0, 0.37, 0), mat.steel],
    [at(new THREE.CylinderGeometry(0.24, 0.26, 0.025, 32), 0, 0.012, 0), mat.steel],
  ]), [walnut]);
}

/* ---------- architecture ---------- */

function Floor({ floor }) {
  const f = FINISHES.floor.find(o => o.id === floor);
  const m = usePBR(floor, [W / f.repeat, D / f.repeat], { roughness: f.roughness, envMapIntensity: 0.7 }, { useRoughMap: f.useRoughMap });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={m} receiveShadow>
      <planeGeometry args={[W, D]} />
    </mesh>
  );
}

function Shell() {
  const plaster = usePBR('plaster_white', [8, 1], { roughness: 1 });
  // linear lights over each bench and along the corridor, round downlights in reception
  const strips = [
    ...CLUSTERS.flatMap(([cx, cz]) => [[cx, cz - 0.55, 5.2], [cx, cz + 0.55, 5.2]]),
    [-2.5, -4.4, 12], [10.5, -0.8, 6],
  ];
  const downs = [];
  for (let x = 9.5; x <= 14; x += 1.5) for (const z of [3.6, 6.2, 8]) downs.push([x, z]);
  return (
    <group>
      <mesh position={[0, H / 2, Z0]} material={plaster} receiveShadow><planeGeometry args={[W, H]} /></mesh>
      <mesh position={[X1, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={plaster} receiveShadow><planeGeometry args={[D, H]} /></mesh>
      <mesh position={[0, H / 2, Z1]} rotation={[0, Math.PI, 0]} material={plaster} receiveShadow><planeGeometry args={[W, H]} /></mesh>
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat.ceiling}><planeGeometry args={[W, D]} /></mesh>
      {strips.map(([x, z, l], i) => (
        <mesh key={i} position={[x, H - 0.01, z]} rotation={[Math.PI / 2, 0, 0]} material={mat.lightStrip}><planeGeometry args={[l, 0.06]} /></mesh>
      ))}
      {downs.map(([x, z], i) => (
        <mesh key={`d${i}`} position={[x, H - 0.01, z]} rotation={[Math.PI / 2, 0, 0]} material={extra.downlight}><circleGeometry args={[0.07, 20]} /></mesh>
      ))}
      <mesh position={[0, 0.05, Z0 + 0.01]} material={mat.skirting} receiveShadow><boxGeometry args={[W, 0.1, 0.02]} /></mesh>
      {/* structural columns between the benches */}
      {[[-2.4, -0.3], [-2.4, 3.5], [5.2, -0.3], [5.2, 3.5]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, H / 2, z]} material={plaster} castShadow receiveShadow><boxGeometry args={[0.5, H, 0.5]} /></mesh>
      ))}
    </group>
  );
}

/** Floor-to-ceiling glazing along the whole left side; sunlight comes through here. */
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
  for (let z = Z0; z <= Z1 + 0.001; z += 1.5) mullions.push(z);
  return (
    <group>
      <mesh ref={skyRef} position={[X0 - 1.5, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D + 6, H + 3]} />
        <meshBasicMaterial map={sky} toneMapped={false} color={evening ? '#8a8aa8' : '#ffffff'} />
      </mesh>
      <mesh position={[X0, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={mat.glass}><planeGeometry args={[D, H]} /></mesh>
      {mullions.map(z => (
        <mesh key={z} position={[X0, H / 2, z]} material={mat.steel} castShadow><boxGeometry args={[0.07, H, 0.05]} /></mesh>
      ))}
      <mesh position={[X0, 2.7, 0]} material={mat.steel} castShadow><boxGeometry args={[0.07, 0.05, D]} /></mesh>
      <mesh position={[X0, 0.04, 0]} material={mat.steel}><boxGeometry args={[0.1, 0.08, D]} /></mesh>
      <mesh position={[X0, H - 0.04, 0]} material={mat.steel}><boxGeometry args={[0.1, 0.08, D]} /></mesh>
    </group>
  );
}

/** A glass partition from (x1, z1) to (x2, z2) with a frosted band and black frame. */
function Glass({ from: [x1, z1], to: [x2, z2] }) {
  const len = Math.hypot(x2 - x1, z2 - z1);
  const rot = -Math.atan2(z2 - z1, x2 - x1);
  return (
    <group position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, rot, 0]}>
      <mesh position={[0, H / 2, 0]} material={mat.glass}><planeGeometry args={[len, H]} /></mesh>
      <mesh position={[0, 1.15, 0.001]} material={mat.frost}><planeGeometry args={[len, 0.12]} /></mesh>
      <mesh position={[0, 1.15, -0.001]} rotation={[0, Math.PI, 0]} material={mat.frost}><planeGeometry args={[len, 0.12]} /></mesh>
      {[0.03, H - 0.03].map(y => (
        <mesh key={y} position={[0, y, 0]} material={mat.steel}><boxGeometry args={[len, 0.05, 0.05]} /></mesh>
      ))}
      {[-len / 2, len / 2].map(x => (
        <mesh key={x} position={[x, H / 2, 0]} material={mat.steel} castShadow><boxGeometry args={[0.05, H, 0.05]} /></mesh>
      ))}
    </group>
  );
}

/** A panel in the chosen wall finish (slats, stone or plaster), facing +z. */
function FinishPanel({ wall, width, position, height = H, depth = 0.14 }) {
  const slatId = wall === 'oak_light' ? 'oak_light' : 'walnut_dark';
  const wood = usePBR(slatId, [0.3, 2.4], { roughness: 0.55 });
  const stone = usePBR('marble_01', [width / 2.6, 1.2], { roughness: 0.6 });
  const slats = wall === 'walnut_dark' || wall === 'oak_light';
  const n = Math.round(width / 0.14);
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} material={slats ? mat.steel : mat.white} castShadow receiveShadow><boxGeometry args={[width, height, depth]} /></mesh>
      {slats && Array.from({ length: n }, (_, i) => (
        <mesh key={i} position={[-width / 2 + (i + 0.5) * (width / n), height / 2, depth / 2 + 0.02]} material={wood} castShadow receiveShadow>
          <boxGeometry args={[width / n - 0.028, height, 0.04]} />
        </mesh>
      ))}
      {wall === 'marble_01' && (
        <mesh position={[0, height / 2, depth / 2 + 0.012]} material={stone} receiveShadow><boxGeometry args={[width, height, 0.02]} /></mesh>
      )}
    </group>
  );
}

/** The RC Interior logo as a sign, drawn from the same paths as the page logo. */
function LogoSign({ position, width, dark, evening }) {
  const tex = useMemo(() => {
    const k = 2048 / WORDMARK_WIDTH;
    const c = document.createElement('canvas'); c.width = 2048; c.height = Math.ceil(106 * k);
    const g = c.getContext('2d');
    g.scale(k, k);
    const ink = dark ? '#f2ede5' : '#1a1512';
    g.fillStyle = '#cddc2f'; g.fill(new Path2D(HOUSE));
    g.strokeStyle = '#cddc2f'; g.lineWidth = 1.8; g.stroke(new Path2D(FLOOR));
    g.fillStyle = ink; g.fill(new Path2D(CHAIR_SOLID));
    g.strokeStyle = ink; g.lineWidth = 1.7; g.lineCap = g.lineJoin = 'round'; g.stroke(new Path2D(CHAIR_LINES));
    CASTERS.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 1.3, 0, Math.PI * 2); g.fill(); });
    g.fill(new Path2D(RC_PATH));
    g.fillStyle = dark ? '#cddc2f' : '#a3b21a'; g.fill(new Path2D(INTERIOR_PATH));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }, [dark]);
  return (
    <mesh position={position}>
      <planeGeometry args={[width, (width * 106) / WORDMARK_WIDTH]} />
      <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={evening ? 0.55 : 0.12} transparent alphaTest={0.4} roughness={0.35} metalness={0.2} />
    </mesh>
  );
}

/* ---------- zones ---------- */

function Reception({ wall, fabric, evening }) {
  const walnut = usePBR('walnut_dark', [2, 0.6], { roughness: 0.45 });
  const stone = usePBR('marble_01', [2, 0.4], { roughness: 0.4 });
  return (
    <group>
      {/* free-standing logo wall in the chosen finish */}
      <FinishPanel wall={wall} width={5.8} position={[11.5, 0, -1.3]} />
      <Suspense fallback={null}><LogoSign position={[11.5, 1.95, -1.3 + 0.14]} width={3.8} dark={wall === 'walnut_dark' || wall === 'marble_01'} evening={evening} /></Suspense>

      {/* reception counter: walnut body, stone top, lime LED line */}
      <group position={[11.5, 0, 1.7]}>
        <RoundedBox args={[3.4, 1.04, 0.7]} radius={0.02} smoothness={3} position={[0, 0.52, 0]} material={walnut} castShadow receiveShadow />
        <mesh position={[0, 1.06, 0.03]} material={stone} castShadow receiveShadow><boxGeometry args={[3.5, 0.04, 0.82]} /></mesh>
        <mesh position={[0, 0.74, -0.55]} material={mat.white} castShadow receiveShadow><boxGeometry args={[3.2, 0.03, 0.5]} /></mesh>
        <mesh position={[0, 0.06, 0.352]} material={extra.limeLed}><boxGeometry args={[3.3, 0.015, 0.006]} /></mesh>
      </group>
      <group position={[11.0, 0.755, 1.25]} rotation={[0, Math.PI, 0]}><Monitor position={[0, 0, 0]} on={evening} /></group>
      <Model name="ceramic_vase_03" position={[12.8, 1.08, 1.75]} />

      {/* waiting lounge by the entrance */}
      <Rug position={[13.0, 0.003, 5.4]} size={[3.4, 3.2]} />
      <Suspense fallback={null}><Sofa position={[14.35, 0, 5.4]} rotation={-Math.PI / 2} fabric={fabric} /></Suspense>
    </group>
  );
}

function Lounge({ wall, fabric }) {
  return (
    <group>
      <FinishPanel wall={wall} width={4} position={[-12.2, 0, Z0 + 0.07]} />
      <Rug position={[-12.2, 0.003, -6.6]} size={[4.2, 3.4]} />
      <Suspense fallback={null}><Sofa position={[-12.2, 0, -8.15]} fabric={fabric} /></Suspense>
      {/* shelving at the end of the lounge (offsets as in Room.jsx) */}
      <Model name="steel_frame_shelves_01" position={[-9.6, 0, -8.7]} scale={0.1} />
      <Books position={[-10.07, 0.49, -8.7]} count={11} seed={5} />
      <Books position={[-9.92, 1.36, -8.7]} count={8} seed={11} />
      <Model name="ceramic_vase_03" position={[-9.37, 0.92, -8.7]} />
      <Model name="potted_plant_04" position={[-9.37, 1.79, -8.7]} scale={1.2} />
      <ArtFrame position={[-14.6, 1.6, Z0 + 0.02]} size={[0.6, 0.9]} variant={0} />
    </group>
  );
}

function Cafe() {
  const walnut = usePBR('walnut_dark', [2, 0.5], { roughness: 0.45 });
  const stone = usePBR('marble_01', [2, 0.5], { roughness: 0.4 });
  return (
    <group position={[-12.2, 0, 7.75]}>
      <RoundedBox args={[3.8, 0.9, 0.8]} radius={0.02} smoothness={3} position={[0, 0.45, 0]} material={walnut} castShadow receiveShadow />
      <mesh position={[0, 0.92, 0]} material={stone} castShadow receiveShadow><boxGeometry args={[3.9, 0.04, 0.9]} /></mesh>
      <mesh position={[-1.3, 1.14, 0.1]} material={mat.steel} castShadow><boxGeometry args={[0.36, 0.4, 0.34]} /></mesh>
      <Model name="ceramic_vase_01" position={[0.6, 0.94, 0]} scale={0.8} />
      <Model name="potted_plant_04" position={[1.4, 0.94, 0.05]} scale={1.2} />
    </group>
  );
}

function Booth({ x }) {
  return (
    <group position={[x, 0, Z0 + 0.55]}>
      {[-0.5, 0.5].map(s => <mesh key={s} position={[s, 1.15, 0]} material={extra.shell} castShadow receiveShadow><boxGeometry args={[0.05, 2.3, 1.0]} /></mesh>)}
      <mesh position={[0, 1.15, -0.48]} material={extra.felt} receiveShadow><boxGeometry args={[0.95, 2.3, 0.04]} /></mesh>
      <mesh position={[0, 2.32, 0]} material={extra.shell} castShadow><boxGeometry args={[1.05, 0.05, 1.0]} /></mesh>
      <mesh position={[0, 1.15, 0.5]} material={mat.glass}><planeGeometry args={[0.95, 2.3]} /></mesh>
      <mesh position={[0, 1.02, -0.3]} material={mat.white} castShadow receiveShadow><boxGeometry args={[0.9, 0.03, 0.32]} /></mesh>
      <mesh position={[0, 0.3, 0.05]} material={extra.felt} castShadow><cylinderGeometry args={[0.18, 0.18, 0.6, 20]} /></mesh>
    </group>
  );
}

function BackRooms({ evening }) {
  return (
    <group>
      {/* glass front of huddle room + cabins, and the partitions between them */}
      <Glass from={[-9, FRONT]} to={[4, FRONT]} />
      {PARTITIONS.map(x => <Glass key={x} from={[x, Z0]} to={[x, FRONT]} />)}

      {/* huddle room: round table and screen */}
      <TV position={[-7, 1.45, Z0 + 0.03]} on={evening} />

      {/* three cabins */}
      {CABINS.map((cx, i) => (
        <group key={cx}>
          <Desk position={[cx, 0, -7.35]} />
          <group position={[cx + 0.2, 0.765, -7.5]} rotation={[0, Math.PI, 0]}><Monitor position={[0, 0, 0]} on={evening} /></group>
          <Model name="desk_lamp_arm_01" position={[cx - 0.75, 0.765, -7.55]} rotation={Math.PI / 2 + 0.3} />
          <ArtFrame position={[cx - 0.5, 1.65, Z0 + 0.02]} size={[0.7, 0.95]} variant={i % 2} />
          <Books position={[cx + 0.55, 0.765, -7.1]} count={4} seed={i + 3} />
        </group>
      ))}

      {/* phone booths and the boardroom */}
      {[4.75, 5.95, 7.15].map(x => <Booth key={x} x={x} />)}
      <Glass from={[BOARD_X, Z0]} to={[BOARD_X, BOARD_Z]} />
      <Glass from={[BOARD_X, BOARD_Z]} to={[X1, BOARD_Z]} />
      <BoardTable position={[11.6, 0, -5.4]} />
      <TV position={[11.6, 1.55, Z0 + 0.03]} on={evening} />
      <Model name="modern_wooden_cabinet" position={[11.6, 0, Z0 + 0.34]} />
    </group>
  );
}

function BoardTable({ position }) {
  const walnut = usePBR('walnut_dark', [1, 3], { roughness: 0.4 });
  const w = 1.4, l = 4.4, h = 0.75;
  return (
    <group position={position}>
      <RoundedBox args={[w, 0.06, l]} radius={0.025} smoothness={3} position={[0, h, 0]} material={walnut} castShadow receiveShadow />
      {[-l / 2 + 0.6, l / 2 - 0.6].map(z => (
        <mesh key={z} position={[0, h / 2, z]} material={mat.steel} castShadow><boxGeometry args={[0.9, h - 0.03, 0.06]} /></mesh>
      ))}
      <mesh position={[0, h + 0.031, 0]} material={mat.steel}><boxGeometry args={[0.3, 0.004, 0.9]} /></mesh>
    </group>
  );
}

/* ---------- repeated furniture ---------- */

function Instanced({ fabric, evening }) {
  const chair = useTaskChair();
  const desk = useBenchDesk(fabric, evening);
  const table = useCafeTable();

  const layout = useMemo(() => {
    let r = 7;
    const jitter = s => ((r = (r * 9301 + 49297) % 233280) / 233280 - 0.5) * s;
    const desks = [], chairs = [];
    CLUSTERS.forEach(([cx, cz]) => {
      for (let i = 0; i < 4; i++) {
        const x = cx + (i - 1.5) * BENCH_PITCH;
        desks.push([x, cz + 0.34, 0], [x, cz - 0.34, Math.PI]);
        chairs.push([x + jitter(0.12), cz + 0.98 + jitter(0.1), Math.PI + jitter(0.5)]);
        chairs.push([x + jitter(0.12), cz - 0.98 + jitter(0.1), jitter(0.5)]);
      }
    });
    CABINS.forEach(cx => chairs.push([cx, -8.05, jitter(0.3)]));
    chairs.push([11.5, 0.75, jitter(0.3)]); // reception
    const tables = [[-13.6, 2.0], [-13.6, 4.6], [-11.1, 2.0], [-11.1, 4.6], [-7, -7.2]];
    const dining = [
      // café: two chairs per table
      ...tables.slice(0, 4).flatMap(([x, z]) => [[x, z - 0.72, 0], [x, z + 0.72, Math.PI]]),
      // huddle room
      [-7.75, -7.2, Math.PI / 2], [-6.25, -7.2, -Math.PI / 2], [-7, -6.45, Math.PI],
      // cabin guests
      ...CABINS.flatMap(cx => [[cx - 0.45, -6.35, Math.PI], [cx + 0.45, -6.35, Math.PI]]),
      // boardroom: 5 a side
      ...[-1.6, -0.8, 0, 0.8, 1.6].flatMap(dz => [[10.65, -5.4 + dz, Math.PI / 2], [12.55, -5.4 + dz, -Math.PI / 2]]),
    ];
    return { desks, chairs, tables, dining };
  }, []);

  return (
    <group>
      <Kit kit={desk} items={layout.desks} />
      <Kit kit={chair} items={layout.chairs} />
      <Kit kit={table} items={layout.tables} />
      <Models name="dining_chair_02" items={layout.dining} />
      <Models name="modern_arm_chair_01" items={[
        [-13.1, -5.75, Math.PI + 0.2], [-11.3, -5.75, Math.PI - 0.2], // lounge
        [12.05, 4.75, Math.PI / 2 - 0.15], [12.05, 6.05, Math.PI / 2 + 0.15], // reception
      ]} />
      <Models name="modern_coffee_table_01" items={[[-12.2, -6.9, Math.PI / 2], [13.2, 5.4, 0]]} />
      <Models name="side_table_01" items={[[-14.35, -8.35, 0], [14.4, 3.7, 0]]} />
      <Models name="modern_ceiling_lamp_01" items={[
        [-12.2, -6.9], [-13.6, 2.0], [-13.6, 4.6], [-11.1, 2.0], [-11.1, 4.6], [-7, -7.2], [11.6, -6.5], [11.6, -4.3],
      ].map(([x, z]) => [x, z, 0, H - 1.17])} />
      <Models name="potted_plant_02" items={[
        [-14.4, -0.8, 0], [-9.3, -1.2, 1], [-9.3, 6.6, 2], [6.3, 8.3, 0.5], [14.4, -2.7, 1.2], [8.6, -8.4, 0, 0, 0.9], [14.4, -8.4, 2, 0, 0.9],
        [-8.7, -8.4, 0, 0, 0.8], [3.6, -8.4, 1, 0, 0.8],
      ]} />
      <Models name="potted_plant_01" items={[[-14.45, 6.4, 0, 0, 1.25], [14.4, 8.3, 1, 0, 1.25], [-2.4, 7.6, 2, 0, 1.1], [5.2, 7.6, 0, 0, 1.1]]} />
      <Models name="potted_plant_04" items={CLUSTERS.map(([cx, cz], i) => [cx + 2.45, cz + (i % 2 ? 0.55 : -0.55), i, 0.76, 1.1])} />
    </group>
  );
}

/* ---------- the floor ---------- */

export default function BigOffice({ floor, wall, fabric, evening }) {
  return (
    <group>
      <Suspense fallback={null}><Floor floor={floor} /></Suspense>
      <Shell />
      <WindowWall evening={evening} />
      <Suspense fallback={null}><Lounge wall={wall} fabric={fabric} /></Suspense>
      <Cafe />
      <BackRooms evening={evening} />
      <Suspense fallback={null}><Reception wall={wall} fabric={fabric} evening={evening} /></Suspense>
      <Suspense fallback={null}><Instanced fabric={fabric} evening={evening} /></Suspense>
    </group>
  );
}
