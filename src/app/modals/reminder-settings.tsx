import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import {
  DEFAULT_REMINDERS,
  loadReminderSettings,
  saveReminderSettings,
  scheduleAllReminders,
} from '@/utils/notifications';
import { Palette } from '@/constants/theme';
import type { ReminderKey, ReminderSettings } from '@/types/notifications';

const LABELS: Record<ReminderKey, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
  water: 'Water',
  dailyLog: 'Daily log',
  weeklyProgress: 'Weekly progress',
};

export default function ReminderSettingsModal() {
  const router = useRouter();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDERS);

  useEffect(() => {
    loadReminderSettings().then(setSettings);
  }, []);

  const setTime = (key: ReminderKey, time: string) => {
    setSettings((s) => ({
      ...s,
      reminders: { ...s.reminders, [key]: { ...s.reminders[key], time } },
    }));
  };

  const onSave = async () => {
    await saveReminderSettings(settings);
    await scheduleAllReminders(settings);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.close}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Reminder Times</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.hint}>Use 24h format HH:MM (e.g. 07:30, 18:00)</Text>
        {(Object.keys(settings.reminders) as ReminderKey[]).map((key) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{LABELS[key]}</Text>
            <TextInput
              style={styles.input}
              value={settings.reminders[key].time}
              onChangeText={(t) => setTime(key, t)}
              placeholder="08:00"
              placeholderTextColor={Palette.textDim}
            />
          </View>
        ))}
        <PrimaryButton label="Save & Schedule" onPress={onSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  close: { color: Palette.textMuted, width: 50 },
  title: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  scroll: { padding: 16, paddingBottom: 40 },
  hint: { color: Palette.textMuted, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  label: { color: Palette.text, flex: 1, fontSize: 15 },
  input: {
    width: 80,
    textAlign: 'center',
    color: Palette.green,
    fontSize: 16,
    fontWeight: '600',
  },
});
