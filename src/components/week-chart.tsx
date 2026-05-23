import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const COLORS = [Palette.red, Palette.green, Palette.orange, Palette.green, Palette.red, Palette.orange, Palette.green];
const HEIGHTS = [0.45, 0.7, 0.55, 0.9, 0.65, 0.4, 0.5];

export function WeekChart({ todayIndex = 4 }: { todayIndex?: number }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.goalLine} />
      <View style={styles.bars}>
        {DAYS.map((day, i) => (
          <View key={day} style={styles.col}>
            {i === todayIndex && <Text style={styles.triangle}>▲</Text>}
            <View
              style={[
                styles.bar,
                {
                  height: 48 * HEIGHTS[i],
                  backgroundColor: COLORS[i],
                  opacity: i === todayIndex ? 1 : 0.7,
                },
              ]}
            />
            <Text style={[styles.day, i === todayIndex && styles.dayActive]}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 20, paddingTop: 8 },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 28,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: Palette.textDim,
  },
  bars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 72 },
  col: { alignItems: 'center', flex: 1 },
  triangle: { color: Palette.green, fontSize: 8, marginBottom: 2 },
  bar: { width: 14, borderRadius: 7, minHeight: 8 },
  day: { color: Palette.textMuted, fontSize: 10, marginTop: 6 },
  dayActive: { color: Palette.green, fontWeight: '700' },
});
