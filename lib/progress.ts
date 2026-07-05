export interface UserProgress {
  xp: number;
  viewed_terms: string[];
  quiz_attempts: Record<string, { correct: boolean; attempted_at: string }>;
  streak: number;
  last_visit: string | null;
  daily_term_viewed: string | null;
}

const STORAGE_KEY = 'aad_progress';

function defaultProgress(): UserProgress {
  return {
    xp: 0,
    viewed_terms: [],
    quiz_attempts: {},
    streak: 0,
    last_visit: null,
    daily_term_viewed: null,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function updateStreak(): void {
  const p = getProgress();
  const today = todayISO();

  if (p.last_visit === today) {
    return;
  }

  if (p.last_visit) {
    const lastDate = new Date(p.last_visit);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
      p.streak += 1;
    } else {
      p.streak = 1;
    }
  } else {
    p.streak = 1;
  }

  p.last_visit = today;
  saveProgress(p);
}

export function trackTermView(slug: string): number {
  const p = getProgress();
  let gained = 0;

  if (!p.viewed_terms.includes(slug)) {
    p.viewed_terms.push(slug);
    p.xp += 5;
    gained = 5;
  }

  updateStreak();
  saveProgress(p);
  return gained;
}

export function trackQuizAttempt(slug: string, correct: boolean): number {
  const p = getProgress();
  const gained = correct ? 25 : 10;

  p.quiz_attempts[slug] = {
    correct,
    attempted_at: new Date().toISOString(),
  };
  p.xp += gained;

  saveProgress(p);
  return gained;
}

export function getDailyTerm(allSlugs: string[]): string {
  const dateStr = todayISO();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash += dateStr.charCodeAt(i);
  }
  return allSlugs[hash % allSlugs.length];
}

export function getLevel(xp: number): { level: number; current: number; needed: number } {
  const level = Math.floor(xp / 100) + 1;
  const current = xp % 100;
  const needed = 100;
  return { level, current, needed };
}
