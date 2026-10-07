// All site copy and data in one place — edit here, not in the components.

export const img = name => `${import.meta.env.BASE_URL}img/${name}`;

export const contact = {
  phones: [
    { label: '+91 96504 56779', href: 'tel:+919650456779', type: 'Mobile' },
    { label: '+91 124 407 3017', href: 'tel:+911244073017', type: 'Office' },
  ],
  email: 'info@rcinterior.co.in',
  website: { label: 'www.rcinterior.co.in', href: 'https://www.rcinterior.co.in' },
  whatsapp: '919650456779',
  address: ['5, Dhaniram Complex, Sikandarpur', 'Near Metro Pillar 54, Gurugram', 'Haryana 122002'],
  mapSrc: 'https://www.google.com/maps?q=Dhaniram+Complex+Sikanderpur+Gurugram+Haryana+122002&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Dhaniram+Complex+Sikanderpur+Gurugram+Haryana+122002',
};

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'design3d', label: '3D Studio' },
  { id: 'work', label: 'Work' },
  { id: 'clients', label: 'Clients' },
  { id: 'team', label: 'Team' },
];

export const heroSlides = [
  { src: 'spaces/reception-1.jpg', caption: 'Reception in stone and walnut', alt: 'Office reception with a stone desk, walnut wall and pendant lights' },
  { src: 'spaces/workstation-4.jpg', caption: 'Open-plan workstations', alt: 'Long rows of workstations under linear lights' },
  { src: 'spaces/boardroom-1.jpg', caption: 'Boardroom with a view', alt: 'Boardroom with a long table and floor-to-ceiling windows' },
  { src: 'spaces/lounge-2.jpg', caption: 'Green breakout lounge', alt: 'Breakout lounge with a planted wall and soft seating' },
];

// Client logos for the scrolling strip (public/img/logos/). bg = the logo's own background, used for its card.
export const clientLogos = [
  { name: 'Google', file: 'google.svg' },
  { name: 'Samsung', file: 'samsung.svg' },
  { name: 'Sony', file: 'sony.png', bg: '#000000' },
  { name: 'Tech Mahindra', file: 'techmahindra.svg' },
  { name: 'SBI Card', file: 'sbicard.png' },
  { name: 'ICRA', file: 'icra.png' },
  { name: 'Daikin', file: 'daikin.png' },
  { name: 'TCS', file: 'tcs.svg' },
  { name: 'POSCO', file: 'posco.png', bg: '#00588a' },
  { name: 'Varun Beverages', file: 'varun.png' },
  { name: 'AGC Asahi Glass', file: 'agc.png' },
  { name: 'AECOM', file: 'aecom.png' },
  { name: 'CBRE', file: 'cbre.png', bg: '#003f2d' },
  { name: 'Max Healthcare', file: 'max.png' },
  { name: 'JK Cement', file: 'jkcement.png' },
  { name: 'Home Credit', file: 'homecredit.png', bg: '#cf0e2d' },
  { name: 'Ecom Express', file: 'ecom.png' },
];

export const statement = [
  { t: 'we make offices that work as hard as the people in them. With architects, designers and your own team, we turn bare floor plates into ' },
  { t: 'calm, productive, on-brand', em: true },
  { t: ' places to work.' },
];

export const stats = [
  { text: 'Years building workspaces across Delhi NCR', value: 19, suffix: '+' },
  { text: 'Enterprise clients, from Google, Samsung and Sony to ICRA and Bloom Hotels', value: 30, suffix: '+' },
  { text: 'Specialists in projects, design, 3D, MEP and R&M', value: 8, suffix: '' },
];

export const pillars = [
  { n: 'A', title: 'Who are we', text: 'An interior solutions company rethinking workplaces with new ideas, careful execution and committed timelines, working across Delhi NCR.' },
  { n: 'B', title: 'Vision', text: 'To set the standard for modern, sustainable design that inspires people and gives businesses room to grow.' },
  { n: 'C', title: 'Mission', text: 'World-class interiors through creativity, technology and smooth execution, so every project carries your brand and works on day one.' },
];

