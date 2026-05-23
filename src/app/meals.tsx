import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { useDiary } from '@/context/diary-context';
import { Palette } from '@/constants/theme';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function MealsScreen() {
  const router = useRouter();
  const { logs, removeLog } = useDiary();

  const todayLogs = useMemo(
    () => logs.filter((l) => l.loggedAt.startsWith(todayKey())).sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)),
    [logs],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Today's Meals" leftIcon="back" onLeft={() => router.back()} />
      <FlatList
        data={todayLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No meals logged today." />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push({ pathname: '/food/[id]', params: { id: item.id } })}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.meal} · {item.calories} cal
              </Text>
            </View>
            <Pressable onPress={() => removeLog(item.id)} hitSlop={12}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  list: { padding: 16, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  name: { color: Palette.text, fontSize: 16, fontWeight: '600' },
  meta: { color: Palette.textMuted, fontSize: 13, marginTop: 4, textTransform: 'capitalize' },
  remove: { color: Palette.red, fontSize: 14 },
});
