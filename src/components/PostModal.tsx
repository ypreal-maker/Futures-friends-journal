"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/photos';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: string;
}

export default function PostModal({ isOpen, onClose, onSuccess, defaultCategory }: PostModalProps) {
  const { user, username } = useAuth();
  const [title, setTitle] = useState('');
  const [narrative, setNarrative] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'Moments');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setTitle(''); setNarrative(''); setLocation(''); setError(null); };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !narrative.trim()) { setError('제목과 내용을 입력해주세요.'); return; }
    if (!user) { setError('로그인이 필요합니다.'); return; }
    setLoading(true); setError(null);

    const { error: insertErr } = await supabase.from('posts').insert({
      user_id: user.id,
      username: username!,
      title: title.trim(),
      narrative: narrative.trim(),
      category,
      location: location.trim() || null,
    });

    if (insertErr) {
      setError('저장 중 오류가 발생했습니다.');
    } else {
      reset();
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="post-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl" onClick={handleClose} />
          <motion.div key="post-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass w-full max-w-lg rounded-3xl p-8 relative my-auto" onClick={e => e.stopPropagation()}>
              <button onClick={handleClose}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">New Entry</span>
              </div>
              <h2 className="font-serif text-3xl text-white mb-6">새 프레임</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* 카테고리 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">카테고리</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all ${
                          category === cat ? 'bg-gold text-obsidian' : 'border border-white/10 text-white/40 hover:border-gold/40 hover:text-white/70'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {/* 제목 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">제목</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="이 순간의 이름..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                {/* 내용 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono">내러티브</label>
                  <textarea value={narrative} onChange={e => setNarrative(e.target.value)} rows={5}
                    placeholder="이 순간에 대한 이야기를 써주세요..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors resize-none leading-relaxed" />
                </div>
                {/* 위치 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-mono flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> 위치 <span className="text-white/15">(선택)</span>
                  </label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="서울, 대한민국"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                {error && (
                  <p className="text-red-400/80 text-xs font-mono bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="mt-1 bg-gold text-obsidian font-semibold py-3 rounded-xl text-xs tracking-[0.2em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? '저장 중...' : '프레임 저장'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}