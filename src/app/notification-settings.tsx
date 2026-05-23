import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import {
  DEFAULT_REMINDERS,
  loadReminderSettings,
  requestNotificationPermissions,
  saveReminderSettings,
  scheduleAllReminders,
} from '@/utils/notifications';
import { Palette } from '@/constants/theme';
import type { ReminderKey, ReminderSettings } from '@/types/notifications';

const LABELS: Record<ReminderKey, string> = {
  breakfast: 'Breakfast reminder',
  lunch: 'Lunch reminder',
  dinner: 'Dinner reminder',
  snacks: 'Snack reminder',
  water: 'Water reminder',
  dailyLog: 'Daily log reminder',
  weeklyProgress: 'Weekly progress',
};

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadReminderSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  const persist = async (next: ReminderSettings) => {
    setSettings(next);
    await saveReminderSettings(next);
    await scheduleAllReminders(next);
  };

  const toggleMaster = async (enabled: boolean) => {
    if (enabled) await requestNotificationPermissions();
    await persist({ ...settings, enabled });
  };

  const toggleReminder = (key: ReminderKey, enabled: boolean) => {
    persist({
      ...settings,
      reminders: {
        ...settings.reminders,
        [key]: { ...settings.reminders[key], enabled },
      },
    });
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Notifications" leftIcon="back" onLeft={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.row}>
          <Text style={styles.label}>Enable reminders</Text>
          <Switch
            value={settings.enabled}
            onValueChange={toggleMaster}
            trackColor={{ false: Palette.border, true: Palette.green }}
          />
        </View>
        <PressableRow
          label="Customize reminder times"
          onPress={() => router.push('/modals/reminder-settings')}
        />
        {(Object.keys(settings.reminders) as ReminderKey[]).map((key) => (
          <View key={key} style={styles.row}>
            <View>
              <Text style={styles.label}>{LABELS[key]}</Text>
              <Text style={styles.time}>{settings.reminders[key].time}</Text>
            </View>
            <Switch
              value={settings.reminders[key].enabled}
              onValueChange={(v) => toggleReminder(key, v)}
              disabled={!settings.enabled}
              trackColor={{ false: Palette.border, true: Palette.green }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function PressableRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.linkRow} onPress={onPress}>
      <Text style={styles.link}>{label} →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  scroll: { padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  label: { color: Palette.text, fontSize: 16 },
  time: { color: Palette.textMuted, fontSize: 13, marginTop: 4 },
  linkRow: { padding: 16, marginBottom: 16 },
  link: { color: Palette.green, fontWeight: '600', fontSize: 16 },
});
