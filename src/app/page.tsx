"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogIn, LogOut, User, MapPin, Trash2, Camera } from "lucide-react";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import AuthModal from "@/components/AuthModal";
import PostModal from "@/components/PostModal";
import DetailView from "@/components/DetailView";
import ThemeToggle from "@/components/ThemeToggle";
import CryptoWidget from "@/components/CryptoWidget";
import { categoryDescriptions, type Category } from "@/data/photos";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Post } from "@/lib/supabase";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 💡 onClick 프롭스를 추가해서 클릭되게 만듦
function PostCard({ post, onDelete, canDelete, onClick }: { post: Post; onDelete: (id: string) => void; canDelete: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer" onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-obsidian-200 aspect-[4/3]">
        {post.image_url ? (
          <>
            <Image src={post.image_url} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw,50vw" />
            <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-obsidian-200 dark:to-obsidian-300">
            <Camera className="w-12 h-12 text-black/10 dark:text-white/5" strokeWidth={1} />
          </div>
        )}
        <motion.div initial={false} animate={{ opacity: post.image_url ? hovered ? 1 : 0 : 1, y: post.image_url ? hovered ? 0 : 16 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn("absolute bottom-0 left-0 right-0 p-5", !post.image_url && "relative")}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-5 bg-gold/60" />
            <span className="text-[9px] tracking-[0.35em] text-gold-dark dark:text-gold/80 uppercase font-mono">{post.category}</span>
          </div>
          <h3 className="font-serif text-lg text-obsidian dark:text-white leading-tight mb-1">{post.title}</h3>
          {!post.image_url && <p className="text-black/50 dark:text-white/40 text-xs leading-relaxed line-clamp-3 mt-2 font-light">{post.narrative}</p>}
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col gap-1">
              {post.location && (
                <div className="flex items-center gap-1.5 text-black/40 dark:text-white/30">
                  <MapPin className="w-3 h-3" strokeWidth={1.5} />
                  <span className="text-[10px] font-mono">{post.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-black/40 dark:text-white/20">
                <User className="w-3 h-3" strokeWidth={1.5} />
                <span className="text-[10px] font-mono">{post.username}</span>
              </div>
            </div>
            {canDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-black/30 dark:text-white/20 hover:text-red-500 hover:bg-red-400/10 transition-all z-10 relative">
                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [authOpen, setAuthOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // 💡 상세 보기 모달 상태 추가
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { user, username, isAdmin, signOut } = useAuth();

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (activeCategory !== 'All') query = query.eq('category', activeCategory);
    const { data } = await query;
    setPosts(data || []);
    setLoadingPosts(false);
  }, [activeCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const canDelete = (post: Post) => isAdmin || (user?.id === post.user_id);

  return (
    // 💡 여기서 bg-obsidian을 지웠어! 이제 테마 스위치가 배경을 바꿀 거야.
    <main className="min-h-screen transition-colors duration-700">
      <FloatingNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        {user ? (
          <>
            <button onClick={() => setPostOpen(true)}
              className="flex items-center gap-2 px-4 py-2 glass-gold rounded-full text-xs font-mono tracking-widest uppercase text-gold hover:bg-gold/10 transition-all">
              <Plus className="w-4 h-4" /> 작성
            </button>
            <div className="flex items-center gap-2 px-3 py-2 glass rounded-full">
              <span className="text-[10px] font-mono text-black/50 dark:text-white/40 tracking-wider">{username}</span>
              {isAdmin && <span className="text-[9px] font-mono text-gold-dark dark:text-gold/60 tracking-widest">ADMIN</span>}
              <button onClick={signOut} className="text-black/40 dark:text-white/30 hover:text-black dark:hover:text-white/70 transition-colors ml-1">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setAuthOpen(true)}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-mono tracking-widest uppercase text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white/70 transition-all">
            <LogIn className="w-4 h-4" /> 로그인
          </button>
        )}
      </div>
      <HeroSection />
      <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-24">
        <div className="max-w-7xl mx-auto">
          {activeCategory !== "All" ? (
            <CategorySection category={activeCategory} description={categoryDescriptions[activeCategory]} count={posts.length} />
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold/40" />
                <span className="text-[9px] tracking-[0.4em] text-gold/60 uppercase font-mono">Complete Archive</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-obsidian dark:text-white/80 font-normal">
                All <span className="italic text-gradient">{posts.length}</span> frames
              </h2>
              <div className="mt-6 h-px bg-gradient-to-r from-black/10 dark:from-white/[0.08] via-gold/20 to-transparent" />
            </motion.div>
          )}
          {loadingPosts ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-1 h-8 bg-gold/40 animate-pulse rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-black/40 dark:text-white/20 text-sm font-mono tracking-widest">아직 게시글이 없습니다.</p>
              {user && (
                <button onClick={() => setPostOpen(true)} className="mt-6 text-gold/80 dark:text-gold/60 text-xs font-mono tracking-widest hover:text-gold transition-colors">
                  + 첫 번째 프레임 추가하기
                </button>
              )}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              <AnimatePresence mode="popLayout">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} onDelete={handleDelete} canDelete={canDelete(post)} onClick={() => setSelectedPost(post)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
      
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <PostModal isOpen={postOpen} onClose={() => setPostOpen(false)} onSuccess={fetchPosts} defaultCategory={activeCategory !== 'All' ? activeCategory : undefined} />
      <DetailView post={selectedPost} onClose={() => setSelectedPost(null)} />
      
      <CryptoWidget />
      <ThemeToggle />
    </main>
  );
}
