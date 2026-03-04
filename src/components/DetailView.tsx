"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Heart, MessageCircle, Send, Trash2, PenTool } from "lucide-react";
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
      setLikesCount(0); setIsLiked(false); setComments([]);
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
      post_id: post.id, user_id: user.id, username: username!, content: newComment.trim(),
    }).select().single();
    if (!error && data) { setComments(prev => [...prev, data]); setNewComment(""); }
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
            className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            key="detail-content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <motion.div 
              layoutId={`post-${post.id}`}
              className="relative w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl my-auto flex flex-col gap-8" 
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* 💡 헤더 영역 (카테고리 & 닫기 버튼) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gold/60" />
                  <span className="text-[10px] tracking-[0.4em] text-gold-dark dark:text-gold/80 uppercase font-mono">{post.category}</span>
                </div>
                {/* 💡 이상한 동그라미 없앤 깔끔한 닫기 버튼 */}
                <button onClick={onClose} className="p-2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 💡 본문 영역 */}
              <div>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-obsidian dark:text-white leading-tight mb-6">{post.title}</h2>
                <p className="text-black/60 dark:text-white/60 text-base md:text-lg leading-[2] font-light whitespace-pre-wrap">{post.narrative}</p>
              </div>
              
              {/* 💡 정보 및 좋아요 버튼 영역 */}
              <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-black/40 dark:text-white/30">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="text-xs font-mono tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  {post.location && (
                    <div className="flex items-center gap-2 text-black/40 dark:text-white/30">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span className="text-xs font-mono tracking-widest">{post.location}</span>
                    </div>
                  )}
                </div>
                
                {/* 💡 이상한 동그라미 없앤 깔끔한 하트 버튼 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-black/40 dark:text-white/40">{likesCount}</span>
                  <button onClick={toggleLike} className="p-2 transition-transform active:scale-90">
                    <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-gold fill-gold' : 'text-black/20 dark:text-white/20 hover:text-red-400 dark:hover:text-red-400'}`} strokeWidth={isLiked ? 0 : 1.5} />
                  </button>
                </div>
              </div>

              {/* 💡 댓글 섹션 */}
              <div className="flex flex-col gap-4 bg-black/[0.02] dark:bg-white/[0.02] -mx-8 -mb-8 p-8 md:px-12 rounded-b-[2rem]">
                <h3 className="text-[10px] tracking-[0.3em] text-black/40 dark:text-white/30 uppercase font-mono flex items-center gap-2">
                  <MessageCircle className="w-3 h-3" /> Comments ({comments.length})
                </h3>
                
                <div className="flex flex-col gap-4 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {comments.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gold-dark dark:text-gold/80 font-semibold">{comment.username}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-black/30 dark:text-white/20">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          {(isAdmin || user?.id === comment.user_id) && (
                            <button onClick={() => handleDeleteComment(comment.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-500 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-black/70 dark:text-white/70 font-light leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-xs text-black/30 dark:text-white/20 font-mono py-6">첫 번째 기록을 남겨보세요.</p>
                  )}
                </div>

                {user ? (
                  <form onSubmit={handleCommentSubmit} className="relative mt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="이 기록에 대해 이야기하기..."
                      className="w-full bg-white dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-obsidian dark:text-white text-sm placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors shadow-sm"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
