// src/components/Logo.jsx
//
// The KodPiksel mark: four ascending bars, standing in for progress /
// leveling up. Uses --teal at increasing opacity so it re-themes for free
// if the palette ever changes. Drop in anywhere the old "<>" glyph was:
//   <Logo size={20} />

export default function Logo({ size = 22, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2"  y="20" width="6" height="10" rx="1.5" fill="var(--teal)" opacity="0.5" />
      <rect x="10" y="14" width="6" height="16" rx="1.5" fill="var(--teal)" opacity="0.7" />
      <rect x="18" y="8"  width="6" height="22" rx="1.5" fill="var(--teal)" opacity="0.85" />
      <rect x="26" y="2"  width="6" height="28" rx="1.5" fill="var(--teal)" />
    </svg>
  );
}