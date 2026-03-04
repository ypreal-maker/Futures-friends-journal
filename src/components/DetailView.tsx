"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, MapPin, Calendar, Heart, MessageCircle, Send, Trash2, Camera } from "lucide-react";
import { supabase, type Comment, type Post } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface DetailViewProps {
  post: Post | null;
  onClose: () => void;
}

export default function DetailView({ post, onClose }: DetailViewProps) {
  const { user, username, isAdmin } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
      fetchLikesAndComments();
    } else {
      document.body.style.overflow = "";
      setLikesCount(0);
      setIsLiked(false);
      setComments([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [post, user]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const fetchLikesAndComments = async () => {
    if (!post) return;
    const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
    setLikesCount(count || 0);

    if (user) {
      const { data: userLike } = await supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", user.id).maybeSingle();
      setIsLiked(!!userLike);
    }

    const { data: commentsData } = await supabase.from("comments").select("*").eq("post_id", post.id).order("created_at", { ascending: true });
    if (commentsData) setComments(commentsData);
  };

  const toggleLike = async () => {
    if (!user || !post) return alert("로그인이 필요합니다.");
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    if (isLiked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !post || !newComment.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await supabase.from("comments").insert({
      post_id: post.id,
      user_id: user.id,
      username: username!,
      content: newComment.trim(),
    }).select().single();

    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment("");
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    await supabase.from("comments").delete().eq("id", commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  return (
    <AnimatePresence>
      {post && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/95 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            key="detail-content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto"
          >
            <div className="relative w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-12 items-start pt-20 pb-10 m-auto" onClick={(e) => e.stopPropagation()}>
              
              {/* 이미지 영역 (이미지가 없으면 카메라 아이콘 표시) */}
              <motion.div
                layoutId={`post-${post.id}`}
                className="relative w-full lg:w-[55%] flex-shrink-0 overflow-hidden rounded-2xl lg:sticky lg:top-8 aspect-[4/3] bg-gray-200 dark:bg-obsidian-200 flex items-center justify-center"
                transition={{ type: "spring", stiffness: 300, damping: 35, mass: 0.8 }}
              >
                {post.image_url ? (
                  <>
                    <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </>
                ) : (
                  <Camera className="w-16 h-16 text-black/10 dark:text-white/5" strokeWidth={1} />
                )}
              </motion.div>

              {/* 텍스트 & 소셜 영역 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[45%] flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gold/60" />
                    <span className="text-[10px] tracking-[0.4em] text-gold/80 uppercase font-mono">{post.category}</span>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-full glass hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-black/50 dark:text-white/50" />
                  </button>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-obsidian dark:text-white leading-tight">{post.title}</h2>
                <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-[1.9] font-light">{post.narrative}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/[0.06]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-black/40 dark:text-white/25">
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      <span className="text-xs font-mono tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    {post.location && (
                      <div className="flex items-center gap-2 text-black/40 dark:text-white/25">
                        <MapPin className="w-3 h-3" strokeWidth={1.5} />
                        <span className="text-xs font-mono tracking-widest">{post.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 좋아요 버튼 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-black/40 dark:text-white/40">{likesCount}</span>
                    <button onClick={toggleLike} className={`p-3 rounded-full transition-all duration-300 ${isLiked ? 'glass-gold' : 'glass hover:bg-black/5 dark:hover:bg-white/5'}`}>
                      <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'text-gold fill-gold' : 'text-black/40 dark:text-white/40'}`} strokeWidth={isLiked ? 0 : 1.5} />
                    </button>
                  </div>
                </div>

                {/* 댓글 섹션 */}
                <div className="mt-4 flex flex-col gap-4">
                  <h3 className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" /> Comments ({comments.length})
                  </h3>
                  
                  <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 rounded-xl glass-gold bg-black/5 dark:bg-black/20 group">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-gold-dark dark:text-gold/80">{comment.username}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-black/30 dark:text-white/20">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                            {(isAdmin || user?.id === comment.user_id) && (
                              <button onClick={() => handleDeleteComment(comment.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-black/70 dark:text-white/70 font-light leading-relaxed break-words">{comment.content}</p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-center text-xs text-black/30 dark:text-white/20 font-mono py-4">첫 번째 프레임의 기록을 남겨보세요.</p>
                    )}
                  </div>

                  {user ? (
                    <form onSubmit={handleCommentSubmit} className="relative mt-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="이 순간에 대해 이야기하기..."
                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-obsidian dark:text-white text-sm placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                      />
                      <button type="submit" disabled={isSubmitting || !newComment.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-black/40 dark:text-white/30 hover:text-gold transition-colors disabled:opacity-50">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="mt-2 p-4 rounded-xl border border-dashed border-black/10 dark:border-white/10 text-center">
                      <p className="text-xs text-black/40 dark:text-white/30 font-mono tracking-widest">댓글을 남기려면 로그인이 필요합니다.</p>
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
