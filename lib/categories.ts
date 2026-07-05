import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Foundation',
  'Memory',
  'Tools',
  'Protocols',
  'Retrieval',
  'Orchestration',
  'Evaluation',
  'Security',
  'Observability',
];

export const CATEGORY_SLUGS: Record<Category, string> = {
  Foundation: 'foundation',
  Memory: 'memory',
  Tools: 'tools',
  Protocols: 'protocols',
  Retrieval: 'retrieval',
  Orchestration: 'orchestration',
  Evaluation: 'evaluation',
  Security: 'security',
  Observability: 'observability',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Foundation: '#6366F1',
  Memory: '#8B5CF6',
  Tools: '#F59E0B',
  Protocols: '#06B6D4',
  Retrieval: '#10B981',
  Orchestration: '#EC4899',
  Evaluation: '#14B8A6',
  Security: '#EF4444',
  Observability: '#F97316',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  Foundation: 'Core concepts every AI practitioner should know',
  Memory: 'How agents remember context across interactions',
  Tools: 'Extending agents with external capabilities',
  Protocols: 'Standards for agent communication and interop',
  Retrieval: 'Finding and surfacing relevant information',
  Orchestration: 'Coordinating multiple agents and workflows',
  Evaluation: 'Measuring agent quality and reliability',
  Security: 'Protecting agents from attacks and misuse',
  Observability: 'Monitoring and debugging agent behavior',
};

export function getCategoryFromSlug(slug: string): Category | null {
  const entry = Object.entries(CATEGORY_SLUGS).find(([, s]) => s === slug);
  return entry ? (entry[0] as Category) : null;
}
