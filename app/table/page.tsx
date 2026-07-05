import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Periodic Table of AI | AgentDict',
  description: 'The 17 core AI concepts arranged as a periodic table — primitives, compositions, deployment, and emerging paradigms.',
};

type Group = 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

interface Element {
  sym: string;
  name: string;
  row: number;
  group: Group;
  num: number;
  slug: string | null;
}

interface Gap {
  row: number;
  group: Group;
  reason: string;
  label: string;
}

const ELEMENTS: Element[] = [
  { sym: 'Pr', name: 'Prompting',            row: 1, group: 'G1', num: 1,  slug: 'prompt-injection' },
  { sym: 'Em', name: 'Embeddings',           row: 1, group: 'G2', num: 2,  slug: 'embedding' },
  { sym: 'Lg', name: 'Large Language Model', row: 1, group: 'G5', num: 3,  slug: 'context-window' },
  { sym: 'Fc', name: 'Function Calling',     row: 2, group: 'G1', num: 4,  slug: 'tool-use' },
  { sym: 'Vx', name: 'Vector Databases',     row: 2, group: 'G2', num: 5,  slug: 'vector-store' },
  { sym: 'Rg', name: 'RAG',                  row: 2, group: 'G3', num: 6,  slug: 'rag' },
  { sym: 'Gr', name: 'Guardrails',           row: 2, group: 'G4', num: 7,  slug: 'guardrail' },
  { sym: 'Mm', name: 'Multi-modal Models',   row: 2, group: 'G5', num: 8,  slug: null },
  { sym: 'Ag', name: 'Agents',               row: 3, group: 'G1', num: 9,  slug: 'agent' },
  { sym: 'Ft', name: 'Fine-tuning',          row: 3, group: 'G2', num: 10, slug: 'fine-tuning' },
  { sym: 'Fw', name: 'Frameworks',           row: 3, group: 'G3', num: 11, slug: 'langgraph' },
  { sym: 'Rt', name: 'Red Teaming',          row: 3, group: 'G4', num: 12, slug: 'red-teaming' },
  { sym: 'Sm', name: 'Small Models',         row: 3, group: 'G5', num: 13, slug: null },
  { sym: 'Ma', name: 'Multi-agent Systems',  row: 4, group: 'G1', num: 14, slug: 'multi-agent' },
  { sym: 'Sy', name: 'Synthetic Data',       row: 4, group: 'G2', num: 15, slug: null },
  { sym: 'In', name: 'Interpretability',     row: 4, group: 'G4', num: 16, slug: null },
  { sym: 'Th', name: 'Thinking Models',      row: 4, group: 'G5', num: 17, slug: 'chain-of-thought' },
];

