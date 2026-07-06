interface TierBadgeProps {
  tier: 1 | 2 | 3;
}

const TIER_CONFIG = {
  1: { label: 'Deep dive', color: '#F5A623' },
  2: { label: 'Detailed', color: '#A78BFA' },
  3: { label: 'Core', color: '#4A5580' },
} as const;

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}4D`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
