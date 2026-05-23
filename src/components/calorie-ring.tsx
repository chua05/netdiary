import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  budget: number;
  consumed: number;
  left: number;
  progress: number;
};

export function CalorieRing({ budget, consumed, left, progress }: Props) {
  const deg = Math.min(progress, 1) * 270;
  const ringColor = progress > 1 ? Palette.red : Palette.green;

  return (
    <View style={styles.wrap}>
      <Text style={styles.budgetLabel}>Calorie Budget</Text>
      <Text style={styles.budgetValue}>{budget.toLocaleString()}</Text>

      <View style={styles.ringOuter}>
        <View style={[styles.ringTrack]} />
        <View
          style={[
            styles.ringProgress,
            {
              borderTopColor: ringColor,
              borderRightColor: progress > 0.33 ? ringColor : 'transparent',
              borderBottomColor: progress > 0.66 ? ringColor : 'transparent',
              borderLeftColor: progress > 0.85 ? ringColor : 'transparent',
              transform: [{ rotate: `${deg - 135}deg` }],
            },
          ]}
        />
        <View style={styles.apple}>
          <Text style={styles.consumed}>{consumed}</Text>
          <Text style={styles.leftLabel}>Left</Text>
          <Text style={styles.leftValue}>{left.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const RING = 200;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  budgetLabel: { color: Palette.textMuted, fontSize: 13 },
  budgetValue: { color: Palette.green, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  ringOuter: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTrack: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 10,
    borderColor: Palette.border,
  },
  ringProgress: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 10,
  },
  apple: {
    width: RING - 36,
    height: RING - 36,
    borderRadius: (RING - 36) / 2,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumed: { color: Palette.green, fontSize: 36, fontWeight: '700' },
  leftLabel: { color: Palette.text, fontSize: 14, marginTop: 2 },
  leftValue: { color: Palette.text, fontSize: 22, fontWeight: '600' },
});
