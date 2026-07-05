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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About</h1>
        <p className="mt-3 text-base leading-relaxed text-gray-500">
          The AI Agent Dictionary is a free, open reference for anyone working with AI agent technology.
        </p>
      </header>

      <div className="space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">What is this?</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Every term is explained in plain English with real-world scenarios, quizzes, and links
            to source material. Whether you&apos;re an engineer building with agents, a PM scoping an
            agent feature, or someone who just wants to keep up — this is your reference.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Content tiers</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-amber-50/50 p-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
              <div>
                <span className="text-sm font-medium text-gray-900">Deep dive</span>
                <span className="ml-1 text-sm text-gray-500">— Definition, scenario, quiz, and real-world company example</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-blue-50/50 p-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
              <div>
                <span className="text-sm font-medium text-gray-900">Detailed</span>
                <span className="ml-1 text-sm text-gray-500">— Definition, scenario, and quiz</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-gray-50/50 p-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-900">Core</span>
                <span className="ml-1 text-sm text-gray-500">— Definition and related terms</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Attribution</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Term selection inspired by{' '}
            <a
              href="https://hidekazu-konishi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-800 hover:decoration-indigo-400"
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
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow"
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
