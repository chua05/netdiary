import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { useCommunity } from '@/context/community-context';
import { Palette } from '@/constants/theme';
import type { Post } from '@/types/community';

const TYPES: Post['type'][] = ['text', 'progress', 'motivation'];

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost } = useCommunity();
  const [text, setText] = useState('');
  const [type, setType] = useState<Post['type']>('text');

  const onPost = () => {
    if (!text.trim()) return;
    createPost(text.trim(), type);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Create Post" leftIcon="back" onLeft={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <Pressable
              key={t}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
              onPress={() => setType(t)}>
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Share your progress or motivation..."
          placeholderTextColor={Palette.textDim}
          value={text}
          onChangeText={setText}
        />
        <PrimaryButton label="Post" onPress={onPost} disabled={!text.trim()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  body: { padding: 16, flex: 1 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Palette.card,
  },
  typeChipActive: { backgroundColor: Palette.accentMuted },
  typeText: { color: Palette.textMuted, textTransform: 'capitalize', fontSize: 13 },
  typeTextActive: { color: Palette.green, fontWeight: '700' },
  input: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    color: Palette.text,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});
