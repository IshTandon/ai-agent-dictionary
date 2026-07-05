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
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow"
            >
              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {label}
            </Link>
          );
        }
        return (
          <span
            key={slug}
            className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-3.5 py-1.5 text-[13px] text-gray-400"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
