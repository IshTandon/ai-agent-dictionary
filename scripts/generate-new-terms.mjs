import Anthropic from '@anthropic-ai/sdk';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const TERMS_DIR = join(process.cwd(), 'content', 'terms');
const BATCH_SIZE = 3;

const CATEGORIES = [
  'Foundation',
  'Memory',
  'Tools',
  'Protocols',
  'Retrieval',
  'Orchestration',
  'Evaluation',
  'Security',
  'Observability',
];

async function getExistingTerms() {
  const files = await readdir(TERMS_DIR);
  const slugs = new Set();
  const termNames = new Set();

  for (const file of files.filter(f => f.endsWith('.json'))) {
    const raw = await readFile(join(TERMS_DIR, file), 'utf-8');
    const term = JSON.parse(raw);
    slugs.add(term.slug);
    termNames.add(term.term.toLowerCase());
  }

  return { slugs, termNames };
}

function buildDiscoveryPrompt(existingTermNames) {
  const existing = [...existingTermNames].sort().join(', ');

  return `You are an expert on AI agents, LLMs, and the broader AI engineering ecosystem.

We maintain an AI Agent Dictionary. Here are ALL terms we already cover:
${existing}

Suggest ${BATCH_SIZE} NEW terms that are important in the AI agent space but MISSING from our dictionary. Focus on terms that:
- Are commonly used in industry discussions, papers, or product docs in 2025-2026
- Relate to AI agents, LLMs, or the tooling/infrastructure around them
- Are distinct concepts (not synonyms of existing terms)

For each term, provide:
1. term: The canonical name (title case)
2. slug: URL-friendly version (lowercase, hyphens)
3. category: One of: ${CATEGORIES.join(', ')}
4. definition_plain: 2-3 sentences. Sentence 1: what is it. Last sentence: why it matters. One analogy max.
5. related_terms: Array of 2-4 slugs from the existing dictionary that relate to this term
6. source_url: A real, authoritative URL where someone can learn more
7. source_label: Short label for the source link

Return a JSON array of objects. Return ONLY valid JSON, no markdown, no code fences, no explanation.`;
}

function validateTerm(data, existingSlugs) {
  if (!data.term || !data.slug || !data.category || !data.definition_plain) return false;
  if (!CATEGORIES.includes(data.category)) return false;
  if (!Array.isArray(data.related_terms)) return false;
  if (!data.source_url || !data.source_label) return false;
  if (existingSlugs.has(data.slug)) return false;
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const client = new Anthropic();
  const { slugs: existingSlugs, termNames: existingTermNames } = await getExistingTerms();

  console.log(`Dictionary currently has ${existingSlugs.size} terms`);
  console.log(`Discovering ${BATCH_SIZE} new terms...`);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildDiscoveryPrompt(existingTermNames) }],
  });

  const responseText = message.content[0].text;
  let newTerms;

  try {
    newTerms = JSON.parse(responseText);
  } catch (err) {
    console.error('Failed to parse response as JSON:', err.message);
    console.error('Response:', responseText.slice(0, 500));
    process.exit(1);
  }

  if (!Array.isArray(newTerms)) {
    console.error('Response is not an array');
    process.exit(1);
  }

  let addedCount = 0;

  for (const term of newTerms) {
    if (!validateTerm(term, existingSlugs)) {
      console.log(`  SKIP: validation failed for ${term.slug || 'unknown'}`);
      continue;
    }

    const termData = {
      term: term.term,
      slug: term.slug,
      category: term.category,
      tier: 3,
      definition_plain: term.definition_plain,
      related_terms: term.related_terms.filter(rt => existingSlugs.has(rt)),
      source_url: term.source_url,
      source_label: term.source_label,
    };

    const filePath = join(TERMS_DIR, `${term.slug}.json`);
    await writeFile(filePath, JSON.stringify(termData, null, 2) + '\n');
    existingSlugs.add(term.slug);
    addedCount++;
    console.log(`  ADDED: ${term.term} (${term.category})`);
  }

  console.log(`\nDone. Added ${addedCount} new terms.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
