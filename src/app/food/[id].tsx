import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';

export default function FoodDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { logs } = useDiary();
  const log = logs.find((l) => l.id === id);

  if (!log) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Food" leftIcon="back" onLeft={() => router.back()} />
        <Text style={styles.missing}>Food log not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Food Details" leftIcon="back" onLeft={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.name}>{log.name}</Text>
        <Text style={styles.meal}>{log.meal}</Text>
        <View style={styles.card}>
          <Text style={styles.cal}>{log.calories}</Text>
          <Text style={styles.calLabel}>calories</Text>
        </View>
        <View style={styles.macros}>
          <Macro label="Carbs" value={`${log.carbs}g`} />
          <Macro label="Protein" value={`${log.protein}g`} />
          <Macro label="Fat" value={`${log.fat}g`} />
        </View>
        <Text style={styles.time}>Logged {new Date(log.loggedAt).toLocaleString()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macro}>
      <Text style={styles.macroVal}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  scroll: { padding: 24 },
  missing: { color: Palette.textMuted, textAlign: 'center', marginTop: 40 },
  name: { color: Palette.text, fontSize: 26, fontWeight: '800' },
  meal: { color: Palette.green, fontSize: 15, marginTop: 8, textTransform: 'capitalize' },
  card: {
    backgroundColor: Palette.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
  },
  cal: { color: Palette.green, fontSize: 48, fontWeight: '800' },
  calLabel: { color: Palette.textMuted, marginTop: 4 },
  macros: { flexDirection: 'row', gap: 12, marginTop: 20 },
  macro: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  macroVal: { color: Palette.text, fontSize: 20, fontWeight: '700' },
  macroLabel: { color: Palette.textMuted, fontSize: 12, marginTop: 4 },
  time: { color: Palette.textDim, marginTop: 24, textAlign: 'center' },
});
