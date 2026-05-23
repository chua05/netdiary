import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { GroupCardMenu, GroupMenuButton, type GroupMenuAction } from '@/components/group-card-menu';
import { ScreenHeader } from '@/components/screen-header';
import { SubTabs } from '@/components/sub-tabs';
import { Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useCommunity } from '@/context/community-context';
import type { Group, Post } from '@/types/community';

type Tab = 'home' | 'groups' | 'favorites';

export default function CommunityScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const {
    posts,
    myGroups,
    favoriteGroups,
    toggleLike,
    addComment,
    joinGroup,
    toggleFavoriteGroup,
    deleteGroup,
    leaveGroup,
  } = useCommunity();
  const [tab, setTab] = useState<Tab>('home');
  const [menuGroup, setMenuGroup] = useState<Group | null>(null);
  const [menuContext, setMenuContext] = useState<'groups' | 'favorites'>('groups');
  const [joinId, setJoinId] = useState('');
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

    const onJoin = () => {
    if (!joinId.trim()) return;
    const ok = joinGroup(joinId.trim());
    if (ok) {
      Alert.alert('Joined!', `You joined group ${joinId.toUpperCase()}`);
      setJoinId('');
    } else Alert.alert('Not found', 'Invalid Group ID or already a member.');
  };

  const openGroupMenu = (g: Group, context: 'groups' | 'favorites') => {
    setMenuGroup(g);
    setMenuContext(context);
  };

  const confirmDeleteGroup = (g: Group) => {
    Alert.alert('Delete group?', `Permanently delete "${g.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (deleteGroup(g.id)) {
            setMenuGroup(null);
            Alert.alert('Success', 'Group deleted.');
          } else {
            Alert.alert('Error', 'Only the group creator can delete this group.');
          }
        },
      },
    ]);
  };

  const confirmLeaveGroup = (g: Group) => {
    Alert.alert('Leave group?', `Leave "${g.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => {
          if (leaveGroup(g.id)) {
            setMenuGroup(null);
            Alert.alert('Success', 'You left the group.');
          } else {
            Alert.alert('Error', 'Could not leave this group.');
          }
        },
      },
    ]);
  };

  const buildMenuActions = (g: Group, context: 'groups' | 'favorites'): GroupMenuAction[] => {
    const isCreator = session?.userId === g.creatorId;
    const isFav = g.favoriteBy.includes(session?.userId ?? '');
    const actions: GroupMenuAction[] = [];

    if (context === 'favorites' && isFav) {
      actions.push({
        label: 'Remove from favorites',
        onPress: () => {
          toggleFavoriteGroup(g.id);
          setMenuGroup(null);
        },
      });
    }

    if (context === 'groups') {
      if (isCreator) {
        actions.push({
          label: 'Delete group',
          destructive: true,
          onPress: () => confirmDeleteGroup(g),
        });
      } else {
        actions.push({
          label: 'Leave group',
          destructive: true,
          onPress: () => confirmLeaveGroup(g),
        });
      }
    } else if (context === 'favorites' && isCreator) {
      actions.push({
        label: 'Delete group',
        destructive: true,
        onPress: () => confirmDeleteGroup(g),
      });
    }

    return actions;
  };

    const renderPost = ({ item }: { item: Post }) => {
    const liked = session ? item.likes.includes(session.userId) : false;
    return (
      <View style={styles.post}>
        <Text style={styles.postUser}>{item.username}</Text>
        <Text style={styles.postType}>{item.type}</Text>
        <Text style={styles.postText}>{item.text}</Text>
        <View style={styles.postActions}>
          <Pressable style={styles.action} onPress={() => toggleLike(item.id)}>
            <SymbolView
              name={{ ios: liked ? 'heart.fill' : 'heart', android: 'favorite', web: 'favorite' }}
              size={18}
              tintColor={liked ? Palette.red : Palette.textMuted}
            />
            <Text style={styles.actionText}>{item.likes.length}</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={() => setCommentPostId(item.id)}>
            <SymbolView
              name={{ ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' }}
              size={18}
              tintColor={Palette.textMuted}
            />
            <Text style={styles.actionText}>{item.comments.length}</Text>
          </Pressable>
        </View>
        {item.comments.map((c) => (
          <Text key={c.id} style={styles.comment}>
            <Text style={styles.commentUser}>{c.username}: </Text>
            {c.text}
          </Text>
        ))}
        {commentPostId === item.id && (
          <View style={styles.commentBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor={Palette.textDim}
              value={commentText}
              onChangeText={setCommentText}
            />
            <Pressable
              onPress={() => {
                addComment(item.id, commentText);
                setCommentText('');
                setCommentPostId(null);
              }}>
              <Text style={styles.send}>Send</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };


   const renderGroup = (g: Group, context: 'groups' | 'favorites') => (
    <View key={g.id} style={styles.groupCard}>
      <View style={styles.groupTop}>
        <Pressable
          style={styles.groupTitlePress}
          onPress={() => router.push({ pathname: '/group/[id]', params: { id: g.id } })}>
          <Text style={styles.groupName} numberOfLines={1}>
            {g.name}
          </Text>
        </Pressable>
        <View style={styles.groupActions}>
          <Pressable onPress={() => toggleFavoriteGroup(g.id)} hitSlop={8}>
            <SymbolView
              name={{
                ios: g.favoriteBy.includes(session?.userId ?? '') ? 'star.fill' : 'star',
                android: 'star',
                web: 'star',
              }}
              size={20}
              tintColor={Palette.green}
            />
          </Pressable>
          <GroupMenuButton onPress={() => openGroupMenu(g, context)} />
        </View>
      </View>
      <Pressable onPress={() => router.push({ pathname: '/group/[id]', params: { id: g.id } })}>
        <Text style={styles.groupId}>ID: {g.groupId}</Text>
        <Text style={styles.groupDesc} numberOfLines={2}>
          {g.description}
        </Text>
        <Text style={styles.groupMembers}>{g.memberIds.length} members</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Community" />
      <SubTabs
        tabs={[
          { key: 'home', label: 'Home' },
          { key: 'groups', label: 'Groups' },
          { key: 'favorites', label: 'Favorites' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'home' && (
        <>
          <Pressable style={styles.createBtn} onPress={() => router.push('/create-post')}>
            <Text style={styles.createBtnText}>+ Create Post</Text>
          </Pressable>
          <FlatList
            data={posts}
            keyExtractor={(p) => p.id}
            renderItem={renderPost}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No posts yet. Be the first!" />}
          />
        </>
      )}
      {tab === 'groups' && (
        <FlatList
          data={myGroups}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.joinBox}>
              <Text style={styles.joinLabel}>Join with Group ID</Text>
              <View style={styles.joinRow}>
                <TextInput
                  style={styles.joinInput}
                  placeholder="ABC123"
                  placeholderTextColor={Palette.textDim}
                  value={joinId}
                  onChangeText={setJoinId}
                  autoCapitalize="characters"
                />
                <Pressable style={styles.joinBtn} onPress={onJoin}>
                  <Text style={styles.joinBtnText}>Join</Text>
                </Pressable>
              </View>
              <Pressable style={styles.createBtn} onPress={() => router.push('/create-group')}>
                <Text style={styles.createBtnText}>+ Create Group</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => renderGroup(item, 'groups')}
          ListEmptyComponent={<EmptyState message="No groups yet. Create or join one!" />}
        />
      )}
      {tab === 'favorites' && (
        <FlatList
          data={favoriteGroups}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => renderGroup(item, 'favorites')}
          ListEmptyComponent={<EmptyState message="Star groups to see them here." />}
        />
      )}
      <GroupCardMenu
        visible={menuGroup !== null}
        onClose={() => setMenuGroup(null)}
        actions={menuGroup ? buildMenuActions(menuGroup, menuContext) : []}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.black },
  list: { padding: 16, paddingBottom: 100 },
  createBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Palette.accentMuted,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  createBtnText: { color: Palette.green, fontWeight: '700', fontSize: 16 },
  post: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postUser: { color: Palette.green, fontWeight: '700', fontSize: 15 },
  postType: { color: Palette.textDim, fontSize: 11, textTransform: 'uppercase', marginTop: 2 },
  postText: { color: Palette.text, fontSize: 15, marginTop: 8, lineHeight: 22 },
  postActions: { flexDirection: 'row', gap: 20, marginTop: 12 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: Palette.textMuted },
  comment: { color: Palette.textMuted, fontSize: 13, marginTop: 8 },
  commentUser: { color: Palette.text, fontWeight: '600' },
  commentBox: { flexDirection: 'row', marginTop: 8, gap: 8 },
  commentInput: {
    flex: 1,
    backgroundColor: Palette.black,
    borderRadius: 8,
    padding: 10,
    color: Palette.text,
  },
  send: { color: Palette.green, alignSelf: 'center', fontWeight: '600' },
  joinBox: { marginBottom: 8 },
  joinLabel: { color: Palette.textMuted, marginBottom: 8 },
  joinRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  joinInput: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: 10,
    padding: 12,
    color: Palette.text,
    fontSize: 16,
  },
  joinBtn: {
    backgroundColor: Palette.green,
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  joinBtnText: { color: '#fff', fontWeight: '700' },
  groupCard: {
    backgroundColor: Palette.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  groupTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  groupTitlePress: { flex: 1 },
  groupName: { color: Palette.text, fontSize: 17, fontWeight: '700' },
  groupActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  groupId: { color: Palette.green, fontSize: 13, marginTop: 4, fontWeight: '600' },
  groupDesc: { color: Palette.textMuted, marginTop: 8, fontSize: 14 },
  groupMembers: { color: Palette.textDim, fontSize: 12, marginTop: 8 },
});