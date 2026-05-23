import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  title: string;
  onMenu?: () => void;
  leftIcon?: 'calendar' | 'back';
  onLeft?: () => void;
};

export function ScreenHeader({ title, onMenu, leftIcon, onLeft }: Props) {
  return (
    <View style={styles.row}>
      {leftIcon ? (
        <Pressable onPress={onLeft} hitSlop={12} style={styles.iconBtn}>
          <SymbolView
            name={
              leftIcon === 'calendar'
                ? { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }
                : { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }
            }
            size={22}
            tintColor={Palette.text}
          />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        {onMenu && (
          <Pressable onPress={onMenu} hitSlop={12}>
            <SymbolView
              name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
              size={22}
              tintColor={Palette.text}
            />
          </Pressable>
        )}
        <Pressable hitSlop={12}>
          <SymbolView
            name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
            size={22}
            tintColor={Palette.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconBtn: { width: 32 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: Palette.text,
  },
  right: { flexDirection: 'row', gap: 16, width: 64, justifyContent: 'flex-end' },
});
