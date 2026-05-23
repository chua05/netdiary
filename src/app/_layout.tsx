import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';

import { Palette } from '@/constants/theme';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { CommunityProvider } from '@/context/community-context';
import { DiaryProvider } from '@/context/diary-context';
import { DietProvider } from '@/context/diet-context';

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.black,
    card: Palette.card,
    text: Palette.text,
    border: Palette.border,
    primary: Palette.green,
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <DiaryProvider>
        <DietProvider>
          <CommunityProvider>
            <ThemeProvider value={theme}>
              <StatusBar barStyle="light-content" />
              <RootNavigator />
            </ThemeProvider>
          </CommunityProvider>
        </DietProvider>
      </DiaryProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { ready, session } = useAuth();

  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Palette.black },
      }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="meals" />
      <Stack.Screen name="meal/[type]" />
      <Stack.Screen name="food/[id]" />
      <Stack.Screen name="create-post" />
      <Stack.Screen name="create-group" />
      <Stack.Screen name="group/[id]" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="notification-settings" />
    </Stack>
  );
}