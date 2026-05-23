import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { Palette } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Enter email', 'Please enter your account email.');
      return;
    }
    Alert.alert(
      'Demo app',
      'Password reset is simulated locally. Use the same email you registered with, or create a new account.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.sub}>
        Enter your email. In this offline demo, passwords are stored on-device only — contact support is
        simulated.
      </Text>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <PrimaryButton label="Send Reset Link" onPress={onSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: 24 },
  back: { color: Palette.green, fontSize: 16, marginBottom: 24 },
  title: { color: Palette.text, fontSize: 28, fontWeight: '800', marginBottom: 12 },
  sub: { color: Palette.textMuted, fontSize: 15, lineHeight: 22, marginBottom: 24 },
});
