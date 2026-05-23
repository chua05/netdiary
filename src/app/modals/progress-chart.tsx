import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WeekChart } from '@/components/week-chart';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';

export default function ProgressChartModal() {
  const router = useRouter();
  const { calorieBudget, totals, budgetProgress } = useDiary();
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Progress Chart</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Today</Text>
          <Text style={styles.summaryVal}>
            {totals.calories} / {calorieBudget} cal
          </Text>
          <Text style={styles.pct}>{Math.round(budgetProgress * 100)}% of budget</Text>
        </View>
        <WeekChart todayIndex={todayIndex} />
        <Text style={styles.note}>
          Weekly bars are sample visualization. Log meals daily to build your real streak on the
          dashboard.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  close: { color: Palette.textMuted, fontSize: 16, width: 50 },
  title: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  scroll: { padding: 20, paddingBottom: 40 },
  summary: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryLabel: { color: Palette.textMuted },
  summaryVal: { color: Palette.green, fontSize: 28, fontWeight: '800', marginTop: 8 },
  pct: { color: Palette.textMuted, marginTop: 4 },
  note: { color: Palette.textDim, fontSize: 13, marginTop: 24, textAlign: 'center', lineHeight: 20 },
});
