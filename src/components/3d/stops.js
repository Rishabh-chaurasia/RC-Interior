// Stops of the "walk through" section: real office photographs, one per zone.
// Scroll progress moves from one stop to the next; see Showcase3D.jsx.
export const STOPS = [
  {
    key: 'entrance', label: 'Entrance', image: 'spaces/entrance-6.jpg', focus: '50% 55%',
    title: 'Walk in through the lobby',
    text: 'Scroll to walk through an office the way your visitors will: lobby, reception, workfloor, cabins, boardroom and café.',
  },
  {
    key: 'reception', label: 'Reception', image: 'spaces/reception-1.jpg', focus: '55% 60%',
    title: 'Reception',
    text: 'Stone, walnut and warm light. Your brand in the first ten seconds.',
  },
  {
    key: 'work', label: 'Workstations', image: 'spaces/workstation-1.jpg', focus: '45% 60%',
    title: 'Workstations',
    text: 'Bench desks, acoustic ceilings and daylight, planned around how your teams work.',
  },
  {
    key: 'cabin', label: 'Private cabin', image: 'spaces/cabin-3.jpg', focus: '50% 55%',
    title: 'Private cabin',
    text: 'A feature wall, built-in storage and a desk sized for real work.',
  },
  {
    key: 'board', label: 'Boardroom', image: 'spaces/boardroom-2.jpg', focus: '50% 55%',
    title: 'Boardroom',
    text: 'A long timber table, city views and everything ready for the pitch.',
  },
  {
    key: 'collab', label: 'Collaboration', image: 'spaces/cowork-1.jpg', focus: '45% 60%',
    title: 'Collaboration zone',
    text: 'Soft seating and shared tables where teams meet without booking a room.',
  },
  {
    key: 'cafe', label: 'Café', image: 'spaces/pantry-1.jpg', focus: '50% 55%',
    title: 'Café & pantry',
    text: 'The room people actually talk in, with a planted ceiling and space for everyone.',
  },
  {
    key: 'end', label: 'Your office', image: 'spaces/lounge-6.jpg', focus: '50% 50%',
    title: 'Your office could be next',
    text: 'We design and build every zone of your floor, from the front door to the café.',
    cta: true,
  },
];

/** Scroll progress (0–1) → fractional stop index, with a pause at each stop so captions can be read. */
export function stopFromProgress(p) {
  const s = Math.min(1, Math.max(0, p)) * (STOPS.length - 1);
  const i = Math.floor(s);
  const t = s - i;
  const hold = 0.2; // fraction of each segment spent parked at a stop
  const eased = Math.min(1, Math.max(0, (t - hold) / (1 - hold * 2)));
  return i + eased * eased * (3 - 2 * eased);
}
