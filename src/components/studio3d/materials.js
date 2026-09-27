import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { FINISHES } from './finishes.js';

const base = import.meta.env.BASE_URL;
export const asset = p => `${base}3d/${p}`;
export { FINISHES };

const paths = id => [asset(`tex/${id}/diff.webp`), asset(`tex/${id}/nor.webp`), asset(`tex/${id}/rough.webp`)];

/** Always-used textures (walls, desk, rug) plus every finish option, so switching is instant. */
export const STATIC_TEXTURES = ['plaster_white', 'walnut_dark', 'rug_cream'];
export function preloadFinishes() {
  Object.values(FINISHES).flat().forEach(f => useTexture.preload(paths(f.id)));
}

/**
 * A tiling PBR material from a texture set in public/3d/tex/<id>/.
 * repeat = [u, v] tiles across the surface; opts.useRoughMap=false ignores the roughness map
 * (some sets ship an almost-black map that makes floors look wet); extra = material props.
 */
export function usePBR(id, repeat = [1, 1], extra = {}, opts = {}) {
  const [map, normalMap, roughnessMap] = useTexture(paths(id));
  const useRough = opts.useRoughMap !== false;
  return useMemo(() => {
    const clone = (t, srgb) => {
      const c = t.clone();
      c.wrapS = c.wrapT = THREE.RepeatWrapping;
      c.repeat.set(repeat[0], repeat[1]);
      c.anisotropy = 8;
      c.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      c.needsUpdate = true;
      return c;
    };
    return new THREE.MeshStandardMaterial({
      map: clone(map, true),
      normalMap: clone(normalMap, false),
      roughnessMap: useRough ? clone(roughnessMap, false) : null,
      normalScale: new THREE.Vector2(0.7, 0.7),
      ...extra,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, normalMap, roughnessMap, repeat[0], repeat[1], useRough, extra.roughness, extra.color]);
}
