// All site copy and data in one place — edit here, not in the components.

export const img = name => `${import.meta.env.BASE_URL}img/${name}`;

export const contact = {
  phones: [
    { label: '+91 95603 74796', href: 'tel:+919560374796' },
    { label: '+91 96504 56779', href: 'tel:+919650456779' },
  ],
  email: 'amrc.ggn@gmail.com',
  whatsapp: '919560374796',
  address: ['5, Dhaniram Complex, Sikandarpur', 'Near Metro Pillar 54, Gurugram', 'Haryana 122002'],
  mapSrc: 'https://www.google.com/maps?q=Dhaniram+Complex+Sikanderpur+Gurugram+Haryana+122002&output=embed',
};

export const navLinks = [
  { id: 'studio', label: 'Studio' },
  { id: 'services', label: 'Services' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'work', label: 'Work' },
  { id: 'clients', label: 'Clients' },
  { id: 'team', label: 'Team' },
];

export const heroSlides = [
  { src: 'hero.jpg', tag: 'Design concept', caption: 'Double-height workplace atrium', alt: 'Double-height office atrium with timber panelling and lounge seating' },
  { src: 'atrium.jpg', tag: 'Design concept', caption: 'Light-filled open office', alt: 'Bright double-height open office with a long shared table and planters' },
  { src: 'boardroom.jpg', tag: 'Design concept', caption: 'Walnut-panelled boardroom', alt: 'Boardroom with walnut table and glass wall' },
  { src: 'openplan.jpg', tag: 'Design concept', caption: 'Open-plan workstations', alt: 'Open-plan office with timber pods and blue sofas' },
];

export const marqueeClients = ['Google', 'Samsung', 'Sony', 'Tech Mahindra', 'SBI Card', 'ICRA', 'Daikin', 'TCS', 'POSCO', 'Varun Beverages', 'Asahi Glass', 'Gabriel India', 'AECOM', 'CBRE', 'Max Healthcare', 'JK Cement', 'Home Credit', 'Ecom Express'];

export const statement = [
  { t: 'we make offices that work as hard as the people in them. With architects, designers and your own team, we turn bare floor plates into ' },
  { t: 'calm, productive, on-brand', em: true },
  { t: ' places to work.' },
];

export const stats = [
  { text: 'Years building workspaces across Delhi NCR', value: 19, suffix: '+' },
  { text: 'Enterprise clients, from Google to SBI Card', value: 30, suffix: '+' },
  { text: 'Specialists in design, 3D, site and MEP', value: 8, suffix: '' },
];

export const pillars = [
  { n: 'A', title: 'Who we are', text: 'An interior solutions company rethinking workplaces with new ideas and careful execution, working across Delhi NCR.' },
  { n: 'B', title: 'Vision', text: 'To set the standard for modern, sustainable design that inspires people and gives businesses room to grow.' },
  { n: 'C', title: 'Mission', text: 'World-class interiors through creativity, technology and smooth execution, so every project carries your brand and works on day one.' },
];

export const expertise = ['Corporate', 'Retail', 'Turnkey', 'Renovation', 'R&M'];

export const values = [
  { title: 'Innovation', text: 'New ideas that raise the bar for the workplace.' },
  { title: 'Integrity', text: 'Clear processes, clear pricing, partnerships you can trust.' },
  { title: 'Excellence', text: 'Quality you can see in every joint, edge and finish.' },
  { title: 'Sustainability', text: 'Designs that respect the future, and 1,000 trees for every project.' },
];

export const services = [
  {
    icon: 'plan', title: 'Design & Planning', wide: true, image: 'openplan.jpg',
    text: 'We map how your teams actually work, then design around it, down to the last light fitting.',
    chips: ['Space planning', 'Design concept', '3D visuals', 'Lighting plans', 'Colour & material', 'Branding elements'],
  },
  { icon: 'key', title: 'Turnkey Projects', image: 'atrium.jpg', text: 'One contract, one team, one handover date. Civil, services, furniture and finishing.' },
  { icon: 'shield', title: 'Electrical, HVAC & Fire', image: 'glass-corridor.jpg', text: 'The work behind the walls, done to code and fully documented.' },
  { icon: 'hammer', title: 'Renovation & Refurbishment', image: 'corridor.jpg', text: 'Refresh a reception or rebuild a floor while your business keeps running.' },
  { icon: 'wrench', title: 'Repair & Maintenance', image: 'storage.jpg', text: 'R&M contracts that keep your office looking like handover day.' },
];

export const styles = ['Modern', 'Traditional', 'Hybrid & Sustainable'];

export const spaces = [
  { title: 'Receptions', image: 'hero.jpg', text: 'The first ten seconds of your brand. Light, material and logo, working together.' },
  { title: 'Open plan', image: 'openplan.jpg', text: 'Workstations that encourage collaboration and flex with your teams.' },
  { title: 'Private cabins', image: 'executive.jpg', text: 'Focused, personal spaces with elegant furniture and good acoustics.' },
  { title: 'Boardrooms', image: 'boardroom.jpg', text: 'Rooms that make the big decisions feel considered.' },
  { title: 'Breakout & café', image: 'lounge.jpg', text: 'Comfortable corners where people recharge and ideas start.' },
];

export const whyCards = [
  { tag: 'Productivity', image: 'biophilic.jpg', text: 'Thoughtful design helps people focus and get more done.', alt: 'Bright office lounge with large plants' },
  { tag: 'Comfort', image: 'chair.jpg', text: 'Ergonomic furniture and layouts keep teams healthy and happy.', alt: 'Ergonomic mesh office chair' },
  { tag: 'Brand image', image: 'executive.jpg', text: 'Your space tells visitors who you are before anyone speaks.', alt: 'Executive office with walnut desk' },
  { tag: 'Balance', image: 'cafe.jpg', text: 'Open plan for teamwork, cabins for focus, breakout spaces to recharge.', alt: 'Sunlit café' },
];

// Design-concept gallery (generic renders). shape: 'tall' | 'wide'.
// Real client photos are NOT used here: they only open from the client list (see caseStudies).
export const projects = [
  { image: 'hero.jpg', client: 'Design concept', title: 'Double-height lobby', shape: 'tall' },
  { image: 'openplan.jpg', client: 'Design concept', title: 'Open workstations', shape: 'wide' },
  { image: 'executive.jpg', client: 'Design concept', title: 'Director’s office', shape: 'tall' },
  { image: 'boardroom.jpg', client: 'Design concept', title: 'Walnut boardroom', shape: 'wide' },
  { image: 'boardroom-2.jpg', client: 'Design concept', title: 'Meeting room', shape: 'tall' },
  { image: 'atrium.jpg', client: 'Design concept', title: 'Collaboration hall', shape: 'wide' },
  { image: 'glass-corridor.jpg', client: 'Design concept', title: 'Glass-fronted corridor', shape: 'tall' },
  { image: 'cafe.jpg', client: 'Design concept', title: 'Staff café', shape: 'tall' },
  { image: 'lounge.jpg', client: 'Design concept', title: 'Breakout lounge', shape: 'tall' },
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
