import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | AI Agent Dictionary',
  description: 'About the AI Agent Dictionary project — sources, attribution, and how to contribute.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          About
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          A free, open reference for anyone working with AI agent technology.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary">
            What is this?
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Every term is explained in plain English with real-world scenarios, quizzes, and links
            to source material. Whether you&apos;re an engineer building with agents, a PM scoping an
            agent feature, or someone who just wants to keep up — this is your reference.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary">
            Content tiers
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-void-lighter p-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent-amber" />
              <div>
                <span className="text-sm font-medium text-text-primary">Deep dive</span>
                <span className="ml-1 text-sm text-text-muted">— Definition, scenario, quiz, and real-world company example</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-void-lighter p-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent-indigo" />
              <div>
                <span className="text-sm font-medium text-text-primary">Detailed</span>
                <span className="ml-1 text-sm text-text-muted">— Definition, scenario, and quiz</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-void-lighter p-3">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-text-muted" />
              <div>
                <span className="text-sm font-medium text-text-primary">Core</span>
                <span className="ml-1 text-sm text-text-muted">— Definition and related terms</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary">
            Attribution
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Term selection inspired by{' '}
            <a
              href="https://hidekazu-konishi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-indigo-light underline decoration-accent-indigo/30 underline-offset-2 hover:text-accent-indigo hover:decoration-accent-indigo"
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
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-accent-indigo/40 hover:text-accent-indigo-light"
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
