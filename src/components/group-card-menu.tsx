import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

export type GroupMenuAction = {
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  actions: GroupMenuAction[];
};

export function GroupCardMenu({ visible, onClose, actions }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              onPress={() => {
                action.onPress();
                onClose();
              }}>
              <Text style={[styles.optionText, action.destructive && styles.destructive]}>
                {action.label}
              </Text>
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

export function GroupMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={styles.menuBtn}>
      <SymbolView
        name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
        size={22}
        tintColor={Palette.textMuted}
      />
    </Pressable>
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
    paddingTop: 16,
  },
  option: {
    backgroundColor: Palette.black,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  optionPressed: { backgroundColor: Palette.accentMuted },
  optionText: { color: Palette.text, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  destructive: { color: Palette.red },
  cancel: { marginTop: 8, paddingVertical: 14 },
  cancelText: { color: Palette.textMuted, fontSize: 16, textAlign: 'center', fontWeight: '600' },
  menuBtn: { padding: 4 },
});
