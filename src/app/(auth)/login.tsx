import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter email and password.');
      return;
    }
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) router.replace('/(tabs)');
    else Alert.alert('Login failed', 'Invalid email or password.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Sign In</Text>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@email.com" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
      <Link href="/(auth)/forgot-password" asChild>
        <Pressable>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
      </Link>
      <PrimaryButton label="Sign In" onPress={onLogin} loading={loading} />
      <Pressable onPress={() => router.push('/(auth)/register')} style={styles.footer}>
        <Text style={styles.footerText}>
          No account? <Text style={styles.footerLink}>Register</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: 24 },
  back: { color: Palette.green, fontSize: 16, marginBottom: 24 },
  title: { color: Palette.text, fontSize: 28, fontWeight: '800', marginBottom: 24 },
  link: { color: Palette.green, fontSize: 14, textAlign: 'right', marginBottom: 8 },
  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { color: Palette.textMuted },
  footerLink: { color: Palette.green, fontWeight: '600' },
});
