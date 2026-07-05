import Anthropic from '@anthropic-ai/sdk';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const TERMS_DIR = join(process.cwd(), 'content', 'terms');
const QUEUE_PATH = join(process.cwd(), 'content', 'upgrade-queue.json');
const BATCH_SIZE = 5;
const DELAY_MS = 2000;

async function loadQueue() {
  try {
    const raw = await readFile(QUEUE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { processed: [], last_run: null };
  }
}

async function saveQueue(queue) {
  queue.last_run = new Date().toISOString();
  await writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');
}

function buildPrompt(currentTerm) {
  return `Upgrade the following AI term JSON from Tier 3 to Tier 2.

Current JSON:
${JSON.stringify(currentTerm, null, 2)}

Writing rules:
- definition_plain: 2–3 sentences. Sentence 1: what is it. Sentence 3: why it matters. One analogy max. No stacked metaphors.
- scenario.meeting_line: something a real person would actually say in a standup or Slack thread
- scenario.smart_followup: a follow-up question that shows deeper knowledge
- quiz_question: scenario-based, never trivia, always 4 options (prefixed A) B) C) D)) with a one-line explanation
- quiz_question.answer must be one of "A", "B", "C", "D"

Reference voice: conversational, confident, no jargon-for-jargon's-sake. Like explaining to a smart colleague who's new to AI agents.

Return ONLY valid JSON. No markdown, no explanation, no code fences.`;
}

function validateUpgrade(data) {
  if (!data.scenario?.meeting_line || !data.scenario?.smart_followup) return false;
  if (!data.quiz_question?.question || !data.quiz_question?.options) return false;
  if (!['A', 'B', 'C', 'D'].includes(data.quiz_question.answer)) return false;
  if (!data.quiz_question.explanation) return false;
  if (!Array.isArray(data.quiz_question.options) || data.quiz_question.options.length !== 4) return false;
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const client = new Anthropic();

  const files = await readdir(TERMS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));

  const terms = [];
  for (const file of jsonFiles) {
    const raw = await readFile(join(TERMS_DIR, file), 'utf-8');
    const term = JSON.parse(raw);
    terms.push({ file, ...term });
  }

  const tier3NoScenario = terms.filter((t) => t.tier === 3 && !t.scenario);
  console.log(`Found ${tier3NoScenario.length} tier-3 terms without scenario field`);

  const queue = await loadQueue();
  const processedSet = new Set(queue.processed);

  const candidates = tier3NoScenario
    .filter((t) => !processedSet.has(t.slug))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const batch = candidates.slice(0, BATCH_SIZE);
  console.log(`Processing batch of ${batch.length} terms: ${batch.map((t) => t.slug).join(', ')}`);

  if (batch.length === 0) {
    console.log('No terms to process. All tier-3 terms have been upgraded or queued.');
    return;
  }

  let successCount = 0;

  for (const term of batch) {
    const { file, ...termData } = term;
    console.log(`\nUpgrading: ${term.slug}...`);

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: buildPrompt(termData) }],
      });

      const responseText = message.content[0].text;
      const upgraded = JSON.parse(responseText);

      if (!validateUpgrade(upgraded)) {
        console.error(`  SKIP: validation failed for ${term.slug}`);
        continue;
      }

      upgraded.tier = 2;

      await writeFile(join(TERMS_DIR, file), JSON.stringify(upgraded, null, 2) + '\n');
      queue.processed.push(term.slug);
      successCount++;
      console.log(`  OK: ${term.slug} upgraded to tier 2`);
    } catch (err) {
      console.error(`  ERROR: failed to upgrade ${term.slug}: ${err.message}`);
    }

    if (batch.indexOf(term) < batch.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  await saveQueue(queue);
  console.log(`\nDone. Upgraded ${successCount}/${batch.length} terms.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
