import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/context/auth-context';
import { loadJson, saveJson } from '@/storage/async';
import { StorageKeys } from '@/storage/keys';
import type { Comment, Group, Post } from '@/types/community';

type CommunityContextValue = {
  ready: boolean;
  posts: Post[];
  groups: Group[];
  createPost: (text: string, type?: Post['type']) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createGroup: (name: string, description: string) => Group;
  joinGroup: (groupId: string) => boolean;
  toggleFavoriteGroup: (groupId: string) => void;
  deleteGroup: (groupId: string) => boolean;
  leaveGroup: (groupId: string) => boolean;
  myGroups: Group[];
  favoriteGroups: Group[];
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

const SEED_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'seed',
    username: 'Claireh79',
    text: 'Down 1.4lb this week. Staying consistent with logging!',
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'progress',
  },
];

function generateGroupId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    (async () => {
      const [p, g] = await Promise.all([
        loadJson<Post[]>(StorageKeys.posts, SEED_POSTS),
        loadJson<Group[]>(StorageKeys.groups, []),
      ]);
      setPosts(p);
      setGroups(g);
      setReady(true);
    })();
  }, []);

  const persistPosts = useCallback((next: Post[]) => {
    setPosts(next);
    saveJson(StorageKeys.posts, next);
  }, []);

  const persistGroups = useCallback((next: Group[]) => {
    setGroups(next);
    saveJson(StorageKeys.groups, next);
  }, []);

  const createPost = useCallback(
    (text: string, type: Post['type'] = 'text') => {
      if (!session) return;
      const post: Post = {
        id: `post-${Date.now()}`,
        userId: session.userId,
        username: session.username,
        text,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        type,
      };
      persistPosts([post, ...posts]);
    },
    [session, posts, persistPosts],
  );

  const toggleLike = useCallback(
    (postId: string) => {
      if (!session) return;
      persistPosts(
        posts.map((p) => {
          if (p.id !== postId) return p;
          const liked = p.likes.includes(session.userId);
          return {
            ...p,
            likes: liked ? p.likes.filter((id) => id !== session.userId) : [...p.likes, session.userId],
          };
        }),
      );
    },
    [session, posts, persistPosts],
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      if (!session || !text.trim()) return;
      const comment: Comment = {
        id: `c-${Date.now()}`,
        userId: session.userId,
        username: session.username,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      persistPosts(
        posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
      );
    },
    [session, posts, persistPosts],
  );

  const createGroup = useCallback(
    (name: string, description: string) => {
      if (!session) throw new Error('Not signed in');
      const group: Group = {
        id: `g-${Date.now()}`,
        groupId: generateGroupId(),
        name,
        description,
        creatorId: session.userId,
        memberIds: [session.userId],
        favoriteBy: [],
        createdAt: new Date().toISOString(),
      };
      persistGroups([group, ...groups]);
      return group;
    },
    [session, groups, persistGroups],
  );

  const joinGroup = useCallback(
    (groupId: string) => {
      if (!session) return false;
      const target = groups.find((g) => g.groupId.toUpperCase() === groupId.toUpperCase());
      if (!target || target.memberIds.includes(session.userId)) return false;
      persistGroups(
        groups.map((g) =>
          g.id === target.id ? { ...g, memberIds: [...g.memberIds, session.userId] } : g,
        ),
      );
      return true;
    },
    [session, groups, persistGroups],
  );

  const toggleFavoriteGroup = useCallback(
    (groupId: string) => {
      if (!session) return;
      persistGroups(
        groups.map((g) => {
          if (g.id !== groupId) return g;
          const fav = g.favoriteBy.includes(session.userId);
          return {
            ...g,
            favoriteBy: fav
              ? g.favoriteBy.filter((id) => id !== session.userId)
              : [...g.favoriteBy, session.userId],
          };
        }),
      );
    },
    [session, groups, persistGroups],
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      if (!session) return false;
      const target = groups.find((g) => g.id === groupId);
      if (!target || target.creatorId !== session.userId) return false;
      persistGroups(groups.filter((g) => g.id !== groupId));
      return true;
    },
    [session, groups, persistGroups],
  );

  const leaveGroup = useCallback(
    (groupId: string) => {
      if (!session) return false;
      const target = groups.find((g) => g.id === groupId);
      if (!target || !target.memberIds.includes(session.userId)) return false;
      if (target.creatorId === session.userId) return false;
      persistGroups(
        groups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                memberIds: g.memberIds.filter((id) => id !== session.userId),
                favoriteBy: g.favoriteBy.filter((id) => id !== session.userId),
              }
            : g,
        ),
      );
      return true;
    },
    [session, groups, persistGroups],
  );

  const myGroups = useMemo(
    () => (session ? groups.filter((g) => g.memberIds.includes(session.userId)) : []),
    [groups, session],
  );

  const favoriteGroups = useMemo(
    () => (session ? groups.filter((g) => g.favoriteBy.includes(session.userId)) : []),
    [groups, session],
  );

  const value = useMemo(
    () => ({
      ready,
      posts,
      groups,
      createPost,
      toggleLike,
      addComment,
      createGroup,
      joinGroup,
      toggleFavoriteGroup,
      deleteGroup,
      leaveGroup,
      myGroups,
      favoriteGroups,
    }),
    [
      ready,
      posts,
      groups,
      createPost,
      toggleLike,
      addComment,
      createGroup,
      joinGroup,
      toggleFavoriteGroup,
      deleteGroup,
      leaveGroup,
      myGroups,
      favoriteGroups,
    ],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
