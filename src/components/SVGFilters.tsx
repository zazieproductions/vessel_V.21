export function SVGFilters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="melt0" x="-10%" y="-10%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="6" />
        </filter>
        <filter id="melt1" x="-10%" y="-10%" width="120%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="18" />
        </filter>
        <filter id="rgbSplit">
          <feOffset in="SourceGraphic" dx="-2" dy="0" result="a" />
          <feOffset in="SourceGraphic" dx="2" dy="1" result="b" />
          <feColorMatrix in="a" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="ar" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bc" />
          <feBlend in="ar" in2="SourceGraphic" mode="screen" result="m" />
          <feBlend in="m" in2="bc" mode="screen" />
        </filter>
        <filter id="velDistort" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="1" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="8" />
        </filter>
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
