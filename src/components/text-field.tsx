import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric';
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textDim}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        selectionColor={Palette.green}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { color: Palette.textMuted, fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: Palette.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Palette.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Palette.border,
  },
});
