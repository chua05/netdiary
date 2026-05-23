import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { TextField } from '@/components/text-field';
import { useAuth } from '@/context/auth-context';
import { Palette } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email.trim() || !username.trim() || password.length < 4) {
      Alert.alert('Invalid form', 'Fill all fields. Password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    const ok = await register(email.trim(), username.trim(), password);
    setLoading(false);
    if (ok) router.replace('/(tabs)');
    else Alert.alert('Registration failed', 'Email already registered.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Create Account</Text>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <PrimaryButton label="Register" onPress={onRegister} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: 24 },
  back: { color: Palette.green, fontSize: 16, marginBottom: 24 },
  title: { color: Palette.text, fontSize: 28, fontWeight: '800', marginBottom: 24 },
});
