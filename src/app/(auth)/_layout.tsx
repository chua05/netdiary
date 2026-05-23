import { Stack } from 'expo-router';
import React from 'react';

import { Palette } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Palette.black },
        animation: 'fade',
      }}
    />
  );
}
