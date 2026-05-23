import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QUICK_FOODS } from '@/data/foods';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

function parseMealParam(value: string | string[] | undefined): MealType | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && MEALS.includes(raw as MealType)) return raw as MealType;
  return undefined;
}

export default function LogFoodModal() {
  const router = useRouter();
  const { meal: mealParam } = useLocalSearchParams<{ meal?: string }>();
  const { addFood } = useDiary();
  const [meal, setMeal] = useState<MealType>(() => parseMealParam(mealParam) ?? 'lunch');

  useEffect(() => {
    const parsed = parseMealParam(mealParam);
    if (parsed) setMeal(parsed);
  }, [mealParam]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Log Food</Text>
        <Pressable onPress={() => router.push('/modals/meal-search')}>
          <Text style={styles.search}>Search</Text>
        </Pressable>
      </View>
      <View style={styles.mealRow}>
        {MEALS.map((m) => (
          <Pressable
            key={m}
            style={[styles.mealChip, meal === m && styles.mealChipActive]}
            onPress={() => setMeal(m)}>
            <Text style={[styles.mealText, meal === m && styles.mealTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={QUICK_FOODS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.foodRow}
            onPress={() => {
              addFood(item, meal);
              router.back();
            }}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodCal}>{item.calories} cal</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  close: { color: Palette.textMuted, fontSize: 16 },
  title: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  search: { color: Palette.green, fontSize: 16, fontWeight: '600' },
  mealRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  mealChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Palette.card,
  },
  mealChipActive: { backgroundColor: Palette.accentMuted },
  mealText: { color: Palette.textMuted, textTransform: 'capitalize', fontSize: 13 },
  mealTextActive: { color: Palette.green, fontWeight: '700' },
  list: { padding: 16 },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  foodName: { color: Palette.text, fontSize: 16, flex: 1 },
  foodCal: { color: Palette.green, fontWeight: '600' },
});
