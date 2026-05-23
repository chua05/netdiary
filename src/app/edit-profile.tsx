import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { TextField } from '@/components/text-field';
import { useAuth } from '@/context/auth-context';
import { Palette } from '@/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [weightGoal, setWeightGoal] = useState(String(profile?.weightGoal ?? ''));
  const [currentWeight, setCurrentWeight] = useState(String(profile?.currentWeight ?? ''));
  const [calorieGoal, setCalorieGoal] = useState(String(profile?.calorieGoal ?? ''));

  const onSave = async () => {
    await updateProfile({
      username: username.trim(),
      bio: bio.trim(),
      weightGoal: Number(weightGoal) || profile?.weightGoal,
      currentWeight: Number(currentWeight) || profile?.currentWeight,
      calorieGoal: Number(calorieGoal) || profile?.calorieGoal,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Edit Profile" leftIcon="back" onLeft={() => router.back()} />
      <TextField label="Username" value={username} onChangeText={setUsername} />
      <TextField label="Bio" value={bio} onChangeText={setBio} />
      <TextField label="Weight goal (kg)" value={weightGoal} onChangeText={setWeightGoal} keyboardType="numeric" />
      <TextField label="Current weight (kg)" value={currentWeight} onChangeText={setCurrentWeight} keyboardType="numeric" />
      <TextField label="Calorie goal" value={calorieGoal} onChangeText={setCalorieGoal} keyboardType="numeric" />
      <PrimaryButton label="Save" onPress={onSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: 16 },
});
