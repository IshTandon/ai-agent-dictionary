import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | AgentDict',
  description: 'About AgentDict — an AI agent dictionary updated daily with plain-English definitions, scenarios, and quizzes.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-10">
        <h1 className="gradient-text font-[family-name:var(--font-display)] text-2xl font-[800]">
          About
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          A free, open reference for anyone working with AI agent technology.
        </p>
      </header>

      <div className="flex flex-col gap-2.5">
        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm font-[700]" style={{ color: 'var(--color-text)' }}>
            What is this?
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Every term is explained in plain English with real-world scenarios, quizzes, and links
            to source material. Whether you&apos;re an engineer building with agents, a PM scoping an
            agent feature, or someone who just wants to keep up — this is your reference.
          </p>
        </section>

        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-[700]" style={{ color: 'var(--color-text)' }}>
            Content tiers
          </h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Deep dive', desc: 'Definition, scenario, quiz, and real-world company example', color: '#F5A623' },
              { label: 'Detailed', desc: 'Definition, scenario, and quiz', color: '#A78BFA' },
              { label: 'Core', desc: 'Definition and related terms', color: '#4A5580' },
            ].map(t => (
              <div
                key={t.label}
                className="flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                <div>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{t.label}</span>
                  <span className="ml-1.5 text-[13px]" style={{ color: 'var(--color-dim)' }}>— {t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm font-[700]" style={{ color: 'var(--color-text)' }}>
            Attribution
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            Term selection inspired by{' '}
            <a
              href="https://hidekazu-konishi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors"
              style={{ color: 'var(--color-accent-soft)' }}
            >
              Hidekazu Konishi&apos;s AI Agent Engineering Glossary
            </a>
            . All definitions are original writing. Each term links to its primary source for
            further reading.
          </p>
        </section>

        <div className="pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '0.5px solid var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to dictionary
          </Link>
        </div>
      </div>
    </div>
  );
}
