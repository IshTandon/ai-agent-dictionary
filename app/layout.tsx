import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import SearchBar from '@/components/SearchBar';
import XPBar from '@/components/XPBar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <nav className="glass-panel sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-indigo font-[family-name:var(--font-display)] text-xs font-bold text-white">
                Ad
              </div>
              <span className="font-[family-name:var(--font-display)] text-sm font-medium tracking-tight text-text-primary">
                Agent<span className="text-text-muted">Dict</span>
              </span>
            </Link>
            <XPBar />
            <div className="hidden sm:block">
              <SearchBar terms={allTerms} variant="nav" />
            </div>
            <div className="flex items-center gap-5 text-[13px]">
              <Link
                href="/about"
                className="font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                About
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-surface-elevated font-[family-name:var(--font-display)] text-[9px] font-bold text-text-muted">
                  Ad
                </div>
                <span className="text-xs text-text-muted">AgentDict</span>
              </div>
              <p className="text-center text-[11px] text-text-muted">
                Term selection inspired by{' '}
                <a
                  href="https://hidekazu-konishi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary underline decoration-border underline-offset-2 hover:text-text-primary"
                >
                  Hidekazu Konishi
                </a>
                . All definitions original. &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
