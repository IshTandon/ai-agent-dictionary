'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { REACTIONS, GROUP_COLORS_DARK, type Reaction } from '@/lib/reactions';

const ELEMENT_SLUGS: Record<string, string> = {
  'Pr': 'prompting',
  'Em': 'embedding',
  'Lg': 'large-language-model',
  'Fc': 'tool-use',
  'Vx': 'vector-store',
  'Rg': 'rag',
  'Gr': 'guardrail',
  'Mm': 'multimodal-models',
  'Ag': 'agent',
  'Ft': 'fine-tuning',
  'Fw': 'ai-frameworks',
  'Rt': 'red-teaming',
  'Sm': 'small-models',
  'Ma': 'multi-agent',
  'Sy': 'synthetic-data',
  'In': 'interpretability',
  'Th': 'thinking-models',
};
import ReactionWalkthrough from './ReactionWalkthrough';

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

interface PeriodicTableViewProps {
  elements: Element[];
  gaps: Gap[];
  groupColors: Record<Group, { bg: string; text: string }>;
  groupLabels: Record<Group, string>;
  rowLabels: Record<number, string>;
}

const GROUP_TOOLTIPS: Record<Group, string> = {
  G1: 'Reactive \u2014 gets more autonomous going down: Prompt \u2192 Function Call \u2192 Agent \u2192 Multi-agent',
  G2: 'Retrieval \u2014 three forms of memory: numbers (Em), stored (Vx), baked in (Ft)',
  G3: 'Orchestration \u2014 can\u2019t exist in Row 1. You can\u2019t coordinate a single thing.',
  G4: 'Validation \u2014 checks only matter once you have something composed to check',
  G5: 'Models \u2014 the noble gases. Stable. Everything else reacts around them.',
};

const ALL_GROUPS: Group[] = ['G1', 'G2', 'G3', 'G4', 'G5'];
const ROWS = [1, 2, 3, 4];

