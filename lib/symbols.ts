const SYMBOL_OVERRIDES: Record<string, string> = {
  'agent': 'AGT',
  'embedding': 'EMB',
  'context-window': 'CTX',
  'guardrail': 'GRL',
  'agentic-loop': 'ALP',
  'tool-use': 'TUL',
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export function getSymbol(name: string, slug?: string): string {
  if (slug && SYMBOL_OVERRIDES[slug]) {
    return SYMBOL_OVERRIDES[slug];
  }

  const trimmed = name.trim();
  if (trimmed.length <= 5 && trimmed === trimmed.toUpperCase() && /^[A-Z0-9]+$/.test(trimmed)) {
    return trimmed.slice(0, 3);
  }

  const consonants: string[] = [];
  for (const ch of trimmed) {
    const lower = ch.toLowerCase();
    if (lower >= 'a' && lower <= 'z' && !VOWELS.has(lower)) {
      consonants.push(ch.toUpperCase());
      if (consonants.length === 3) break;
    }
  }

  if (consonants.length < 3) {
    for (const ch of trimmed) {
      const upper = ch.toUpperCase();
      if (upper >= 'A' && upper <= 'Z' && consonants.length < 3) {
        consonants.push(upper);
      }
      if (consonants.length === 3) break;
    }
  }

  return consonants.join('').slice(0, 3);
}
