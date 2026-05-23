import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { DiaryState, FoodLog, MacroGoals, MealType } from '@/types/diary';
import type { FoodItem } from '@/types/diary';

const STORAGE_KEY = 'mynetdiary-state-v1';

const DEFAULT_STATE: DiaryState = {
  calorieBudget: 2110,
  macroGoals: { carbs: 237, protein: 79, fat: 70 },
  logs: [],
  waterGlasses: 0,
  waterGoal: 8,
};

type Totals = { calories: number; carbs: number; protein: number; fat: number };

type DiaryContextValue = DiaryState & {
  ready: boolean;
  totals: Totals;
  caloriesLeft: number;
  budgetProgress: number;
  mealTotals: Record<MealType, number>;
  addFood: (food: FoodItem, meal: MealType) => void;
  removeLog: (id: string) => void;
  setCalorieBudget: (n: number) => void;
  setMacroGoals: (goals: MacroGoals) => void;
  clearToday: () => void;
  addWater: () => void;
  removeWater: () => void;
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function sumLogs(logs: FoodLog[]): Totals {
  return logs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      carbs: acc.carbs + log.carbs,
      protein: acc.protein + log.protein,
      fat: acc.fat + log.fat,
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0 },
  );
}

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DiaryState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as DiaryState & { date?: string };
          if (parsed.date === todayKey()) {
            setState({
              calorieBudget: parsed.calorieBudget ?? DEFAULT_STATE.calorieBudget,
              macroGoals: parsed.macroGoals ?? DEFAULT_STATE.macroGoals,
              logs: parsed.logs ?? [],
              waterGlasses: parsed.waterGlasses ?? 0,
              waterGoal: parsed.waterGoal ?? 8,
            });
          }
        } catch {
          /* use defaults */
        }
      }
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: DiaryState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, date: todayKey() }));
  }, []);

  const todayLogs = useMemo(
    () => state.logs.filter((l) => l.loggedAt.startsWith(todayKey())),
    [state.logs],
  );

  const totals = useMemo(() => sumLogs(todayLogs), [todayLogs]);

  const mealTotals = useMemo(() => {
    const meals: Record<MealType, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0,
    };
    for (const log of todayLogs) {
      meals[log.meal] += log.calories;
    }
    return meals;
  }, [todayLogs]);

  const caloriesLeft = Math.max(0, state.calorieBudget - totals.calories);
  const budgetProgress = Math.min(1, totals.calories / state.calorieBudget);

  const addFood = useCallback(
    (food: FoodItem, meal: MealType) => {
      const log: FoodLog = {
        ...food,
        id: `${food.id}-${Date.now()}`,
        meal,
        loggedAt: new Date().toISOString(),
      };
      persist({ ...state, logs: [...state.logs, log] });
    },
    [persist, state],
  );

  const removeLog = useCallback(
    (id: string) => {
      persist({ ...state, logs: state.logs.filter((l) => l.id !== id) });
    },
    [persist, state],
  );

  const setCalorieBudget = useCallback(
    (n: number) => persist({ ...state, calorieBudget: Math.max(800, Math.round(n)) }),
    [persist, state],
  );

  const setMacroGoals = useCallback(
    (goals: MacroGoals) => persist({ ...state, macroGoals: goals }),
    [persist, state],
  );

  const clearToday = useCallback(() => {
    persist({
      ...state,
      logs: state.logs.filter((l) => !l.loggedAt.startsWith(todayKey())),
      waterGlasses: 0,
    });
  }, [persist, state]);

  const addWater = useCallback(() => {
    if (state.waterGlasses >= state.waterGoal) return;
    persist({ ...state, waterGlasses: state.waterGlasses + 1 });
  }, [persist, state]);

  const removeWater = useCallback(() => {
    if (state.waterGlasses <= 0) return;
    persist({ ...state, waterGlasses: state.waterGlasses - 1 });
  }, [persist, state]);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      totals,
      caloriesLeft,
      budgetProgress,
      mealTotals,
      addFood,
      removeLog,
      setCalorieBudget,
      setMacroGoals,
      clearToday,
      addWater,
      removeWater,
    }),
    [
      state,
      ready,
      totals,
      caloriesLeft,
      budgetProgress,
      mealTotals,
      addFood,
      removeLog,
      setCalorieBudget,
      setMacroGoals,
      clearToday,
      addWater,
      removeWater,
    ],
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
}

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error('useDiary must be used within DiaryProvider');
  return ctx;
}
