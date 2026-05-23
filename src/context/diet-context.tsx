import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadJson, saveJson } from '@/storage/async';
import { StorageKeys } from '@/storage/keys';
import type { DietType, MealPlanEntry } from '@/types/community';
import type { MacroGoals } from '@/types/diary';

function normalizeMealPlanEntry(entry: MealPlanEntry & Partial<Pick<MealPlanEntry, 'foodId' | 'scheduledAt' | 'completed'>>): MealPlanEntry {
  const scheduledAt =
    entry.scheduledAt ??
    (() => {
      const d = new Date();
      const day = entry.dayIndex ?? 0;
      const diff = (day - ((d.getDay() + 6) % 7) + 7) % 7;
      d.setDate(d.getDate() + diff);
      d.setHours(8, 0, 0, 0);
      return d.toISOString();
    })();
  const scheduled = new Date(scheduledAt);
  return {
    ...entry,
    foodId: entry.foodId ?? 'rice',
    scheduledAt,
    dayIndex: entry.dayIndex ?? ((scheduled.getDay() + 6) % 7),
    completed: entry.completed ?? false,
  };
}

type DietPreset = {
  label: string;
  description: string;
  calories: number;
  macros: MacroGoals;
};

export const DIET_PRESETS: Record<DietType, DietPreset> = {
  deficit: {
    label: 'Calorie Deficit',
    description: 'Lose weight gradually with a moderate calorie deficit.',
    calories: 1800,
    macros: { carbs: 180, protein: 120, fat: 50 },
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Maintain your current weight with balanced intake.',
    calories: 2110,
    macros: { carbs: 237, protein: 79, fat: 70 },
  },
  gain: {
    label: 'Weight Gain',
    description: 'Build muscle with a controlled calorie surplus.',
    calories: 2600,
    macros: { carbs: 300, protein: 150, fat: 80 },
  },
  'high-protein': {
    label: 'High Protein',
    description: 'Prioritize protein for recovery and satiety.',
    calories: 2200,
    macros: { carbs: 180, protein: 180, fat: 65 },
  },
};

type DietContextValue = {
  ready: boolean;
  selectedDiet: DietType;
  mealPlan: MealPlanEntry[];
  selectDiet: (type: DietType) => void;
  addMealPlanEntry: (entry: Omit<MealPlanEntry, 'id'>) => void;
  removeMealPlanEntry: (id: string) => void;
  toggleMealPlanCompleted: (id: string) => void;
};

const DietContext = createContext<DietContextValue | null>(null);

export function DietProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<DietType>('maintenance');
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);

  useEffect(() => {
    (async () => {
      const diet = await loadJson<{ selectedDiet: DietType }>(StorageKeys.diet, {
        selectedDiet: 'maintenance',
      });
      const raw = await loadJson<MealPlanEntry[]>(StorageKeys.mealPlan, []);
      const plan = raw.map(normalizeMealPlanEntry);
      setSelectedDiet(diet.selectedDiet);
      setMealPlan(plan);
      setReady(true);
    })();
  }, []);

  const selectDiet = useCallback((type: DietType) => {
    setSelectedDiet(type);
    saveJson(StorageKeys.diet, { selectedDiet: type });
  }, []);

  const addMealPlanEntry = useCallback(
    (entry: Omit<MealPlanEntry, 'id'>) => {
      const next = [...mealPlan, { ...entry, id: `mp-${Date.now()}` }];
      setMealPlan(next);
      saveJson(StorageKeys.mealPlan, next);
    },
    [mealPlan],
  );

  const removeMealPlanEntry = useCallback(
    (id: string) => {
      const next = mealPlan.filter((e) => e.id !== id);
      setMealPlan(next);
      saveJson(StorageKeys.mealPlan, next);
    },
    [mealPlan],
  );

  const toggleMealPlanCompleted = useCallback(
    (id: string) => {
      const next = mealPlan.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e));
      setMealPlan(next);
      saveJson(StorageKeys.mealPlan, next);
    },
    [mealPlan],
  );

  const value = useMemo(
    () => ({
      ready,
      selectedDiet,
      mealPlan,
      selectDiet,
      addMealPlanEntry,
      removeMealPlanEntry,
      toggleMealPlanCompleted,
    }),
    [
      ready,
      selectedDiet,
      mealPlan,
      selectDiet,
      addMealPlanEntry,
      removeMealPlanEntry,
      toggleMealPlanCompleted,
    ],
  );

  return <DietContext.Provider value={value}>{children}</DietContext.Provider>;
}

export function useDiet() {
  const ctx = useContext(DietContext);
  if (!ctx) throw new Error('useDiet must be used within DietProvider');
  return ctx;
}
