export function LogoMark({ size = 40, light = false }) {
  return (
    <svg width={size} height={size * 0.96} viewBox="4 4 92 88" aria-hidden="true">
      <rect x="14" y="62" width="18" height="24" rx="5" fill="#FFB49E" />
      <rect x="40" y="46" width="18" height="40" rx="5" fill="#FF6B4A" />
      <rect x="66" y="30" width="18" height="56" rx="5" fill={light ? '#FFF8EF' : '#0F5132'} />
      <path d="M75 30 Q75 18 82 10" stroke="#2E8B5E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path transform="translate(80 12) rotate(-40)" d="M0 0 Q9.0 -8.1 18 0 Q9.0 8.1 0 0Z" fill="#2E8B5E" />
      <path transform="translate(77 18) rotate(200)" d="M0 0 Q7.0 -6.3 14 0 Q7.0 6.3 0 0Z" fill="#7BC4A2" />
    </svg>
  );
}

export default function Logo({ size = 40, light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size} light={light} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-extrabold ${light ? 'text-cream' : 'text-forest'}`} style={{ fontSize: size * 0.62 }}>צומחים</span>
        <span className={`${light ? 'text-mint' : 'text-muted'} mt-1`} style={{ fontSize: Math.max(11, size * 0.27) }}>חינוך פיננסי לנוער</span>
      </span>
    </span>
  );
}
