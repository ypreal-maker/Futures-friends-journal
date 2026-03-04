"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'ypreal';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  username: string | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = username === ADMIN_USERNAME;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUsername(session?.user?.user_metadata?.username ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, password: string) => {
    if (!/^[a-zA-Z0-9_]{2,20}$/.test(username)) {
      return { error: '아이디는 영문, 숫자, 밑줄(_)만 2~20자 가능합니다.' };
    }

    // 중복 체크
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existing) {
      return { error: '이미 사용 중인 아이디입니다.' };
    }

    const fakeEmail = username.toLowerCase() + '@cinematic-journal.app';
    const { error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
      options: { data: { username } }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: '이미 사용 중인 아이디입니다.' };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signIn = async (username: string, password: string) => {
    const fakeEmail = username.toLowerCase() + '@cinematic-journal.app';
    const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password });
    if (error) return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    return { error: null };
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ user, session, username, isAdmin, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}