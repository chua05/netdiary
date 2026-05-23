import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QUICK_FOODS } from '@/data/foods';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function MealSearchModal() {
  const router = useRouter();
  const { addFood } = useDiary();
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState<MealType>('lunch');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return QUICK_FOODS;
    return QUICK_FOODS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Search Foods</Text>
        <View style={{ width: 50 }} />
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search food database..."
        placeholderTextColor={Palette.textDim}
        value={query}
        onChangeText={setQuery}
        autoFocus
      />
      <View style={styles.mealRow}>
        {MEALS.map((m) => (
          <Pressable
            key={m}
            style={[styles.chip, meal === m && styles.chipActive]}
            onPress={() => setMeal(m)}>
            <Text style={[styles.chipText, meal === m && styles.chipTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => {
              addFood(item, meal);
              router.back();
            }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.cal}>{item.calories} cal</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No foods match your search.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  close: { color: Palette.textMuted, width: 50 },
  title: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  search: {
    marginHorizontal: 16,
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    color: Palette.text,
    fontSize: 16,
  },
  mealRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: Palette.card },
  chipActive: { backgroundColor: Palette.accentMuted },
  chipText: { color: Palette.textMuted, textTransform: 'capitalize', fontSize: 12 },
  chipTextActive: { color: Palette.green, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  name: { color: Palette.text, flex: 1 },
  cal: { color: Palette.green, fontWeight: '600' },
  empty: { color: Palette.textMuted, textAlign: 'center', marginTop: 40 },
});
