'use client';

import { useState } from 'react';

import { type Reaction, GROUP_COLORS_DARK } from '@/lib/reactions';

interface ReactionWalkthroughProps {
  reaction: Reaction;
  onDone: () => void;
}

export default function ReactionWalkthrough({ reaction, onDone }: ReactionWalkthroughProps) {
  const [activeStep, setActiveStep] = useState(0);
  const step = reaction.steps[activeStep];
  const total = reaction.steps.length;

  const pillElements = reaction.equation.filter(
    (p): p is { sym: string; group: 'G1' | 'G2' | 'G3' | 'G4' | 'G5' } => typeof p !== 'string'
  );
  const stepSymIndex = pillElements.findIndex(p => p.sym === step.sym);

  return (
    <div className="overflow-hidden">
      {/* Equation row */}
      <div
        className="flex flex-wrap items-center gap-2 px-5 py-4"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        {reaction.equation.map((part, i) => {
          if (typeof part === 'string') {
            return (
              <span key={i} className="text-[13px] font-medium" style={{ color: 'var(--color-dim)' }}>
                {part}
              </span>
            );
          }
          const colors = GROUP_COLORS_DARK[part.group];
          const pillIdx = pillElements.indexOf(part);
          const isActive = pillIdx === stepSymIndex;
          return (
            <button
              key={i}
              onClick={() => {
                const targetStep = reaction.steps.findIndex(s => s.sym === part.sym);
                if (targetStep !== -1) setActiveStep(targetStep);
              }}
              className="inline-flex items-center justify-center rounded-[4px] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[14px] font-bold transition-all duration-150"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                opacity: isActive ? 1 : 0.25,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                cursor: 'pointer',
              }}
            >
              {part.sym}
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <div className="px-5 py-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
          Step {activeStep + 1} of {total} &middot; {step.sym}
        </p>
        <h3 className="mb-3 font-[family-name:var(--font-display)] text-[20px] font-[700] leading-tight" style={{ color: 'var(--color-text)' }}>
          {step.title}
        </h3>
        <p className="mb-4 text-[13px] leading-[1.65]" style={{ color: 'var(--color-muted)' }}>
          {step.body}
        </p>

        {/* Real world box */}
        <div
          className="mb-5"
          style={{
            backgroundColor: 'var(--color-card)',
            borderLeft: '3px solid var(--color-accent)',
            borderRadius: '10px',
            padding: '12px 14px',
          }}
        >
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--color-accent-soft)' }}>
            Real world
          </p>
          <p className="text-[12px] leading-[1.6]" style={{ color: 'var(--color-muted)' }}>
            {step.realWorld}
          </p>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveStep(s => s - 1)}
            disabled={activeStep === 0}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: activeStep === 0 ? 'transparent' : 'var(--color-card)',
              color: activeStep === 0 ? 'var(--color-dim)' : 'var(--color-muted)',
              border: activeStep === 0 ? '0.5px solid transparent' : '0.5px solid var(--color-border)',
              cursor: activeStep === 0 ? 'default' : 'pointer',
            }}
          >
            &larr; Prev
          </button>

          <div className="flex items-center gap-1.5">
            {reaction.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className="h-1.5 rounded-full transition-all duration-150"
                style={{
                  width: i === activeStep ? '16px' : '6px',
                  backgroundColor: i === activeStep ? 'var(--color-accent)' : 'var(--color-border)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {activeStep < total - 1 ? (
            <button
              onClick={() => setActiveStep(s => s + 1)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Next &rarr;
            </button>
          ) : (
            <button
              onClick={onDone}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-green)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Done &#x2713;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
