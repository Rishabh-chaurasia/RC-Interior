import { img } from './content.js';

/*
  "Our client work" ring gallery (components/ClientRing.jsx).

  To show real projects, for each one:
    1. put the photo in public/img/client-work/<file>.jpg (about 1600 px wide is plenty)
    2. put a small copy, about 360 px wide, in public/img/client-work/thumbs/<file>.jpg
    3. edit its entry below: client = client or project name, caption = one short line,
       alt = what the photo shows (read out by screen readers).
  Then set SAMPLE to false so the "sample" labels disappear.

  SAMPLE CONTENT: the 32 images below are AI-generated design concepts supplied as placeholders.
  They are not photographs of completed client projects, so they are labelled as samples.
*/
export const SAMPLE = true;

const rows = [
  ['01_reception', 'Reception', 'Stone reception desk with a lounge by the windows'],
  ['02_reception_waiting', 'Reception lounge', 'Waiting lounge in front of a carved timber wall'],
  ['03_boardroom', 'Boardroom', 'Twenty-seat boardroom with city views'],
  ['04_boardroom_executive', 'Executive boardroom', 'Oval table under a stone and walnut wall'],
  ['05_meeting_room_large', 'Large meeting room', 'Ten-seat meeting room with a screen wall'],
  ['06_meeting_room_small', 'Small meeting room', 'Round table and teal chairs for quick meetings'],
  ['07_meeting_room_glass', 'Glass meeting room', 'Glass-walled room off the main floor'],
  ['08_open_workstations', 'Open workstations', 'Long bench desks under exposed services'],
  ['09_workstations_compact', 'Compact workstations', 'Space-efficient desks along the glazing'],
  ['10_workstations_premium', 'Premium workstations', 'Timber desks with planters and city views'],
  ['11_founder_cabin', 'Founder’s cabin', 'Executive desk with a lit library wall'],
  ['12_director_cabin', 'Director’s cabin', 'Cabin with a sea-view lounge corner'],
  ['13_manager_cabin', 'Manager’s cabin', 'Glass-fronted cabin beside the workfloor'],
  ['14_collaboration_zone', 'Collaboration zone', 'Soft seating and shared tables for teams'],
  ['15_breakout_lounge', 'Breakout lounge', 'Mustard sofas and lounge chairs by the windows'],
  ['16_phone_booths', 'Phone booths', 'Walnut and glass booths for private calls'],
  ['17_focus_room', 'Focus room', 'Quiet desks for heads-down work'],
  ['18_training_room', 'Training room', 'Classroom seating facing a large screen'],
  ['19_auditorium', 'Auditorium', 'Tiered seating for town halls and launches'],
  ['20_pantry', 'Pantry', 'Timber pantry with an island and bar stools'],
  ['21_cafeteria', 'Cafeteria', 'Terrazzo-floored cafeteria for the whole team'],
  ['22_coffee_bar', 'Coffee bar', 'Terracotta coffee bar with pendant lights'],
  ['23_recreation_room', 'Recreation room', 'Table tennis and foosball for breaks'],
  ['24_wellness_room', 'Wellness room', 'Recliners and soft light for a reset'],
  ['25_library', 'Library', 'Book wall and a long communal table'],
  ['26_corridor', 'Corridor', 'Stone corridor between glass meeting rooms'],
  ['27_lift_lobby', 'Lift lobby', 'Timber-panelled lift lobby with a city view'],
  ['28_staircase', 'Feature staircase', 'Open timber staircase with planters'],
  ['29_storage_print_room', 'Print and storage', 'Built-in storage around the print station'],
  ['30_server_room', 'Server room', 'Raised-floor server room with cable trays'],
  ['31_washroom', 'Washroom', 'Stone vanity and timber cubicles'],
  ['32_terrace_breakout', 'Terrace breakout', 'Outdoor seating under a timber pergola'],
];

export const clientWork = rows.map(([file, title, caption], i) => ({
  id: file,
  src: img(`client-work/${file}.jpg`),
  thumb: img(`client-work/thumbs/${file}.jpg`),
  client: SAMPLE ? `Sample project ${String(i + 1).padStart(2, '0')}` : title,
  title,
  caption,
  alt: `${title}: ${caption.charAt(0).toLowerCase()}${caption.slice(1)}${SAMPLE ? ' (sample design concept)' : ''}`,
}));
