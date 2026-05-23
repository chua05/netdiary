import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { MealPickerSheet } from '@/components/meal-picker-sheet';
import { BottomTabInset, Palette } from '@/constants/theme';
import type { MealType } from '@/types/diary';

export function Fab() {
  const router = useRouter();
  const [pickerVisible, setPickerVisible] = useState(false);

  const onMealSelected = (meal: MealType) => {
    router.push({ pathname: '/log-food', params: { meal } });
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
        onPress={() => setPickerVisible(true)}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} size={28} tintColor="#fff" />
      </Pressable>
      <MealPickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={onMealSelected}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: BottomTabInset + 12,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Palette.fab,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: Palette.fab,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.96 }] },
});
