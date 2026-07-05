interface TierBadgeProps {
  tier: 1 | 2 | 3;
}

const TIER_CONFIG = {
  1: { label: 'Deep dive', color: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200/60 ring-1 ring-amber-100' },
  2: { label: 'Detailed', color: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/60 ring-1 ring-blue-100' },
  3: { label: 'Core', color: 'bg-gray-50 text-gray-600 border-gray-200/60 ring-1 ring-gray-100' },
} as const;

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
