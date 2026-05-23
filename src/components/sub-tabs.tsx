import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props<T extends string> = {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
};

export function SubTabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => onChange(tab.key)}>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            {isActive && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  label: { color: Palette.textMuted, fontSize: 15, fontWeight: '500' },
  labelActive: { color: Palette.text, fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: Palette.green,
    borderRadius: 2,
  },
});
