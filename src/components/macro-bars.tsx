import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Macro = { label: string; grams: number; goal: number; pct: number };

type Props = { macros: Macro[] };

export function MacroBars({ macros }: Props) {
  return (
    <View style={styles.row}>
      {macros.map((m) => {
        const progress = Math.min(1, m.grams / m.goal);
        const left = Math.max(0, m.goal - m.grams);
        return (
          <View key={m.label} style={styles.col}>
            <Text style={styles.label}>{m.label}</Text>
            <Text style={styles.pct}>{m.pct}% cals</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.grams}>{m.grams}g</Text>
            <Text style={styles.left}>left {left}g</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginTop: 16 },
  col: { flex: 1, alignItems: 'center' },
  label: { color: Palette.textMuted, fontSize: 11, fontWeight: '600' },
  pct: { color: Palette.textMuted, fontSize: 11, marginBottom: 6 },
  track: {
    height: 6,
    width: '100%',
    backgroundColor: Palette.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Palette.green, borderRadius: 3 },
  grams: { color: Palette.text, fontSize: 15, fontWeight: '600', marginTop: 6 },
  left: { color: Palette.textMuted, fontSize: 11 },
});
