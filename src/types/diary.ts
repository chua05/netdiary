export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
};

export type FoodLog = FoodItem & {
  meal: MealType;
  loggedAt: string;
};

export type MacroGoals = {
  carbs: number;
  protein: number;
  fat: number;
};

export type DiaryState = {
  calorieBudget: number;
  macroGoals: MacroGoals;
  logs: FoodLog[];
  waterGlasses: number;
  waterGoal: number;
};
