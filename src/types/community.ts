export type Comment = {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
};

export type Post = {
  id: string;
  userId: string;
  username: string;
  text: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  type: 'text' | 'progress' | 'motivation';
};

export type Group = {
  id: string;
  groupId: string;
  name: string;
  description: string;
  creatorId: string;
  memberIds: string[];
  favoriteBy: string[];
  createdAt: string;
};

export type DietType = 'deficit' | 'maintenance' | 'gain' | 'high-protein';

export type MealPlanEntry = {
  id: string;
  dayIndex: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  foodId: string;
  foodName: string;
  calories: number;
  scheduledAt: string;
  completed: boolean;
};