export const expertise = ['Corporate', 'Retail', 'Turnkey', 'Renovation', 'MEP', 'R&M'];

// tone picks the accent colour (see .value--* in styles.css); icon is drawn in Values.jsx
export const values = [
  {
    title: 'Innovation', tag: 'New ideas', tone: 'lime', icon: 'spark', image: 'spaces/sm/cowork-3.jpg',
    text: 'We bring fresh thinking to every brief, so your office works better than the one you left.',
    points: ['Space plans built around how your teams work', '3D walkthroughs before anything is built', 'Flexible furniture that grows with you'],
    badge: ['Fresh thinking', 'on every project'],
  },
  {
    title: 'Integrity', tag: 'Transparency', tone: 'oak', icon: 'shield', image: 'spaces/sm/meeting-1.jpg',
    text: 'Clear processes, clear pricing and partnerships you can trust from the first meeting to handover.',
    points: ['Itemised quotations, no hidden costs', 'Timelines agreed in writing', 'One point of contact throughout'],
    badge: ['Clear pricing', 'no surprises'],
  },
  {
    title: 'Excellence', tag: 'Quality', tone: 'teal', icon: 'star', image: 'spaces/sm/reception-3.jpg',
    text: 'Quality you can see in every joint, edge and finish, checked by our own site team.',
    points: ['Premium, tested materials', 'In-house site supervision', 'Snag-free handover'],
    badge: ['Crafted finish', 'every detail'],
  },
  {
    title: 'Sustainability', tag: 'Green', tone: 'green', icon: 'leaf', image: 'csr/plant-1.jpg',
    text: 'Designs that respect the future, with lower running costs for you and more trees for everyone.',
    points: ['Energy-efficient lighting and HVAC', 'Low-VOC paints and certified woods', '100 trees planted for every project'],
    badge: ['100 trees', 'per project'],
  },
];

export const services = [
  {
    icon: 'plan', title: 'Design & Planning', wide: true, image: 'spaces/sm/cowork-1.jpg',
    text: 'We map how your teams actually work, then design around it, down to the last light fitting.',
    chips: ['Space planning', 'Concept design', '3D visuals', 'Lighting plans', 'Colour & material', 'Branding elements'],
  },
  { icon: 'key', title: 'Turnkey Projects', image: 'spaces/sm/workstation-1.jpg', text: 'One contract, one team, one handover date. Civil, services, furniture and finishing.' },
  { icon: 'shield', title: 'Electrical, HVAC & Fire', image: 'spaces/sm/meeting-4.jpg', text: 'The work behind the walls, done to code and fully documented.' },
  { icon: 'hammer', title: 'Renovation & Refurbishment', image: 'spaces/sm/entrance-2.jpg', text: 'Refresh a reception or rebuild a floor while your business keeps running.' },
  { icon: 'wrench', title: 'Repair & Maintenance', image: 'spaces/sm/pantry-2.jpg', text: 'R&M contracts that keep your office looking like handover day.' },
];

export const styles = ['Modern', 'Traditional', 'Hybrid & Sustainable'];

