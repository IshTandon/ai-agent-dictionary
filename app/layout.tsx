import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Agent Dictionary — 100 terms explained in plain English',
  description:
    'A gamified glossary of AI agent terminology. Plain English definitions, real-world scenarios, and quizzes for every term.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-geist-sans)]">
        <nav className="glass sticky top-0 z-50 border-b border-gray-200/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-200">
                <span className="text-sm font-bold text-white">Ai</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                Agent Dictionary
              </span>
            </Link>
            <div className="flex items-center gap-6 text-[13px] font-medium">
              <Link
                href="/"
                className="text-gray-500 transition-colors hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-500 transition-colors hover:text-gray-900"
              >
                About
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200/60 bg-gray-50/50">
          <div className="mx-auto max-w-5xl px-6 py-10">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-900">
                  <span className="text-[10px] font-bold text-white">Ai</span>
                </div>
                <span className="text-sm font-medium text-gray-700">AI Agent Dictionary</span>
              </div>
              <p className="text-center text-xs text-gray-400">
                Term selection inspired by{' '}
                <a
                  href="https://hidekazu-konishi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-700"
                >
                  Hidekazu Konishi
                </a>
                . All definitions are original writing. &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
