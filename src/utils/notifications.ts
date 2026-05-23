import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { loadJson, saveJson } from '@/storage/async';
import { StorageKeys } from '@/storage/keys';
import type { ReminderKey, ReminderSettings } from '@/types/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  reminders: {
    breakfast: { enabled: true, time: '07:00' },
    lunch: { enabled: true, time: '12:00' },
    dinner: { enabled: true, time: '18:00' },
    snacks: { enabled: false, time: '15:00' },
    water: { enabled: true, time: '09:00', frequencyHours: 2 },
    dailyLog: { enabled: true, time: '20:00' },
    weeklyProgress: { enabled: true, time: '09:00' },
  },
};

const MESSAGES: Record<ReminderKey, string> = {
  breakfast: 'Time for breakfast 🍳',
  lunch: "Don't forget to log your lunch.",
  dinner: 'Dinner reminder — stay on track!',
  snacks: 'Snack time — log it if you had one.',
  water: 'Drink some water 💧',
  dailyLog: "You haven't logged your meals today.",
  weeklyProgress: 'Keep your streak alive 🔥',
};

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h ?? 8, minute: m ?? 0 };
}

export async function loadReminderSettings(): Promise<ReminderSettings> {
  return loadJson(StorageKeys.reminders, DEFAULT_REMINDERS);
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await saveJson(StorageKeys.reminders, settings);
}

export async function scheduleAllReminders(settings: ReminderSettings): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.enabled) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const key of Object.keys(settings.reminders) as ReminderKey[]) {
    const r = settings.reminders[key];
    if (!r.enabled) continue;
    const { hour, minute } = parseTime(r.time);
    const trigger: Notifications.NotificationTriggerInput =
      key === 'weeklyProgress'
        ? { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: 1, hour, minute }
        : key === 'water' && r.frequencyHours
          ? {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: r.frequencyHours * 3600,
              repeats: true,
            }
          : {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'MyNetDiary',
        body: MESSAGES[key],
        sound: true,
      },
      trigger,
    });
  }
}
