import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import type { AppIconName } from '@/types/icons';

type Props = {
  title: string;
  subtitle: string;
  icon: AppIconName;
  actionLabel?: string;
  onPress?: () => void;
  onAction?: () => void;
};

export function ToolCard({ title, subtitle, icon, actionLabel, onPress, onAction }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={styles.iconCircle}>
        <SymbolView name={icon} size={24} tintColor={Palette.green} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  pressed: { opacity: 0.9 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  title: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  subtitle: { color: Palette.textMuted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  action: { color: Palette.green, fontSize: 15, fontWeight: '600' },
});
