import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHeader } from '@/components/screen-header';
import { TextField } from '@/components/text-field';
import { useCommunity } from '@/context/community-context';
import { Palette } from '@/constants/theme';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { createGroup } = useCommunity();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onCreate = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter a group name.');
      return;
    }
    const group = createGroup(name.trim(), description.trim());
    Alert.alert('Group created', `Share Group ID: ${group.groupId}`, [
      { text: 'OK', onPress: () => router.replace({ pathname: '/group/[id]', params: { id: group.id } }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Create Group" leftIcon="back" onLeft={() => router.back()} />
      <Text style={styles.hint}>Members can join using the Group ID you receive after creation.</Text>
      <TextField label="Group name" value={name} onChangeText={setName} placeholder="e.g. Keto Buddies" />
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What is this group about?"
      />
      <PrimaryButton label="Create Group" onPress={onCreate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black, padding: 16 },
  hint: { color: Palette.textMuted, marginBottom: 16, lineHeight: 20 },
});
