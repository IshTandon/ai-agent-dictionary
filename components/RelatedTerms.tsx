import Link from 'next/link';

import { getAllSlugs } from '@/lib/terms';

interface RelatedTermsProps {
  slugs: string[];
}

export default function RelatedTerms({ slugs }: RelatedTermsProps) {
  const existingSlugs = new Set(getAllSlugs());

  return (
    <div className="flex flex-wrap gap-2">
      {slugs.map(slug => {
        const label = slug.replace(/-/g, ' ');
        if (existingSlugs.has(slug)) {
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
              {label}
            </Link>
          );
        }
        return (
          <span
            key={slug}
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px]"
            style={{
              backgroundColor: 'var(--color-card)',
              border: '0.5px solid var(--color-border)',
              color: 'var(--color-dim)',
            }}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
