"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, PenTool } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !narrative.trim()) { setError('제목과 내용을 입력해주세요.'); return; }
    if (!user) { setError('로그인이 필요합니다.'); return; }
    setLoading(true); setError(null);
    try {
      const { error: insertErr } = await supabase.from('posts').insert({
        user_id: user.id, username: username!, title: title.trim(),
        narrative: narrative.trim(), category, location: location.trim() || null,
        image_url: null, // 사진 저장 로직 완전 제거
      });
      if (insertErr) throw new Error(insertErr.message);
      setTitle(''); setNarrative(''); setLocation('');
      onSuccess(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/40 dark:bg-black/80 backdrop-blur-xl" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-xl rounded-3xl p-8 border border-black/5 dark:border-white/10 relative my-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={onClose} className="absolute top-6 right-6 text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <PenTool className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <span className="text-xs font-mono tracking-[0.3em] text-black/40 dark:text-white/40 uppercase">New Entry</span>
              </div>
              <h2 className="font-serif text-3xl text-obsidian dark:text-white mb-6">글쓰기</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono">카테고리</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all ${
                          category === cat ? 'bg-gold text-obsidian' : 'border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 hover:border-gold/40'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono">제목</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="이 순간의 이름..."
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-obsidian dark:text-white text-sm focus:outline-none focus:border-gold/40 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono">내러티브</label>
                  <textarea value={narrative} onChange={e => setNarrative(e.target.value)} rows={6}
                    placeholder="이 순간에 대한 이야기를 써주세요..."
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-obsidian dark:text-white text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> 위치 (선택)
                  </label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="서울, 대한민국"
                    className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-obsidian dark:text-white text-sm focus:outline-none focus:border-gold/40 transition-colors" />
                </div>
                {error && <p className="text-red-500/80 text-xs font-mono">{error}</p>}
                <button type="submit" disabled={loading}
                  className="mt-4 bg-gold text-obsidian font-medium py-3 rounded-xl text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? '저장 중...' : '기록하기'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
