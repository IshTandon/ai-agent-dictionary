'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

import { getProgress, updateStreak, saveProgress } from './progress';

interface ProgressState {
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  viewedTerms: string[];
  quizResults: Record<string, { correct: boolean; timestamp: number }>;
}

interface ProgressContextValue extends ProgressState {
  refresh: () => void;
}

const defaultState: ProgressState = {
  xp: 0,
  level: 1,
  xpToNextLevel: 100,
  streak: 0,
  viewedTerms: [],
  quizResults: {},
};

const ProgressContext = createContext<ProgressContextValue>({
  ...defaultState,
  refresh: () => {},
});

export function useProgress() {
  return useContext(ProgressContext);
}

function readState(): ProgressState {
  const p = getProgress();
  return {
    xp: p.xp,
    level: Math.floor(p.xp / 100) + 1,
    xpToNextLevel: 100 - (p.xp % 100),
    streak: p.streak,
    viewedTerms: p.viewed_terms,
    quizResults: Object.fromEntries(
      Object.entries(p.quiz_attempts).map(([k, v]) => [
        k,
        { correct: v.correct, timestamp: new Date(v.attempted_at).getTime() },
      ])
    ),
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultState);

  const refresh = useCallback(() => {
    setState(readState());
  }, []);

  useEffect(() => {
    const p = getProgress();
    updateStreak(p);
    saveProgress(p);
    refresh();

    function onProgressUpdate() {
      refresh();
    }

    window.addEventListener('aad-progress-update', onProgressUpdate);
    window.addEventListener('storage', onProgressUpdate);
    return () => {
      window.removeEventListener('aad-progress-update', onProgressUpdate);
      window.removeEventListener('storage', onProgressUpdate);
    };
  }, [refresh]);

  return (
    <ProgressContext.Provider value={{ ...state, refresh }}>
      {children}
    </ProgressContext.Provider>
  );
}
