'use client';

import { useEffect, useState } from 'react';

import { trackTermView, getProgress } from '@/lib/progress';

interface TermViewTrackerProps {
  slug: string;
}

export default function TermViewTracker({ slug }: TermViewTrackerProps) {
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    trackTermView(slug);
    const p = getProgress();
    setLearned(p.viewed_terms.includes(slug));
  }, [slug]);

  if (!learned) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
      ✓ Learned
    </span>
  );
}