export default function PeriodicTableView({
  elements,
  gaps,
  groupColors,
  groupLabels,
  rowLabels,
}: PeriodicTableViewProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePopover, setActivePopover] = useState<Group | null>(null);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const elementMap = new Map<string, Element>();
  for (const el of elements) {
    elementMap.set(`${el.row}-${el.group}`, el);
  }
  const gapMap = new Map<string, Gap>();
  for (const g of gaps) {
    gapMap.set(`${g.row}-${g.group}`, g);
  }

  useEffect(() => {
    function onFSChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      try { await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('landscape'); } catch {}
    } catch {}
  }, []);

  const exitFullscreen = useCallback(async () => {
    try { await document.exitFullscreen(); } catch {}
  }, []);

  function togglePopover(g: Group) {
    setActivePopover(prev => (prev === g ? null : g));
  }

  function toggleReaction(id: string) {
    setActiveReaction(prev => (prev === id ? null : id));
  }

  const selectedReaction = REACTIONS.find(r => r.id === activeReaction) ?? null;

  return (
    <div>
      {/* Two-axis explainer */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '18px 20px',
          }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--color-dim)' }}>
            Horizontal &mdash; Groups
          </p>
          <h3 className="mb-2 font-[family-name:var(--font-display)] text-[15px] font-[700]" style={{ color: 'var(--color-accent-soft)' }}>
            What kind of work
          </h3>
          <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-muted)' }}>
            G1 acts. G2 remembers. G3 coordinates. G4 checks.
            G5 is the engine everything else runs on &mdash; the noble gases
            of the table: stable, foundational.
          </p>
        </div>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '18px 20px',
          }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--color-dim)' }}>
            Vertical &mdash; Rows
          </p>
          <h3 className="mb-2 font-[family-name:var(--font-display)] text-[15px] font-[700]" style={{ color: 'var(--color-accent-soft)' }}>
            How composed it is
          </h3>
          <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-muted)' }}>
            Row 1 are atoms &mdash; nothing can break them down further.
            Row 2 combines atoms. Row 3 ships compositions to production.
            Row 4 is happening right now.
          </p>
        </div>
      </div>

      {/* Fullscreen button */}
      <div className="mb-4 flex justify-end">
        {isFullscreen ? (
          <button
            onClick={exitFullscreen}
            className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer' }}
          >
            Exit fullscreen
          </button>
        ) : (
          <button
            onClick={enterFullscreen}
            className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer' }}
          >
            Fullscreen
          </button>
        )}
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto pb-4">
        <div
          className="periodic-table-grid grid gap-2"
          style={{
            gridTemplateColumns: '64px repeat(5, 72px)',
            gridTemplateRows: 'auto repeat(4, 80px)',
            width: 'max-content',
          }}
        >
          {/* Header row */}
          <div />
          {ALL_GROUPS.map(g => (
            <div key={g} className="relative">
              <button
                onClick={() => togglePopover(g)}
                className="flex w-full items-center justify-center rounded-[6px] px-1 py-1.5 text-center transition-colors"
                style={{
                  backgroundColor: groupColors[g].bg,
                  color: groupColors[g].text,
                  cursor: 'pointer',
                  border: activePopover === g ? `1px solid ${groupColors[g].text}` : '1px solid transparent',
                }}
              >
                <span className="text-[9px] font-semibold uppercase tracking-wide">
                  {groupLabels[g]}
                </span>
              </button>
              {activePopover === g && (
                <div
                  className="absolute left-1/2 z-30 mt-1 w-52 -translate-x-1/2 rounded-lg p-3 shadow-xl shadow-black/40"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    border: '0.5px solid var(--color-border)',
                  }}
                >
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {GROUP_TOOLTIPS[g]}
                  </p>
                  <div
                    className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
                    style={{ backgroundColor: 'var(--color-card)', borderTop: '0.5px solid var(--color-border)', borderLeft: '0.5px solid var(--color-border)' }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Data rows */}
          {ROWS.map(r => (
            <>
              <div key={`label-${r}`} className="flex items-center justify-center">
                <span className="text-center text-[9px] font-semibold uppercase leading-tight tracking-wider" style={{ color: 'var(--color-dim)' }}>
                  {rowLabels[r]}
                </span>
              </div>
              {ALL_GROUPS.map(g => {
                const key = `${r}-${g}`;
                const el = elementMap.get(key);
                const gap = gapMap.get(key);

                if (el) {
                  const colors = groupColors[el.group];
                  const slug = ELEMENT_SLUGS[el.sym];
                  return (
                    <div
                      key={key}
                      className="cell relative flex h-[80px] w-full flex-col items-center justify-center rounded-[6px] transition-transform duration-150 hover:scale-[1.04]"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        minWidth: '72px',
                        cursor: slug ? 'pointer' : 'default',
                      }}
                      onClick={slug ? () => router.push(`/terms/${slug}`) : undefined}
                    >
                      <span className="absolute right-1 top-1 font-[family-name:var(--font-mono)] text-[9px] tabular-nums" style={{ opacity: 0.6 }}>
                        {el.num}
                      </span>
                      <span className="cell-sym font-[family-name:var(--font-mono)] text-[22px] font-bold leading-none">
                        {el.sym}
                      </span>
                      <span className="mt-1 line-clamp-2 w-full px-0.5 text-center text-[8px] leading-tight">
                        {el.name}
                      </span>
                    </div>
                  );
                }

                if (gap) {
                  return (
                    <div key={key} className="cell flex h-[80px] w-full flex-col items-center justify-center rounded-[6px] border-[1.5px] border-dashed" style={{ borderColor: 'var(--color-border)', minWidth: '72px' }}>
                      <span className="font-[family-name:var(--font-mono)] text-[22px] font-bold leading-none" style={{ color: 'var(--color-dim)' }}>
                        {gap.label}
                      </span>
                      <span className="mt-1 line-clamp-2 w-full px-0.5 text-center text-[8px] leading-tight" style={{ color: 'var(--color-dim)' }}>
                        {gap.reason}
                      </span>
                    </div>
                  );
                }

                return <div key={key} />;
              })}
            </>
          ))}
        </div>
      </div>

      {/* Mobile rotate hint */}
      <p className="mobile-rotate-hint mt-3 text-center text-[11px]" style={{ color: 'var(--color-dim)' }}>
        Rotate your device for a better view
      </p>

      {/* Reactions — hidden in fullscreen */}
      {!isFullscreen && (
        <>
          <div className="my-12" style={{ borderTop: '0.5px solid var(--color-border)' }} />

          <section>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              Reactions
            </h2>
            <p className="mb-8 text-[13px]" style={{ color: 'var(--color-muted)' }}>
              How real AI systems are built &mdash; click to walk through step by step
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {REACTIONS.map(rx => {
                const isActive = activeReaction === rx.id;
                return (
                  <button
                    key={rx.id}
                    onClick={() => toggleReaction(rx.id)}
                    className="w-full text-left transition-colors"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '14px',
                      border: isActive ? '1px solid var(--color-accent)' : '0.5px solid var(--color-border)',
                      padding: '16px 18px',
                      cursor: 'pointer',
                    }}
                  >
                    <h3 className="mb-3 font-[family-name:var(--font-display)] text-[14px] font-[700]" style={{ color: 'var(--color-text)' }}>
                      {rx.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {rx.equation.map((part, j) => {
                        if (typeof part === 'string') {
                          return (
                            <span key={j} className="text-[12px] font-medium" style={{ color: 'var(--color-dim)' }}>
                              {part}
                            </span>
                          );
                        }
                        const colors = GROUP_COLORS_DARK[part.group];
                        return (
                          <span
                            key={j}
                            className="inline-flex items-center justify-center rounded-[4px] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] font-bold"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {part.sym}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedReaction && (
              <ReactionWalkthrough
                key={selectedReaction.id}
                reaction={selectedReaction}
                onDone={() => setActiveReaction(null)}
              />
            )}
          </section>

          {/* Gap explanation */}
          <div
            className="mt-12 px-5 py-4"
            style={{
              borderRadius: '10px',
              border: '1px dashed var(--color-border)',
              backgroundColor: 'rgba(20,25,41,0.5)',
            }}
          >
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-text)' }}>Why the gaps?</span>{' '}
              In chemistry, gaps in the periodic table predicted undiscovered elements.
              The Row 4 G3 gap points to an orchestration paradigm that doesn&apos;t exist yet.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
