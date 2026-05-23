import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BottomTabInset, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import type { AppIconName } from '@/types/icons';

function TabIcon({ name, focused }: { name: AppIconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      <SymbolView name={name} size={22} tintColor={focused ? Palette.green : Palette.textMuted} />
    </View>
  );
}

export default function TabLayout() {
  const { ready, session } = useAuth();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Palette.green} />
      </View>
    );
  }

  

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Palette.green,
        tabBarInactiveTintColor: Palette.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={{ ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diet-tools"
        options={{
          title: 'Diet Tools',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name={{ ios: 'leaf', android: 'eco', web: 'eco' }} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={{ ios: 'person.2', android: 'groups', web: 'groups' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name={{ ios: 'person.circle', android: 'account_circle', web: 'account_circle' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Palette.black, alignItems: 'center', justifyContent: 'center' },
  tabBar: {
    backgroundColor: Palette.card,
    borderTopColor: Palette.border,
    height: BottomTabInset,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 11, marginTop: 2 },
  iconWrap: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  iconActive: { backgroundColor: Palette.tabPill },
});
