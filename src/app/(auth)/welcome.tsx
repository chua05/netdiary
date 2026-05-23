import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { Palette, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🥗</Text>
        <Text style={styles.title}>Welcome to MyNetDiary</Text>
        <Text style={styles.sub}>
          Log meals, track macros, join communities, and hit your goals — all offline on your device.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Sign In" onPress={() => router.push('/(auth)/login')} />
        <PrimaryButton
          label="Create Account"
          variant="outline"
          onPress={() => router.push('/(auth)/register')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: Spacing.four },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  emoji: { fontSize: 72, marginBottom: 24 },
  title: { color: Palette.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  sub: { color: Palette.textMuted, fontSize: 16, textAlign: 'center', marginTop: 16, lineHeight: 24 },
  actions: { paddingBottom: Spacing.four },
});