const GAPS: Gap[] = [
  { row: 1, group: 'G3', reason: "Can\u2019t orchestrate one thing",     label: '\u2014' },
  { row: 1, group: 'G4', reason: 'Nothing composed to validate',        label: '\u2014' },
  { row: 4, group: 'G3', reason: 'Open question \u2014 no paradigm yet', label: '?' },
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

interface ReactionPill {
  sym: string;
  group: Group;
}

interface Reaction {
  name: string;
  equation: (ReactionPill | string)[];
  description: string;
}

const REACTIONS: Reaction[] = [
  {
    name: '\u2460 Production RAG chatbot',
    equation: [
      { sym: 'Em', group: 'G2' }, '\u2192',
      { sym: 'Vx', group: 'G2' }, '\u2192',
      { sym: 'Rg', group: 'G3' }, '\u2192',
      { sym: 'Pr', group: 'G1' }, '\u2192',
      { sym: 'Lg', group: 'G5' }, '+',
      { sym: 'Gr', group: 'G4' },
    ],
    description: 'Turn documents into vectors, retrieve relevant chunks, augment the prompt, generate a grounded answer \u2014 wrap in guardrails.',
  },
  {
    name: '\u2461 Agentic loop',
    equation: [
      { sym: 'Ag', group: 'G1' }, '\u21BB',
      { sym: 'Fc', group: 'G1' }, 'via',
      { sym: 'Fw', group: 'G3' },
    ],
    description: 'The agent plans, calls a tool, observes the result, then loops \u2014 the framework provides the plumbing for the think-act-observe cycle.',
  },
  {
    name: '\u2462 Multi-agent research system',
    equation: [
      { sym: 'Ma', group: 'G1' }, '\u2192',
      { sym: 'Rg', group: 'G3' }, '+',
      { sym: 'Fc', group: 'G1' }, '+',
      { sym: 'Rt', group: 'G4' },
    ],
    description: 'Researcher retrieves, writer drafts, critic challenges \u2014 red teaming built in before output reaches a human.',
  },
  {
    name: '\u2463 Domain-specific code assistant',
    equation: [
      { sym: 'Ft', group: 'G2' }, '+',
      { sym: 'Pr', group: 'G1' }, '\u2192',
      { sym: 'Sm', group: 'G5' }, '+',
      { sym: 'Gr', group: 'G4' },
    ],
    description: 'Fine-tune a small model on your codebase, keep prompts contextual, run guardrails to block secret leakage.',
  },
];

function ElementCell({ el }: { el: Element }) {
  const colors = GROUP_COLORS[el.group];
  const inner = (
    <div
      className="relative flex h-[80px] w-[72px] cursor-pointer flex-col items-center justify-center rounded-[6px] transition-transform duration-150 hover:scale-[1.04]"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <span
        className="absolute right-1 top-1 font-[family-name:var(--font-display)] text-[9px] tabular-nums"
        style={{ opacity: 0.6 }}
      >
        {el.num}
      </span>
      <span className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-none">
        {el.sym}
      </span>
      <span className="mt-1 line-clamp-2 w-full px-0.5 text-center text-[8px] leading-tight">
        {el.name}
      </span>
    </div>
  );

  if (el.slug) {
    return <Link href={`/terms/${el.slug}`}>{inner}</Link>;
  }
  return inner;
}

function GapCell({ gap }: { gap: Gap }) {
  return (
    <div className="flex h-[80px] w-[72px] flex-col items-center justify-center rounded-[6px] border-[1.5px] border-dashed border-border">
      <span className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-none text-text-muted">
        {gap.label}
      </span>
      <span className="mt-1 line-clamp-2 w-full px-0.5 text-center text-[8px] leading-tight text-text-muted">
        {gap.reason}
      </span>
    </div>
  );
}

export default function PeriodicTablePage() {
  const allGroups: Group[] = ['G1', 'G2', 'G3', 'G4', 'G5'];
  const rows = [1, 2, 3, 4];

  const elementMap = new Map<string, Element>();
  for (const el of ELEMENTS) {
    elementMap.set(`${el.row}-${el.group}`, el);
  }
  const gapMap = new Map<string, Gap>();
  for (const g of GAPS) {
    gapMap.set(`${g.row}-${g.group}`, g);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Periodic Table of AI
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          17 core concepts. 4 layers. Deliberate gaps.
        </p>
      </header>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        {allGroups.map(g => (
          <div key={g} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: GROUP_COLORS[g].text }}
            />
            <span className="text-[11px] text-text-secondary">
              {GROUP_LABELS[g]}
            </span>
          </div>
        ))}
      </div>

      {/* Table grid — horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: '64px repeat(5, 72px)',
            gridTemplateRows: 'auto repeat(4, 80px)',
            width: 'max-content',
          }}
        >
          {/* Header row: empty corner + group headers */}
          <div />
          {allGroups.map(g => (
            <div
              key={g}
              className="flex items-center justify-center rounded-[6px] px-1 py-1.5 text-center"
              style={{ backgroundColor: GROUP_COLORS[g].bg, color: GROUP_COLORS[g].text }}
            >
              <span className="text-[9px] font-semibold uppercase tracking-wide">
                {GROUP_LABELS[g]}
              </span>
            </div>
          ))}

          {/* Data rows */}
          {rows.map(r => (
            <>
              {/* Row label */}
              <div
                key={`label-${r}`}
                className="flex items-center justify-center"
              >
                <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wider text-text-muted">
                  {ROW_LABELS[r]}
                </span>
              </div>

              {/* Cells: element or gap or empty */}
              {allGroups.map(g => {
                const key = `${r}-${g}`;
                const el = elementMap.get(key);
                const gap = gapMap.get(key);

                if (el) return <ElementCell key={key} el={el} />;
                if (gap) return <GapCell key={key} gap={gap} />;
                return <div key={key} />;
              })}
            </>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-12 border-t border-border" />

      {/* Reactions */}
      <section>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
          Reactions
        </h2>
        <p className="mb-8 text-sm text-text-muted">
          How real AI systems are built
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {REACTIONS.map((rx, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <h3 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary">
                {rx.name}
              </h3>
              <div className="mb-4 flex flex-wrap items-center gap-1.5">
                {rx.equation.map((part, j) => {
                  if (typeof part === 'string') {
                    return (
                      <span
                        key={j}
                        className="text-[13px] font-medium text-text-muted"
                      >
                        {part}
                      </span>
                    );
                  }
                  const colors = GROUP_COLORS[part.group];
                  return (
                    <span
                      key={j}
                      className="inline-flex items-center justify-center rounded-[4px] px-2 py-0.5 font-[family-name:var(--font-display)] text-[13px] font-bold"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {part.sym}
                    </span>
                  );
                })}
              </div>
              <p className="text-[12px] leading-relaxed text-text-muted">
                {rx.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gap explanation */}
      <div className="mt-12 rounded-lg border border-dashed border-border bg-surface/50 px-5 py-4">
        <p className="text-[12px] leading-relaxed text-text-muted">
          <span className="font-semibold text-text-secondary">Why the gaps?</span>{' '}
          In chemistry, gaps in the periodic table predicted undiscovered elements.
          The Row 4 G3 gap points to an orchestration paradigm that doesn&apos;t exist yet.
        </p>
      </div>
    </div>
  );
}
