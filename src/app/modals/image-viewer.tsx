import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

export default function ImageViewerModal() {
  const router = useRouter();
  const { uri, label } = useLocalSearchParams<{ uri?: string; label?: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.close}>✕ Close</Text>
      </Pressable>
      <View style={styles.viewer}>
        {uri ? (
          <Text style={styles.placeholder}>Image: {uri}</Text>
        ) : (
          <View style={styles.mock}>
            <Text style={styles.emoji}>🖼️</Text>
            <Text style={styles.mockText}>{label ?? 'Progress photo'}</Text>
            <Text style={styles.sub}>Image viewer demo — attach URIs when adding photo posts.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  closeBtn: { padding: 16 },
  close: { color: Palette.text, fontSize: 16 },
  viewer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  placeholder: { color: Palette.textMuted },
  mock: { alignItems: 'center' },
  emoji: { fontSize: 64 },
  mockText: { color: Palette.text, fontSize: 20, fontWeight: '700', marginTop: 16 },
  sub: { color: Palette.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 20 },
});
