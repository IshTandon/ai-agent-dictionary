'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

import { getProgress, getLevel, type UserProgress } from './progress';

interface ProgressContextValue {
  xp: number;
  streak: number;
  level: number;
  levelCurrent: number;
  levelNeeded: number;
  viewedTerms: string[];
  dailyTermViewed: string | null;
  triggerUpdate: () => void;
}

const defaultValue: ProgressContextValue = {
  xp: 0,
  streak: 0,
  level: 1,
  levelCurrent: 0,
  levelNeeded: 100,
  viewedTerms: [],
  dailyTermViewed: null,
  triggerUpdate: () => {},
};

const ProgressContext = createContext<ProgressContextValue>(defaultValue);

export function useProgress() {
  return useContext(ProgressContext);
}

function readState(p: UserProgress): Omit<ProgressContextValue, 'triggerUpdate'> {
  const { level, current, needed } = getLevel(p.xp);
  return {
    xp: p.xp,
    streak: p.streak,
    level,
    levelCurrent: current,
    levelNeeded: needed,
    viewedTerms: p.viewed_terms,
    dailyTermViewed: p.daily_term_viewed,
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<ProgressContextValue, 'triggerUpdate'>>(defaultValue);

  const triggerUpdate = useCallback(() => {
    setState(readState(getProgress()));
  }, []);

  useEffect(() => {
    triggerUpdate();

    function onStorage() {
      triggerUpdate();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [triggerUpdate]);

  return (
    <ProgressContext.Provider value={{ ...state, triggerUpdate }}>
      {children}
    </ProgressContext.Provider>
  );
}
