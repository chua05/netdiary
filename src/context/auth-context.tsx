import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadJson, saveJson } from '@/storage/async';
import { StorageKeys } from '@/storage/keys';
import type { AuthSession } from '@/types/user';
import type { UserProfile } from '@/types/user';

type StoredUser = UserProfile & { password: string };

type AuthContextValue = {
  ready: boolean;
  session: AuthSession | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function makeId() {
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      const auth = await loadJson<AuthSession | null>(StorageKeys.auth, null);
      if (auth) {
        const users = await loadJson<Record<string, StoredUser>>(StorageKeys.users, {});
        const user = users[auth.userId];
        if (user) {
          const { password: _, ...rest } = user;
          setSession(auth);
          setProfile(rest);
        }
      }
      setReady(true);
    })();
  }, []);

  const persistSession = useCallback(async (next: AuthSession | null, prof: UserProfile | null) => {
    setSession(next);
    setProfile(prof);
    if (next) await saveJson(StorageKeys.auth, next);
    else await AsyncStorageRemoveAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = await loadJson<Record<string, StoredUser>>(StorageKeys.users, {});
    const user = Object.values(users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) return false;
    const { password: _, ...prof } = user;
    const sess: AuthSession = { userId: user.id, email: user.email, username: user.username };
    await persistSession(sess, prof);
    return true;
  }, [persistSession]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    const users = await loadJson<Record<string, StoredUser>>(StorageKeys.users, {});
    if (Object.values(users).some((u) => u.email.toLowerCase() === email.toLowerCase())) return false;
    const id = makeId();
    const prof: StoredUser = {
      id,
      email,
      username,
      password,
      bio: '',
      calorieGoal: 2110,
      weightGoal: 70,
      currentWeight: 75,
      streak: 0,
    };
    users[id] = prof;
    await saveJson(StorageKeys.users, users);
    const sess: AuthSession = { userId: id, email, username };
    const { password: _, ...rest } = prof;
    await persistSession(sess, rest);
    return true;
  }, [persistSession]);

  const logout = useCallback(async () => {
    await persistSession(null, null);
  }, [persistSession]);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!session || !profile) return;
      const users = await loadJson<Record<string, StoredUser>>(StorageKeys.users, {});
      const existing = users[session.userId];
      if (!existing) return;
      const next = { ...existing, ...patch };
      users[session.userId] = next;
      await saveJson(StorageKeys.users, users);
      const { password: _, ...rest } = next;
      setProfile(rest);
    },
    [session, profile],
  );

  const value = useMemo(
    () => ({ ready, session, profile, login, register, logout, updateProfile }),
    [ready, session, profile, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

async function AsyncStorageRemoveAuth() {
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  await AsyncStorage.removeItem(StorageKeys.auth);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
