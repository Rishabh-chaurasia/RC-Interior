import { WORDMARK_WIDTH, RC_PATH, INTERIOR_PATH } from './logoPaths.js';

// The RC house: lime roof + wall swept by a curve, a stepped floor line, and the chair inside.
// Lime parts read --logo-mark, the chair and "RC" use currentColor, "INTERIOR" reads --logo-word.
const HOUSE = 'M4 43 55 10l47 32A83 59 0 0 0 19 101V43Z';
const FLOOR = 'M19 101h58V77h15V63';
const CHAIR_SOLID = 'M45.6 67.6a1.6 1.6 0 0 1 2.9-1.2l5.5 13.6h-3.4zM50.5 80.5h17.5a2.3 2.3 0 0 1 0 4.6h-15.3z';
const CHAIR_LINES = 'M54 77.5c4.5-1.8 10-1.6 13.5.4M66 78v2.5M60 85v8M60 93l-5.5 4.2M60 93l5.5 4.2M60 93v4.5';
const CASTERS = [[54.2, 98.2], [65.8, 98.2], [60, 98.6]];

function House() {
  return (
    <>
      <path className="logo__house" d={HOUSE} />
      <path className="logo__floor" d={FLOOR} />
      <g className="logo__chair">
        <path d={CHAIR_SOLID} fill="currentColor" />
        <path d={CHAIR_LINES} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        {CASTERS.map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="1.3" fill="currentColor" />)}
      </g>
    </>
  );
}

export function LogoMark({ className = '' }) {
  return (
    <svg className={`logo-mark ${className}`} viewBox="0 0 106 104" aria-hidden="true">
      <House />
    </svg>
  );
}

/** Full RC Interior lockup; `tagline` adds "Your space | Your style | Your choice" underneath. */
export default function Logo({ className = '', tagline = false }) {
  return (
    <span className={`logo ${className}`}>
      <svg className="logo__art" viewBox={`0 0 ${WORDMARK_WIDTH} 104`} role="img" aria-label="RC Interior">
        <House />
        <path d={RC_PATH} fill="currentColor" />
        <path className="logo__word" d={INTERIOR_PATH} />
      </svg>
      {tagline && (
        <span className="logo__tag">Your space<i aria-hidden="true" />Your style<i aria-hidden="true" />Your choice</span>
      )}
    </span>
  );
}
