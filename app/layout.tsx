import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Syne } from 'next/font/google';
import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import SearchBar from '@/components/SearchBar';
import XPBar from '@/components/XPBar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgentDict — The AI agent dictionary, updated daily',
  description:
    'The AI agent dictionary — every term explained in plain English with scenarios, quizzes, and real-world examples. Updated daily.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allTerms = getAllTerms();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} h-full antialiased`}
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <body className="flex min-h-full flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <nav
          className="sticky top-0 z-50"
          style={{ backgroundColor: 'var(--color-surface)', borderBottom: '0.5px solid var(--color-border)' }}
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="flex h-7 w-7 items-center justify-center font-[family-name:var(--font-mono)] text-[11px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #7C6FFF 0%, #A78BFA 100%)',
                  borderRadius: '7px',
                }}
              >
                Ai
              </div>
              <span className="font-[family-name:var(--font-display)] text-sm font-[800] tracking-tight" style={{ color: 'var(--color-text)' }}>
                agentdict
              </span>
            </Link>

            <XPBar />

            <div className="ml-auto hidden sm:block">
              <SearchBar terms={allTerms} variant="nav" />
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer style={{ borderTop: '1px solid var(--color-border)', padding: '24px' }}>
          <p className="text-center text-[11px]" style={{ color: 'var(--color-dim)' }}>
            Term selection inspired by{' '}
            <a
              href="https://hidekazu-konishi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: 'var(--color-muted)' }}
            >
              Hidekazu Konishi
            </a>
            . All definitions original. &copy; {new Date().getFullYear()} AgentDict
          </p>
        </footer>
      </body>
    </html>
  );
}