// Every zone of an office. Clicking a zone opens its 6 photos as a slideshow.
// Photos live in public/img/spaces/<key>-1..6.jpg (full size) and spaces/sm/ (1000px, for panels).
export const spaces = [
  {
    key: 'entrance', title: 'Entrance & lobby', text: 'The walk from the lift to your door: flooring, lighting and wayfinding that set the tone.',
    photos: ['Marble lobby with timber accents', 'Marble lift lobby', 'Glass entrance onto a green court', 'Entrance with fluted glass screens', 'Lift lobby with a green wall', 'Grand lobby with a slatted ceiling'],
  },
  {
    key: 'reception', title: 'Reception', text: 'The first ten seconds of your brand. Light, material and logo, working together.',
    photos: ['Stone desk against walnut panelling', 'Warm timber reception', 'Fluted oak desk', 'Lounge reception with halo lights', 'Backlit onyx counter', 'Curved reception with slatted wall'],
  },
  {
    key: 'workstation', title: 'Workstations', text: 'Bench desks and open plan that flex with your teams, with good light and acoustics.',
    photos: ['Open plan with a feature ceiling', 'White workstations with task chairs', 'Long bench desks', 'Rows of workstations', 'Desks beside a living wall', 'Timber bench desks'],
  },
  {
    key: 'cabin', title: 'Private cabins', text: 'Focused, personal spaces with elegant furniture, storage and privacy.',
    photos: ['Dark timber cabin', 'Director’s desk with display wall', 'Cabin with a stone feature wall', 'Glass-fronted manager cabin', 'Corner cabin with lounge', 'Compact cabin with storage'],
  },
  {
    key: 'boardroom', title: 'Boardrooms', text: 'Rooms that make the big decisions feel considered.',
    photos: ['Boardroom with a skyline view', 'Timber table by the windows', 'White boardroom for twenty', 'Boardroom with a video wall', 'Glass-walled boardroom', 'Classic walnut boardroom'],
  },
  {
    key: 'meeting', title: 'Meeting rooms', text: 'Rooms for four to twelve, ready for video calls and whiteboards.',
    photos: ['Meeting room with a screen wall', 'Glass meeting room', 'Curtained meeting room', 'Long meeting table by the window', 'Round table meeting room', 'Meeting room with a garden view'],
  },
  {
    key: 'cowork', title: 'Collaboration zones', text: 'Informal places to plan, pair and present without booking a room.',
    photos: ['Shared tables under pendants', 'Lounge corner with a pin-up wall', 'Stepped seating with cushions', 'Round table beside timber screens', 'Stepped seating for town halls', 'Long team tables'],
  },
  {
    key: 'lounge', title: 'Breakout lounge', text: 'Comfortable corners where people recharge and ideas start.',
    photos: ['Bright lounge with armchairs', 'Planted lounge wall', 'Lounge with a curved sofa', 'Modular sofa lounge', 'Lounge along a glass corridor', 'Lounge with indoor trees'],
  },
  {
    key: 'pantry', title: 'Pantry & café', text: 'A kitchen people actually want to eat in, with room for the whole team.',
    photos: ['Café with a planted ceiling', 'Pantry with a long table', 'Café with a high counter', 'Minimal pantry bar', 'Timber-lined café', 'Food counter and café'],
  },
].map(s => ({
  ...s,
  image: `spaces/sm/${s.key}-1.jpg`,
  gallery: s.photos.map((title, i) => ({ image: `spaces/${s.key}-${i + 1}.jpg`, title })),
}));

export const whyCards = [
  { tag: 'Productivity', image: 'spaces/sm/workstation-5.jpg', text: 'Thoughtful design helps people focus and get more done.', alt: 'Desks beside a living green wall' },
  { tag: 'Comfort', image: 'spaces/sm/lounge-1.jpg', text: 'Ergonomic furniture and layouts keep teams healthy and happy.', alt: 'Bright lounge with armchairs' },
  { tag: 'Brand image', image: 'spaces/sm/reception-5.jpg', text: 'Your space tells visitors who you are before anyone speaks.', alt: 'Reception with a backlit counter' },
  { tag: 'Balance', image: 'spaces/sm/cowork-5.jpg', text: 'Open plan for teamwork, cabins for focus, breakout spaces to recharge.', alt: 'Stepped seating and high tables' },
];

