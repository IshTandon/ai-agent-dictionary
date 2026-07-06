'use client';

import { useEffect, useState } from 'react';

import { trackTermView } from '@/lib/progress';
import { useProgress } from '@/lib/progress-context';

interface TermViewTrackerProps {
  slug: string;
}

export default function TermViewTracker({ slug }: TermViewTrackerProps) {
  const { viewedTerms, triggerUpdate } = useProgress();
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    trackTermView(slug);
    triggerUpdate();
    setLearned(true);
  }, [slug, triggerUpdate]);

  if (!learned && !viewedTerms.includes(slug)) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10B981' }}
    >
      ✓ Learned
    </span>
  );
}
