import { Metadata } from 'next';
import Link from 'next/link';

import PeriodicTableView from '@/components/PeriodicTableView';

export const metadata: Metadata = {
  title: 'Periodic Table of AI | AgentDict',
  description: 'The 17 core AI concepts arranged as a periodic table — primitives, compositions, deployment, and emerging paradigms.',
};

type Group = 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

const ELEMENTS = [
  { sym: 'Pr', name: 'Prompting',            row: 1, group: 'G1' as Group, num: 1,  slug: 'prompt-injection' },
  { sym: 'Em', name: 'Embeddings',           row: 1, group: 'G2' as Group, num: 2,  slug: 'embedding' },
  { sym: 'Lg', name: 'Large Language Model', row: 1, group: 'G5' as Group, num: 3,  slug: 'context-window' },
  { sym: 'Fc', name: 'Function Calling',     row: 2, group: 'G1' as Group, num: 4,  slug: 'tool-use' },
  { sym: 'Vx', name: 'Vector Databases',     row: 2, group: 'G2' as Group, num: 5,  slug: 'vector-store' },
  { sym: 'Rg', name: 'RAG',                  row: 2, group: 'G3' as Group, num: 6,  slug: 'rag' },
  { sym: 'Gr', name: 'Guardrails',           row: 2, group: 'G4' as Group, num: 7,  slug: 'guardrail' },
  { sym: 'Mm', name: 'Multi-modal Models',   row: 2, group: 'G5' as Group, num: 8,  slug: null },
  { sym: 'Ag', name: 'Agents',               row: 3, group: 'G1' as Group, num: 9,  slug: 'agent' },
  { sym: 'Ft', name: 'Fine-tuning',          row: 3, group: 'G2' as Group, num: 10, slug: 'fine-tuning' },
  { sym: 'Fw', name: 'Frameworks',           row: 3, group: 'G3' as Group, num: 11, slug: 'langgraph' },
  { sym: 'Rt', name: 'Red Teaming',          row: 3, group: 'G4' as Group, num: 12, slug: 'red-teaming' },
  { sym: 'Sm', name: 'Small Models',         row: 3, group: 'G5' as Group, num: 13, slug: null },
  { sym: 'Ma', name: 'Multi-agent Systems',  row: 4, group: 'G1' as Group, num: 14, slug: 'multi-agent' },
  { sym: 'Sy', name: 'Synthetic Data',       row: 4, group: 'G2' as Group, num: 15, slug: null },
  { sym: 'In', name: 'Interpretability',     row: 4, group: 'G4' as Group, num: 16, slug: null },
  { sym: 'Th', name: 'Thinking Models',      row: 4, group: 'G5' as Group, num: 17, slug: 'chain-of-thought' },
];

const GAPS = [
  { row: 1, group: 'G3' as Group, reason: "Can\u2019t orchestrate one thing",     label: '\u2014' },
  { row: 1, group: 'G4' as Group, reason: 'Nothing composed to validate',        label: '\u2014' },
  { row: 4, group: 'G3' as Group, reason: 'Open question \u2014 no paradigm yet', label: '?' },
];

const GROUP_COLORS: Record<Group, { bg: string; text: string }> = {
  G1: { bg: '#FAECE7', text: '#712B13' },
  G2: { bg: '#E6F1FB', text: '#0C447C' },
  G3: { bg: '#EEEDFE', text: '#3C3489' },
  G4: { bg: '#FAEEDA', text: '#633806' },
  G5: { bg: '#E1F5EE', text: '#085041' },
};

const GROUP_LABELS: Record<Group, string> = {
  G1: 'Reactive',
  G2: 'Retrieval',
  G3: 'Orchestration',
  G4: 'Validation',
  G5: 'Models',
};

const ROW_LABELS: Record<number, string> = {
  1: 'Primitives',
  2: 'Compositions',
  3: 'Deployment',
  4: 'Emerging',
};

export default function PeriodicTablePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] transition-colors"
            style={{ color: 'var(--color-dim)' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-[800] tracking-tight sm:text-3xl" style={{ color: 'var(--color-text)' }}>
          Periodic Table of AI
        </h1>
        <p className="mt-2 text-[13px]" style={{ color: 'var(--color-muted)' }}>
          17 core concepts. 4 layers. Deliberate gaps.
        </p>
      </header>

      <PeriodicTableView
        elements={ELEMENTS}
        gaps={GAPS}
        groupColors={GROUP_COLORS}
        groupLabels={GROUP_LABELS}
        rowLabels={ROW_LABELS}
      />
    </div>
  );
}