// Gallery of office interiors. shape: 'tall' | 'wide'.
// Real client photos are NOT used here: they only open from the client list (see caseStudies).
export const projects = [
  { image: 'spaces/reception-2.jpg', title: 'Timber reception', shape: 'tall' },
  { image: 'spaces/workstation-3.jpg', title: 'Open workstations', shape: 'wide' },
  { image: 'spaces/cabin-3.jpg', title: 'Director’s cabin', shape: 'tall' },
  { image: 'spaces/boardroom-4.jpg', title: 'Boardroom', shape: 'wide' },
  { image: 'spaces/meeting-5.jpg', title: 'Meeting room', shape: 'tall' },
  { image: 'spaces/lounge-3.jpg', title: 'Breakout lounge', shape: 'wide' },
  { image: 'spaces/pantry-1.jpg', title: 'Staff café', shape: 'tall' },
  { image: 'spaces/cowork-2.jpg', title: 'Collaboration area', shape: 'tall' },
  { image: 'spaces/entrance-3.jpg', title: 'Entrance', shape: 'tall' },
];

// Real finished projects. These photos appear ONLY when a visitor clicks the client in the client list.
// Add a client here (with its photos in public/img/) and its name becomes clickable automatically.
export const caseStudies = {
  'ICRA Ltd': {
    place: 'Gurugram',
    images: [
      { image: 'icra-reception.jpg', title: 'Reception & arrival' },
      { image: 'icra-workstations.jpg', title: 'Open workstations' },
      { image: 'icra-open.jpg', title: 'Office floor' },
      { image: 'icra-desks.jpg', title: 'Workstation bay' },
      { image: 'icra-cabin.jpg', title: 'Director’s cabin' },
      { image: 'icra-cabin-2.jpg', title: 'Manager’s cabin' },
    ],
  },
};

// Swatches are zoomed-in crops of design-concept photos: pos = focal point, zoom = background-size
export const materials = [
  { name: 'Walnut veneer', use: 'Tables & panelling', image: 'boardroom.jpg', pos: '50% 88%', zoom: '520%' },
  { name: 'Fluted timber', use: 'Feature walls', image: 'lounge.jpg', pos: '100% 25%', zoom: '700%' },
  { name: 'Polished stone', use: 'Receptions & lobbies', image: 'corridor.jpg', pos: '50% 95%', zoom: '500%' },
  { name: 'Terrazzo', use: 'Cafés & corridors', image: 'cafe.jpg', pos: '85% 95%', zoom: '500%' },
  { name: 'Light oak', use: 'Partitions & doors', image: 'glass-corridor.jpg', pos: '6% 50%', zoom: '420%' },
];

export const steps = [
  { title: 'Consult', text: 'Site visit, brief, budget and timeline, agreed in writing.' },
  { title: 'Design', text: 'Space plans, materials and 3D visuals you can walk through.' },
  { title: 'Build', text: 'Civil, MEP, fire safety and furniture, run by our site managers.' },
  { title: 'Handover', text: 'Snag-free, on the agreed date. Then R&M for as long as you need.' },
];

export const testimonials = [
  { quote: 'Working with RC Interior was an absolute pleasure. From the first consultation to the final handover, their team was professional, creative and attentive to our needs.', name: 'Ashish', company: 'ICRA' },
  { quote: 'RC designers transformed our reception and created a recreation room that’s modern and cosy. It’s a space we now love spending time in.', name: 'Naveen Singh', company: 'SBI Card' },
  { quote: 'The attention to detail and the quality of RC Interior’s work exceeded our expectations. We’d recommend RC to anyone looking to lift their office interior.', name: 'Omesh Chauhan', company: 'Samsung SDS' },
  { quote: 'RC Interiors turned our office into a modern, functional space that truly reflects our brand. Their respect for deadlines made the whole process seamless.', name: 'Bhudev Sharma', company: 'Sony India' },
  { quote: 'A workspace that balances sophistication with function. The design improved collaboration and leaves a lasting impression on visiting clients.', name: 'C. Ram', company: 'AIA' },
  { quote: 'The transformation of our corporate headquarters was remarkable. They optimised space, raised safety standards and created an inspiring place for our people.', name: 'Rajesh Yadav', company: 'Gabriel India' },
];

