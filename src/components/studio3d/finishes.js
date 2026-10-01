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

// The two sample projects: the director's office (Room.jsx) and a full corporate floor (BigOffice.jsx).
export const OFFICES = [
  { id: 'small', label: 'Director’s office', size: '750 sq ft' },
  { id: 'large', label: 'Corporate floor', size: '5,800 sq ft' },
];

export const VIEW_LABELS = {
  small: [
    { id: 'overview', label: 'Overview' },
    { id: 'desk', label: 'Director’s desk' },
    { id: 'lounge', label: 'Lounge' },
    { id: 'meeting', label: 'Meeting room' },
  ],
  large: [
    { id: 'overview', label: 'Overview' },
    { id: 'reception', label: 'Reception' },
    { id: 'work', label: 'Workstations' },
    { id: 'cabins', label: 'Cabins' },
    { id: 'boardroom', label: 'Boardroom' },
    { id: 'cafe', label: 'Café & lounge' },
  ],
};
