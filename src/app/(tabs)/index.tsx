import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalorieRing } from '@/components/calorie-ring';
import { Fab } from '@/components/fab';
import { MealPickerSheet } from '@/components/meal-picker-sheet';
import { MacroBars } from '@/components/macro-bars';
import { ScreenHeader } from '@/components/screen-header';
import { WeekChart } from '@/components/week-chart';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

const MEALS: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [mealPickerVisible, setMealPickerVisible] = useState(false);
  const {
    calorieBudget,
    totals,
    caloriesLeft,
    budgetProgress,
    mealTotals,
    macroGoals,
    waterGlasses,
    waterGoal,
    addWater,
    removeWater,
  } = useDiary();

  const calFromMacros = totals.carbs * 4 + totals.protein * 4 + totals.fat * 9;
  const totalCals = calFromMacros || 1;
  const macros = [
    { label: 'CARBS', grams: totals.carbs, goal: macroGoals.carbs, pct: Math.round((totals.carbs * 4 / totalCals) * 100) },
    { label: 'PROTEIN', grams: totals.protein, goal: macroGoals.protein, pct: Math.round((totals.protein * 4 / totalCals) * 100) },
    { label: 'FAT', grams: totals.fat, goal: macroGoals.fat, pct: Math.round((totals.fat * 9 / totalCals) * 100) },
  ];

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title="Dashboard"
        leftIcon="calendar"
        onMenu={() => router.push('/notification-settings')}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <CalorieRing
          budget={calorieBudget}
          consumed={totals.calories}
          left={caloriesLeft}
          progress={budgetProgress}
        />
        <MacroBars macros={macros} />

        <View style={styles.waterCard}>
          <Text style={styles.sectionTitle}>Water</Text>
          <Text style={styles.waterCount}>
            {waterGlasses} / {waterGoal} glasses
          </Text>
          <View style={styles.waterRow}>
            <Pressable style={styles.waterBtn} onPress={removeWater}>
              <Text style={styles.waterBtnText}>−</Text>
            </Pressable>
            <View style={styles.waterDots}>
              {Array.from({ length: waterGoal }).map((_, i) => (
                <View key={i} style={[styles.dot, i < waterGlasses && styles.dotFilled]} />
              ))}
            </View>
            <Pressable style={styles.waterBtn} onPress={addWater}>
              <Text style={styles.waterBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.chartLink} onPress={() => router.push('/modals/progress-chart')}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <WeekChart todayIndex={todayIndex} />
        </Pressable>

        <View style={styles.mealsHeader}>
          <Text style={[styles.sectionTitle, styles.mealsTitle]}>Meals</Text>
          <Pressable style={styles.addMealBtn} onPress={() => setMealPickerVisible(true)}>
            <Text style={styles.addMealText}>+ Add Meal</Text>
          </Pressable>
        </View>
        {MEALS.map((m) => (
          <Pressable
            key={m.key}
            style={styles.mealRow}
            onPress={() => router.push({ pathname: '/meal/[type]', params: { type: m.key } })}>
            <Text style={styles.mealLabel}>{m.label}</Text>
            <Text style={styles.mealCals}>{mealTotals[m.key]} cal</Text>
          </Pressable>
        ))}
        <Pressable style={styles.viewAll} onPress={() => router.push('/meals')}>
          <Text style={styles.viewAllText}>View all meals →</Text>
        </Pressable>
      </ScrollView>
      <Fab />
      <MealPickerSheet
        visible={mealPickerVisible}
        onClose={() => setMealPickerVisible(false)}
        onSelect={(meal) => router.push({ pathname: '/log-food', params: { meal } })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  sectionTitle: { color: Palette.text, fontSize: 17, fontWeight: '700', marginTop: 24 },
  waterCard: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  waterCount: { color: Palette.green, fontSize: 22, fontWeight: '700', marginTop: 8 },
  waterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  waterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtnText: { color: Palette.green, fontSize: 24, fontWeight: '600' },
  waterDots: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Palette.border },
  dotFilled: { backgroundColor: Palette.green },
  chartLink: { marginTop: 8 },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  mealsTitle: { marginTop: 0, marginBottom: 0 },
  addMealBtn: {
    backgroundColor: Palette.accentMuted,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addMealText: { color: Palette.green, fontWeight: '700', fontSize: 14 },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  mealLabel: { color: Palette.text, fontSize: 16, fontWeight: '600' },
  mealCals: { color: Palette.textMuted },
  viewAll: { alignItems: 'center', paddingVertical: 12 },
  viewAllText: { color: Palette.green, fontWeight: '600' },
});