export const clients = ['Google', 'Samsung', 'Sony', 'Samsung SDS', 'Tech Mahindra', 'TCS', 'SBI Card', 'ICRA Ltd', 'Home Credit', 'Ecom Express', 'POSCO India', 'Varun Beverages', 'Asahi Glass', 'Daikin', 'Gabriel India', 'AECOM', 'CB&I', 'Max Healthcare', 'Fluor Daniel', 'CBRE', 'Jakson Ltd', 'ISTD', 'BPTP', 'JK Cement', 'Devyani Food', 'Bloom Hotels', 'Tata Technologies', 'UPS Supply Chain', 'RJ Corp'];

// Logo shown when a client name in the grid is hovered (public/img/logos/). bg = the logo's own background;
// w / h override the default max logo size (72% / 58% of the cell) for very wide or square marks.
// Clients without a logo entry simply keep showing their name. Devyani Food Industries trades as Cream Bell,
// so its cell shows the Cream Bell mark (white on the blue of its packs).
export const clientLogoMap = {
  'Google': { file: 'google.svg' }, 'Samsung': { file: 'samsung.svg' }, 'Sony': { file: 'sony.png', bg: '#000000' },
  'Samsung SDS': { file: 'samsungsds.png' }, 'Tech Mahindra': { file: 'techmahindra.svg' }, 'TCS': { file: 'tcs.svg' },
  'SBI Card': { file: 'sbicard.png' }, 'ICRA Ltd': { file: 'icra.png' }, 'Home Credit': { file: 'homecredit.png', bg: '#cf0e2d' },
  'Ecom Express': { file: 'ecom.png' }, 'POSCO India': { file: 'posco.png', bg: '#00588a' }, 'Varun Beverages': { file: 'varun.png' },
  'Asahi Glass': { file: 'agc.png' }, 'Daikin': { file: 'daikin.png' }, 'AECOM': { file: 'aecom.png' },
  'Max Healthcare': { file: 'max.png' }, 'Fluor Daniel': { file: 'fluor.png', bg: '#004681' }, 'CBRE': { file: 'cbre.png', bg: '#003f2d' },
  'Jakson Ltd': { file: 'jakson.png' }, 'ISTD': { file: 'istd.png' }, 'BPTP': { file: 'bptp.png' }, 'JK Cement': { file: 'jkcement.png' },
  'Tata Technologies': { file: 'tatatech.png' }, 'UPS Supply Chain': { file: 'ups.png' }, 'RJ Corp': { file: 'rjcorp.png' },
  'Gabriel India': { file: 'gabriel.png', w: '84%' }, 'CB&I': { file: 'cbi.png', h: '76%' },
  'Devyani Food': { file: 'creambell.png', bg: '#2179b6', h: '88%' }, 'Bloom Hotels': { file: 'bloom.svg', bg: '#231f20' },
};

export const team = [
  { initials: 'BK', name: 'Brijesh Kumar', role: 'Project Head' },
  { initials: 'AN', name: 'A. Narayan', role: 'Project Lead, Design & Site' },
  { initials: 'AK', name: 'Ajit Kumar', role: 'Project & Interior Designer' },
  { initials: 'RS', name: 'Rahul Singh', role: 'Corporate Designer' },
  { initials: 'SS', name: 'Shivam Sharma', role: 'AutoCAD / 3D Expert' },
  { initials: 'SU', name: 'Surender Singh', role: 'Site Manager' },
  { initials: 'US', name: 'Utsav Sinha', role: 'Technical Expert' },
  { initials: 'SH', name: 'Sheetal Singh', role: 'Client Coordinator' },
];

export const csrPoints = [
  { title: 'Environmental responsibility', text: 'Cutting our carbon footprint and restoring balance.' },
  { title: 'Community engagement', text: 'Local communities plant and care for the trees.' },
  { title: 'Sustainable growth', text: 'Business success that goes hand in hand with stewardship.' },
];

export const needs = [
  { value: 'New office fit-out', label: 'New office' },
  { value: 'Renovation', label: 'Renovation' },
  { value: 'Turnkey project', label: 'Turnkey' },
  { value: 'Retail interior', label: 'Retail' },
  { value: 'Repair & maintenance', label: 'R&M' },
];
