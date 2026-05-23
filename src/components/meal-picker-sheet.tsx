import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

const MEAL_OPTIONS: { key: MealType; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (meal: MealType) => void;
};

export function MealPickerSheet({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose meal</Text>
          {MEAL_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              onPress={() => {
                onSelect(opt.key);
                onClose();
              }}>
              <Text style={styles.optionText}>{opt.label}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: Palette.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  option: {
    backgroundColor: Palette.black,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  optionPressed: { borderColor: Palette.green, backgroundColor: Palette.accentMuted },
  optionText: { color: Palette.text, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  cancel: { marginTop: 8, paddingVertical: 14 },
  cancelText: { color: Palette.textMuted, fontSize: 16, textAlign: 'center', fontWeight: '600' },
});
