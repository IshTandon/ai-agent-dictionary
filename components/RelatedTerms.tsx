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
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-void-lighter px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-accent-indigo/40 hover:text-accent-indigo-light"
            >
              {label}
            </Link>
          );
        }
        return (
          <span
            key={slug}
            className="inline-flex items-center rounded-md border border-border bg-void-lighter px-3 py-1.5 text-xs text-text-muted"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
