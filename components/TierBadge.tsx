interface TierBadgeProps {
  tier: 1 | 2 | 3;
}

const TIER_CONFIG = {
  1: { label: 'Deep dive', dotColor: '#F59E0B' },
  2: { label: 'Detailed', dotColor: '#6366F1' },
  3: { label: 'Core', dotColor: '#6B6B80' },
} as const;

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: config.dotColor }}
      />
      {config.label}
    </span>
  );
}
