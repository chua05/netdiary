import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useAuth } from '@/context/auth-context';
import { useCommunity } from '@/context/community-context';
import { Palette } from '@/constants/theme';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { groups, toggleFavoriteGroup } = useCommunity();
  const group = groups.find((g) => g.id === id);

  if (!group) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Group" leftIcon="back" onLeft={() => router.back()} />
        <Text style={styles.missing}>Group not found.</Text>
      </SafeAreaView>
    );
  }

  const isFav = session ? group.favoriteBy.includes(session.userId) : false;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={group.name} leftIcon="back" onLeft={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.groupId}>Group ID: {group.groupId}</Text>
        <Pressable
          onPress={() => {
            toggleFavoriteGroup(group.id);
            Alert.alert(isFav ? 'Removed from favorites' : 'Added to favorites');
          }}>
          <Text style={styles.fav}>{isFav ? '★ Favorited' : '☆ Add to favorites'}</Text>
        </Pressable>
        <Text style={styles.desc}>{group.description || 'No description.'}</Text>
        <Text style={styles.section}>Members ({group.memberIds.length})</Text>
        <Text style={styles.members}>You and {group.memberIds.length - 1} other(s)</Text>
        <Pressable
          style={styles.share}
          onPress={() =>
            Alert.alert('Share Group ID', `Tell friends to join with ID: ${group.groupId}`)
          }>
          <Text style={styles.shareText}>Share Group ID</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  scroll: { padding: 24 },
  missing: { color: Palette.textMuted, textAlign: 'center', marginTop: 40 },
  groupId: { color: Palette.green, fontSize: 20, fontWeight: '800' },
  fav: { color: Palette.green, marginTop: 12, fontSize: 16 },
  desc: { color: Palette.textMuted, marginTop: 20, lineHeight: 22, fontSize: 15 },
  section: { color: Palette.text, fontWeight: '700', fontSize: 17, marginTop: 28 },
  members: { color: Palette.textMuted, marginTop: 8 },
  share: {
    marginTop: 32,
    backgroundColor: Palette.green,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  shareText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
