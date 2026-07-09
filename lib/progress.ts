export interface UserProgress {
  xp: number;
  viewed_terms: string[];
  quiz_attempts: Record<string, { correct: boolean; attempted_at: string }>;
  streak: number;
  last_visit: string | null;
  daily_term_viewed: string | null;
  last_seen: Record<string, string>;
  last_session_date: string | null;
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
    last_seen: {},
    last_session_date: null,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const stored = JSON.parse(raw);
    return { ...defaultProgress(), ...stored };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function notifyUpdate(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aad-progress-update'));
}

export function updateStreak(p: UserProgress): void {
  const today = todayISO();
  if (p.last_visit === today) return;

  if (p.last_visit === yesterdayISO()) {
    p.streak += 1;
  } else if (p.last_visit !== today) {
    p.streak = 1;
  }
  p.last_visit = today;
}

export function trackTermView(slug: string): number {
  const p = getProgress();
  if (!p.last_seen) p.last_seen = {};
  p.last_seen[slug] = new Date().toISOString();

  if (p.viewed_terms.includes(slug)) {
    updateStreak(p);
    saveProgress(p);
    notifyUpdate();
    return 0;
  }

  p.viewed_terms.push(slug);
  p.xp += 5;
  updateStreak(p);
  saveProgress(p);
  notifyUpdate();
  return 5;
}

export function trackQuizAttempt(slug: string, correct: boolean): number {
  const p = getProgress();
  const gained = correct ? 25 : 10;

  p.quiz_attempts[slug] = {
    correct,
    attempted_at: new Date().toISOString(),
  };
  p.xp += gained;

  updateStreak(p);
  saveProgress(p);
  notifyUpdate();
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

export function completeSession(): { newStreak: number; oldStreak: number } {
  const p = getProgress();
  const today = todayISO();
  const yesterday = yesterdayISO();
  const oldStreak = p.streak;

  if (p.last_session_date === today) {
    // Already completed today — no change
  } else if (p.last_session_date === yesterday) {
    p.streak += 1;
  } else {
    p.streak = 1;
  }

  p.last_session_date = today;
  p.last_visit = today;
  saveProgress(p);
  notifyUpdate();
  return { newStreak: p.streak, oldStreak };
}

export function addXP(amount: number): void {
  const p = getProgress();
  p.xp += amount;
  saveProgress(p);
  notifyUpdate();
}

export function resetLastSeen(slug: string): void {
  const p = getProgress();
  if (!p.last_seen) p.last_seen = {};
  p.last_seen[slug] = new Date(0).toISOString();
  saveProgress(p);
}

export function isSessionCompletedToday(): boolean {
  const p = getProgress();
  return p.last_session_date === todayISO();
}

export { todayISO };
