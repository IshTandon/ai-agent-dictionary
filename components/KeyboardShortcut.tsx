'use client';

import { useEffect } from 'react';

export default function KeyboardShortcut() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const heroInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        const navInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        const input = heroInput || navInput;
        if (input) {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
