import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Syne } from 'next/font/google';
import Link from 'next/link';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { getAllTerms } from '@/lib/terms';
import { ProgressProvider } from '@/lib/progress-context';
import SearchBar from '@/components/SearchBar';
import XPBar from '@/components/XPBar';
import KeyboardShortcut from '@/components/KeyboardShortcut';
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
        <ProgressProvider>
        <KeyboardShortcut />
        <nav
          className="sticky top-0 z-50"
          style={{ backgroundColor: 'var(--color-surface)', borderBottom: '0.5px solid var(--color-border)' }}
        >
          <div className="mx-auto flex max-w-5xl flex-nowrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div
                className="flex h-7 w-7 items-center justify-center font-[family-name:var(--font-mono)] text-[11px] font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-soft) 100%)',
                  borderRadius: '7px',
                }}
              >
                Ad
              </div>
              <span className="hidden font-[family-name:var(--font-display)] text-sm font-[700] tracking-tight sm:inline" style={{ color: 'var(--color-text)' }}>
                agentdict
              </span>
            </Link>

            <XPBar />

            <div className="ml-auto flex items-center gap-1">
              <Link
                href="/whats-new"
                className="nav-link relative hidden rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors md:inline-flex"
                style={{ color: 'var(--color-muted)' }}
              >
                What&apos;s New
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-green)' }} />
              </Link>
              <Link
                href="/table"
                className="nav-link hidden rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors md:inline-flex"
                style={{ color: 'var(--color-muted)' }}
              >
                Periodic Table
              </Link>
              <Link
                href="/about"
                className="nav-link hidden rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors md:inline-flex"
                style={{ color: 'var(--color-muted)' }}
              >
                About
              </Link>
              <div className="ml-1 hidden md:block">
                <SearchBar terms={allTerms} variant="nav" />
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-6 w-6 items-center justify-center font-[family-name:var(--font-mono)] text-[9px] font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-soft) 100%)',
                    borderRadius: '6px',
                  }}
                >
                  Ad
                </div>
                <span className="text-[12px] font-medium" style={{ color: 'var(--color-dim)' }}>
                  AgentDict &mdash; Updated daily
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/whats-new" className="text-[11px] transition-colors" style={{ color: 'var(--color-dim)' }}>
                  What&apos;s New
                </Link>
                <Link href="/table" className="text-[11px] transition-colors" style={{ color: 'var(--color-dim)' }}>
                  Periodic Table
                </Link>
                <Link href="/about" className="text-[11px] transition-colors" style={{ color: 'var(--color-dim)' }}>
                  About
                </Link>
              </div>
            </div>

            <div className="mt-5 text-center sm:text-left" style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '16px' }}>
              <p className="text-[11px]" style={{ color: 'var(--color-dim)' }}>
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
                . All definitions original. Press{' '}
                <kbd className="rounded px-1 py-0.5 font-[family-name:var(--font-mono)] text-[10px]" style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}>
                  Ctrl+K
                </kbd>{' '}
                to search. &copy; {new Date().getFullYear()} AgentDict
              </p>
            </div>
          </div>
        </footer>
        </ProgressProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
