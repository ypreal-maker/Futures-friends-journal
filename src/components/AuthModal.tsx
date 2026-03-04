"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError('아이디와 비밀번호를 입력해주세요.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    setLoading(true); setError(null); setSuccess(null);
    if (mode === 'signup') {
      const { error } = await signUp(username.trim(), password);
      if (error) { setError(error); } else {
        setSuccess('가입 완료! 이제 로그인하세요.');
        setMode('signin');
      }
    } else {
      const { error } = await signIn(username.trim(), password);
      if (error) { setError(error); } else { onClose(); }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="glass w-full max-w-md rounded-3xl p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-8">
                <Camera className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">Journal</span>
              </div>
              <h2 className="font-serif text-3xl text-white mb-2">
                {mode === 'signin' ? '로그인' : '회원가입'}
              </h2>
              <p className="text-white/30 text-sm mb-8 font-light">
                {mode === 'signin' ? '아이디와 비밀번호로 입장하세요.' : '아이디와 비밀번호를 설정하세요.'}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">아이디</label>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="username" autoComplete="username"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">비밀번호</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors pr-12" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-400/80 text-xs font-mono">{error}</p>}
                {success && <p className="text-green-400/80 text-xs font-mono">{success}</p>}
                <button type="submit" disabled={loading}
                  className="mt-2 bg-gold text-obsidian font-medium py-3 rounded-xl text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'signin' ? '로그인' : '가입하기'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setSuccess(null); }}
                  className="text-white/30 hover:text-white/60 text-xs font-mono tracking-wider transition-colors">
                  {mode === 'signin' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}