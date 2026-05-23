import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useDiary } from '@/context/diary-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, logout } = useAuth();
  const { calorieBudget, totals } = useDiary();

  const onLogout = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
        await logout();
        router.replace('/(auth)/welcome');
      },
      },
    ]);
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.username.slice(0, 2).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{profile.streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{totals.calories}</Text>
            <Text style={styles.statLabel}>Today cal</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{calorieBudget}</Text>
            <Text style={styles.statLabel}>Budget</Text>
          </View>
        </View>

        <Pressable style={styles.row} onPress={() => router.push('/edit-profile')}>
          <Text style={styles.rowText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push('/notification-settings')}>
          <Text style={styles.rowText}>Notification Settings</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push('/modals/reminder-settings')}>
          <Text style={styles.rowText}>Reminder Times</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => router.push('/modals/progress-chart')}>
          <Text style={styles.rowText}>Progress Chart</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <View style={styles.goals}>
          <Text style={styles.goalsTitle}>Goals</Text>
          <Text style={styles.goalLine}>Weight goal: {profile.weightGoal} kg</Text>
          <Text style={styles.goalLine}>Current: {profile.currentWeight} kg</Text>
          <Text style={styles.goalLine}>Calorie goal: {profile.calorieGoal} cal</Text>
        </View>

        <PrimaryButton label="Sign Out" onPress={onLogout} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  scroll: { padding: 24, paddingBottom: 40 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.accentMuted,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Palette.green, fontSize: 28, fontWeight: '800' },
  name: { color: Palette.text, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  email: { color: Palette.textMuted, textAlign: 'center', marginTop: 4 },
  bio: { color: Palette.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  stats: { flexDirection: 'row', marginTop: 24, gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statVal: { color: Palette.green, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Palette.textMuted, fontSize: 11, marginTop: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  rowText: { color: Palette.text, fontSize: 16 },
  chevron: { color: Palette.textMuted, fontSize: 22 },
  goals: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  goalsTitle: { color: Palette.text, fontWeight: '700', fontSize: 17, marginBottom: 12 },
  goalLine: { color: Palette.textMuted, marginBottom: 6 },
});
