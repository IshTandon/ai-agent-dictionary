interface TierBadgeProps {
  tier: 1 | 2 | 3;
}

const TIER_CONFIG = {
  1: { label: 'Tier 1 — Full', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  2: { label: 'Tier 2 — Deep', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  3: { label: 'Tier 3 — Core', color: 'bg-slate-100 text-slate-700 border-slate-300' },
} as const;

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
