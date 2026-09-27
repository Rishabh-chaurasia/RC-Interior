// Finish options for the 3D studio. Plain data (no three.js) so the page can render the
// switcher before the 3D bundle loads. id = folder in public/3d/tex/.
export const FINISHES = {
  floor: [
    { id: 'herringbone_parquet', label: 'Oak parquet', repeat: 3.2, roughness: 0.62, useRoughMap: false },
    { id: 'dark_wooden_planks', label: 'Dark planks', repeat: 2.6, roughness: 1 },
    { id: 'concrete_grey', label: 'Concrete', repeat: 2.4, roughness: 1 },
    { id: 'marble_tiles', label: 'Terrazzo', repeat: 2.6, roughness: 1 },
  ],
  wall: [
    { id: 'walnut_dark', label: 'Walnut slats' },
    { id: 'oak_light', label: 'Oak slats' },
    { id: 'marble_01', label: 'Stone' },
    { id: 'plaster_white', label: 'Plaster' },
  ],
  fabric: [
    { id: 'linen_sand', label: 'Sand linen' },
    { id: 'wool_grey', label: 'Grey wool' },
    { id: 'linen_olive', label: 'Olive linen' },
  ],
};

export const DEFAULT_FINISHES = { floor: 'herringbone_parquet', wall: 'walnut_dark', fabric: 'linen_sand' };

export const VIEW_LABELS = [
  { id: 'overview', label: 'Overview' },
  { id: 'desk', label: 'Director’s desk' },
  { id: 'lounge', label: 'Lounge' },
  { id: 'meeting', label: 'Meeting room' },
];
