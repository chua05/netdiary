import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/welcome'), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.logo}>🍎</Text>
      <Text style={styles.title}>MyNetDiary</Text>
      <Text style={styles.tagline}>Track. Eat. Thrive.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: Palette.black, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { color: Palette.text, fontSize: 32, fontWeight: '800' },
  tagline: { color: Palette.green, fontSize: 16, marginTop: 8 },
});
