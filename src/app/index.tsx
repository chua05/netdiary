import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/context/auth-context';
import { Palette } from '@/constants/theme';

export default function Index() {
  const { ready, session } = useAuth();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Palette.green} />
      </View>
    );
  }

  if (session) return <Redirect href="/(tabs)" />;
  return <Redirect href="/(auth)/splash" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: Palette.black, alignItems: 'center', justifyContent: 'center' },
});
