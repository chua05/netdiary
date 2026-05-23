import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { ScreenHeader } from '@/components/screen-header';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export default function MealDetailScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();
  const meal = (type ?? 'breakfast') as MealType;
  const { logs, mealTotals, removeLog } = useDiary();

  const mealLogs = useMemo(
    () =>
      logs.filter((l) => l.meal === meal && l.loggedAt.startsWith(todayKey())),
    [logs, meal],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={LABELS[meal] ?? 'Meal'} leftIcon="back" onLeft={() => router.back()} />
      <Text style={styles.total}>{mealTotals[meal]} calories logged</Text>
      <FlatList
        data={mealLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message={`Nothing logged for ${LABELS[meal]}.`} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: '/food/[id]', params: { id: item.id } })}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.calories} cal · C{item.carbs} P{item.protein} F{item.fat}
              </Text>
            </View>
            <Pressable onPress={() => removeLog(item.id)}>
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </Pressable>
        )}
      />
      <Fab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  total: { color: Palette.green, fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 8 },
  list: { padding: 16, paddingBottom: 120, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  name: { color: Palette.text, fontSize: 16, fontWeight: '600' },
  meta: { color: Palette.textMuted, fontSize: 13, marginTop: 4 },
  remove: { color: Palette.red, fontSize: 28, paddingHorizontal: 8 },
});
