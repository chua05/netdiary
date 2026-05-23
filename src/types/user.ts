export type UserProfile = {
  id: string;
  email: string;
  username: string;
  bio: string;
  calorieGoal: number;
  weightGoal: number;
  currentWeight: number;
  streak: number;
  avatarUri?: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  username: string;
};
