export type ReminderKey =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'water'
  | 'dailyLog'
  | 'weeklyProgress';

export type ReminderSettings = {
  enabled: boolean;
  reminders: Record<
    ReminderKey,
    {
      enabled: boolean;
      time: string;
      frequencyHours?: number;
    }
  >;
};
