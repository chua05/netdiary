import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { ToolCard } from '@/components/tool-card';
import { DIET_PRESETS, useDiet } from '@/context/diet-context';
import { useDiary } from '@/context/diary-context';
import { QUICK_FOODS } from '@/data/foods';
import { Palette } from '@/constants/theme';
import type { DietType } from '@/types/community';
import type { MealType } from '@/types/diary';

const DIET_KEYS: DietType[] = ['deficit', 'maintenance', 'gain', 'high-protein'];
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

function formatScheduled(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function defaultDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function buildScheduledAt(dateStr: string, timeStr: string): string | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  const d = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${match[2]}:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function DietToolsScreen() {
  const router = useRouter();
  const {
    selectedDiet,
    mealPlan,
    selectDiet,
    addMealPlanEntry,
    removeMealPlanEntry,
    toggleMealPlanCompleted,
  } = useDiet();
  const { setCalorieBudget, setMacroGoals } = useDiary();
  const [tab, setTab] = useState<'diet' | 'planner'>('diet');
  const [addVisible, setAddVisible] = useState(false);
  const [foodQuery, setFoodQuery] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [meal, setMeal] = useState<MealType>('lunch');
  const [dateStr, setDateStr] = useState(defaultDateStr);
  const [timeStr, setTimeStr] = useState(defaultTimeStr);

  const foodResults = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();
    if (!q) return QUICK_FOODS.slice(0, 30);
    return QUICK_FOODS.filter((f) => f.name.toLowerCase().includes(q));
  }, [foodQuery]);

  const selectedFood = useMemo(
    () => QUICK_FOODS.find((f) => f.id === selectedFoodId),
    [selectedFoodId],
  );

  const applyDiet = (type: DietType) => {
    const preset = DIET_PRESETS[type];
    selectDiet(type);
    setCalorieBudget(preset.calories);
    setMacroGoals(preset.macros);
    Alert.alert('Diet applied', `${preset.label} — ${preset.calories} cal/day`);
  };

  const resetAddForm = () => {
    setFoodQuery('');
    setSelectedFoodId(null);
    setMeal('lunch');
    setDateStr(defaultDateStr());
    setTimeStr(defaultTimeStr());
  };

  const openAddPlan = () => {
    resetAddForm();
    setAddVisible(true);
  };

  const savePlanEntry = () => {
    if (!selectedFood) {
      Alert.alert('Select a food', 'Pick a food from the list before saving.');
      return;
    }
    const scheduledAt = buildScheduledAt(dateStr, timeStr);
    if (!scheduledAt) {
      Alert.alert('Invalid date/time', 'Use YYYY-MM-DD and HH:MM (24h).');
      return;
    }
    const scheduled = new Date(scheduledAt);
    addMealPlanEntry({
      dayIndex: (scheduled.getDay() + 6) % 7,
      meal,
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      calories: selectedFood.calories,
      scheduledAt,
      completed: false,
    });
    setAddVisible(false);
    resetAddForm();
  };

  const sortedPlan = useMemo(
    () => [...mealPlan].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [mealPlan],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Diet Tools" />
      <View style={styles.tabs}>
        <Pressable style={[styles.tab, tab === 'diet' && styles.tabActive]} onPress={() => setTab('diet')}>
          <Text style={[styles.tabText, tab === 'diet' && styles.tabTextActive]}>My Diet</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'planner' && styles.tabActive]} onPress={() => setTab('planner')}>
          <Text style={[styles.tabText, tab === 'planner' && styles.tabTextActive]}>Meal Planner</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {tab === 'diet' ? (
          <>
            <Text style={styles.hint}>Tap a preset to update your calorie budget and macros.</Text>
            {DIET_KEYS.map((key) => {
              const p = DIET_PRESETS[key];
              const active = selectedDiet === key;
              return (
                <Pressable
                  key={key}
                  style={[styles.preset, active && styles.presetActive]}
                  onPress={() => applyDiet(key)}>
                  <Text style={styles.presetTitle}>{p.label}</Text>
                  <Text style={styles.presetSub}>{p.description}</Text>
                  <Text style={styles.presetCals}>
                    {p.calories} cal · C{p.macros.carbs} P{p.macros.protein} F{p.macros.fat}
                  </Text>
                </Pressable>
              );
            })}
          </>
        ) : (
          <>
            <ToolCard
              title="Add planned meal"
              subtitle="Pick food, date, and time"
              icon={{ ios: 'plus.circle', android: 'add_circle', web: 'add_circle' }}
              actionLabel="Add"
              onAction={openAddPlan}
            />
            {sortedPlan.length === 0 ? (
              <Text style={styles.empty}>No meals planned yet. Tap Add to start.</Text>
            ) : (
              sortedPlan.map((entry) => (
                <View
                  key={entry.id}
                  style={[styles.planRow, entry.completed && styles.planRowDone]}>
                  <Pressable
                    style={styles.checkBtn}
                    onPress={() => toggleMealPlanCompleted(entry.id)}
                    hitSlop={8}>
                    <SymbolView
                      name={{
                        ios: entry.completed ? 'checkmark.circle.fill' : 'circle',
                        android: entry.completed ? 'check_circle' : 'radio_button_unchecked',
                        web: entry.completed ? 'check_circle' : 'radio_button_unchecked',
                      }}
                      size={26}
                      tintColor={entry.completed ? Palette.green : Palette.textDim}
                    />
                  </Pressable>
                  <View style={styles.planBody}>
                    <Text style={[styles.planFood, entry.completed && styles.planFoodDone]}>
                      {entry.foodName}
                    </Text>
                    <Text style={styles.planWhen}>{formatScheduled(entry.scheduledAt)}</Text>
                    <Text style={styles.planMeta}>
                      {entry.meal} · {entry.calories} cal
                    </Text>
                  </View>
                  <Pressable onPress={() => removeMealPlanEntry(entry.id)} hitSlop={8}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              ))
            )}
            <Pressable style={styles.searchLink} onPress={() => router.push('/modals/meal-search')}>
              <Text style={styles.searchText}>Search foods to log →</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <Modal visible={addVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setAddVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Plan a meal</Text>
            <Pressable onPress={savePlanEntry}>
              <Text style={styles.modalSave}>Save</Text>
            </Pressable>
          </View>
          <Text style={styles.fieldLabel}>Meal type</Text>
          <View style={styles.mealRow}>
            {MEALS.map((m) => (
              <Pressable
                key={m}
                style={[styles.mealChip, meal === m && styles.mealChipActive]}
                onPress={() => setMeal(m)}>
                <Text style={[styles.mealChipText, meal === m && styles.mealChipTextActive]}>{m}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={dateStr}
            onChangeText={setDateStr}
            placeholder="2026-05-20"
            placeholderTextColor={Palette.textDim}
          />
          <Text style={styles.fieldLabel}>Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={timeStr}
            onChangeText={setTimeStr}
            placeholder="12:30"
            placeholderTextColor={Palette.textDim}
          />
          <Text style={styles.fieldLabel}>Food</Text>
          <TextInput
            style={styles.input}
            value={foodQuery}
            onChangeText={setFoodQuery}
            placeholder="Search foods..."
            placeholderTextColor={Palette.textDim}
          />
          {selectedFood ? (
            <Text style={styles.selectedFood}>Selected: {selectedFood.name}</Text>
          ) : null}
          <FlatList
            data={foodResults}
            keyExtractor={(item) => item.id}
            style={styles.foodList}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.foodRow, selectedFoodId === item.id && styles.foodRowActive]}
                onPress={() => setSelectedFoodId(item.id)}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCal}>{item.calories} cal</Text>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: Palette.card },
  tabActive: { backgroundColor: Palette.accentMuted },
  tabText: { color: Palette.textMuted, fontWeight: '600' },
  tabTextActive: { color: Palette.green },
  scroll: { padding: 16, paddingBottom: 40 },
  hint: { color: Palette.textMuted, marginBottom: 16, fontSize: 14 },
  preset: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  presetActive: { borderColor: Palette.green },
  presetTitle: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  presetSub: { color: Palette.textMuted, fontSize: 13, marginTop: 6 },
  presetCals: { color: Palette.green, fontSize: 13, marginTop: 8, fontWeight: '600' },
  empty: { color: Palette.textMuted, textAlign: 'center', marginTop: 24 },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  planRowDone: { opacity: 0.75 },
  checkBtn: { padding: 2 },
  planBody: { flex: 1 },
  planFood: { color: Palette.text, fontSize: 16, fontWeight: '600' },
  planFoodDone: { textDecorationLine: 'line-through', color: Palette.textMuted },
  planWhen: { color: Palette.green, fontSize: 13, marginTop: 4, fontWeight: '600' },
  planMeta: { color: Palette.textDim, fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  remove: { color: Palette.red, fontSize: 13 },
  searchLink: { marginTop: 20, alignItems: 'center' },
  searchText: { color: Palette.green, fontWeight: '600' },
  modalSafe: { flex: 1, backgroundColor: Palette.black },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  modalClose: { color: Palette.textMuted, fontSize: 16, width: 60 },
  modalTitle: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  modalSave: { color: Palette.green, fontSize: 16, fontWeight: '700', width: 60, textAlign: 'right' },
  fieldLabel: {
    color: Palette.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  mealRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  mealChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Palette.card,
  },
  mealChipActive: { backgroundColor: Palette.accentMuted },
  mealChipText: { color: Palette.textMuted, textTransform: 'capitalize', fontSize: 13 },
  mealChipTextActive: { color: Palette.green, fontWeight: '700' },
  input: {
    marginHorizontal: 16,
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    color: Palette.text,
    fontSize: 16,
  },
  selectedFood: { color: Palette.green, marginHorizontal: 16, marginTop: 8, fontWeight: '600' },
  foodList: { flex: 1, marginTop: 8, paddingHorizontal: 16 },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  foodRowActive: { borderColor: Palette.green, backgroundColor: Palette.accentMuted },
  foodName: { color: Palette.text, flex: 1 },
  foodCal: { color: Palette.green, fontWeight: '600' },
});
