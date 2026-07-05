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
      <body className="flex min-h-full flex-col bg-white font-[family-name:var(--font-geist-sans)]">
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-gray-900">
              AI Agent Dictionary
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-8 text-center text-sm text-gray-500">
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
              . All definitions are original writing.
            </p>
            <p className="mt-2">AI Agent Dictionary &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
