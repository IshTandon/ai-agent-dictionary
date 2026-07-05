import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getAllSlugs, getTermBySlug } from '@/lib/terms';
import TermCard from '@/components/TermCard';

interface TermPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) return {};
  return {
    title: `${term.term} | AI Agent Dictionary`,
    description: term.definition_plain.slice(0, 160),
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();
  return <TermCard term={term} />;
}
