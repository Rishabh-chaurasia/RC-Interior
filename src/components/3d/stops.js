// Camera stops for the 3D walkthrough. Kept free of three.js imports so the page can read
// the captions without pulling the 3D bundle into the main chunk.
// pos = camera position, look = point the camera looks at (metres, y up).
export const STOPS = [
  {
    key: 'overview', label: 'Overview', title: 'One floor, planned end to end',
    text: 'Scroll to walk through an office we’d design: reception, workstations, a private cabin, a boardroom and a café.',
    pos: [8.5, 9.5, 11.5], look: [-1.2, 0.2, 0.3],
  },
  {
    key: 'reception', label: 'Reception', title: 'Reception',
    text: 'Fluted oak, a backlit logo and a curved desk. Your brand in the first ten seconds.',
    pos: [-0.2, 2.3, 6.3], look: [-4.6, 1.1, 2.2],
  },
  {
    key: 'work', label: 'Workstations', title: 'Workstations',
    text: 'Bench desks with colour-coded screens, planters for privacy and linear lights overhead.',
    pos: [3.9, 3.1, 4.9], look: [0, 0.7, -0.4],
  },
  {
    key: 'cabin', label: 'Private cabin', title: 'Private cabin',
    text: 'Glass for daylight, a frosted band for privacy, walnut and a credenza for calm.',
    pos: [1.3, 2.2, 1.0], look: [4.5, 0.9, -2.9],
  },
  {
    key: 'board', label: 'Boardroom', title: 'Boardroom',
    text: 'A walnut table for eight under a lime halo light, with a screen ready for the pitch.',
    pos: [0.8, 3.1, 6.3], look: [4.2, 1.2, 2.3],
  },
  {
    key: 'cafe', label: 'Café', title: 'Café & breakout',
    text: 'The room people actually talk in: a pantry, a high table and a sofa by the windows.',
    pos: [-0.4, 2.3, -1.0], look: [-3.9, 1.0, -2.6],
  },
  {
    key: 'end', label: 'Your floor', title: 'Your floor could be next',
    text: 'We plan every floor like this in 3D before a single wall goes up.',
    pos: [-9, 10, 10.5], look: [0, 0.3, 0], cta: true,
  },
];

/** Scroll progress (0–1) → fractional stop index, with a pause at each stop so captions can be read. */
export function stopFromProgress(p) {
  const s = Math.min(1, Math.max(0, p)) * (STOPS.length - 1);
  const i = Math.floor(s);
  const t = s - i;
  const hold = 0.18; // fraction of each segment spent parked at a stop
  const eased = Math.min(1, Math.max(0, (t - hold) / (1 - hold * 2)));
  return i + eased * eased * (3 - 2 * eased);
}

// Clickable zone labels, positioned in 3D and projected onto the screen by Walkthrough.jsx.
export const ZONES = [
  { stop: 1, label: 'Reception', position: [-4.5, 1.6, 2.4] },
  { stop: 2, label: 'Workstations', position: [0, 1.9, -0.2] },
  { stop: 3, label: 'Private cabin', position: [4.3, 3.0, -2.6] },
  { stop: 4, label: 'Boardroom', position: [4.1, 3.1, 2.3] },
  { stop: 5, label: 'Café', position: [-3.6, 2.5, -2.6] },
];
