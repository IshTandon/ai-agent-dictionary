import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | AI Agent Dictionary',
  description: 'About the AI Agent Dictionary project — sources, attribution, and how to contribute.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">About</h1>

      <div className="prose prose-gray mt-6">
        <p>
          The AI Agent Dictionary is a free, open reference for anyone working with (or just trying
          to keep up with) AI agent technology. Every term is explained in plain English with
          real-world scenarios, quizzes, and links to source material.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">How it works</h2>
        <p>
          Each term has a tier reflecting its depth of coverage:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li><strong>Tier 1</strong> — Full card: definition, scenario, quiz, and real-world company example</li>
          <li><strong>Tier 2</strong> — Deep dive: definition, scenario, and quiz</li>
          <li><strong>Tier 3</strong> — Core: definition and related terms</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Attribution</h2>
        <p>
          Term selection inspired by{' '}
          <a
            href="https://hidekazu-konishi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Hidekazu Konishi&apos;s AI Agent Engineering Glossary
          </a>
          . All definitions are original writing. Each term links to its primary source for further
          reading.
        </p>
      </div>
    </div>
  );
}
