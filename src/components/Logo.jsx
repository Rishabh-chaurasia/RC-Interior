import { WORDMARK_WIDTH, RC_PATH, INTERIOR_PATH, HOUSE, FLOOR, CHAIR_SOLID, CHAIR_LINES, CASTERS } from './logoPaths.js';

// Lime parts read --logo-mark, the chair and "RC" use currentColor, "INTERIOR" reads --logo-word.

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
