import Link from 'next/link';

import { getTermBySlug } from '@/lib/terms';

interface RelatedTermsProps {
  slugs: string[];
}

export default function RelatedTerms({ slugs }: RelatedTermsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {slugs.map(slug => {
        const term = getTermBySlug(slug);
        if (!term) return null;

        return (
          <Link
            key={slug}
            href={`/terms/${slug}`}
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px] transition-colors"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '0.5px solid var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            {term.term}
          </Link>
        );
      })}
    </div>
  );
}
