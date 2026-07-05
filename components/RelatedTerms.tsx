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
              className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              {label}
            </Link>
          );
        }
        return (
          <span
            key={slug}
            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
