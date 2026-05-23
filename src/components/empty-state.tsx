import { SymbolView } from 'expo-symbols';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import type { AppIconName } from '@/types/icons';

type Props = {
  message: string;
  icon?: AppIconName;
};

export function EmptyState({
  message,
  icon = { ios: 'doc.text', android: 'article', web: 'article' },
}: Props) {
  return (
    <View style={styles.wrap}>
      <SymbolView name={icon} size={48} tintColor={Palette.textDim} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  text: { color: Palette.textMuted, fontSize: 16, textAlign: 'center' },
});
