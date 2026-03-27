/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MessageCard({ message }: { message: any }) {
  const [revealed, setRevealed] = useState(message.revealed);
  const [sender, setSender] = useState(message.sender);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReveal = async () => {
    if (revealed || loading) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setSender(data.sender);
        setRevealed(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* List Row Item */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-4 p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="relative">
          <div className="w-12 h-12 bg-[#2a2d39] rounded-full flex items-center justify-center">
            {/* We pretend MailHeart is the pink envelope with heart */}
            <span className="text-2xl">💌</span>
          </div>
          {revealed && (
            <div className="absolute -top-1 -right-1 bg-white rounded-full">
              <CheckCircle2 size={18} className="text-green-500 fill-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className="text-white font-bold text-[15px] truncate mb-0.5">
            {message.message}
          </p>
          <p className="text-white/40 text-[13px] font-medium">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>
        </div>

        <ChevronRight size={20} className="text-white/40 shrink-0" />
      </div>

      {/* Modal View for the Message Details */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#eb0f59] via-[#ff3b5c] to-[#ff7a00] w-full max-w-[340px] rounded-3xl p-1 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 text-white p-2 text-xl font-bold"
              >
                ✕ Close
              </button>

              <div className="bg-[#11131c] rounded-[1.4rem] p-6 min-h-[300px] flex flex-col pt-10">
                <div className="flex-1 text-center">
                  <p className="text-xl font-bold text-white mb-8 break-words leading-relaxed">
                    {message.message}
                  </p>
                  
                  {revealed && sender && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 mb-3">
                        <img 
                          src={sender.profile_pic || `https://api.dicebear.com/7.x/notionists/svg?seed=${sender.username}`} 
                          alt="avatar" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <p className="text-white font-bold text-lg">@{sender.username}</p>
                      <p className="text-white/50 text-sm">Sent this message</p>
                    </div>
                  )}

                  {revealed && !sender && (
                    <div className="text-white/50 text-sm mt-8 border border-white/10 bg-white/5 p-4 rounded-xl">
                      This user was not logged in.
                    </div>
                  )}
                </div>

                {!revealed && (
                  <button
                    onClick={handleReveal}
                    disabled={loading}
                    className="w-full bg-[#ff3b5c] text-white font-bold text-[17px] py-4 rounded-full mt-4 hover:bg-[#ff0033] active:scale-95 transition-all outline-none"
                  >
                    {loading ? "Unlocking..." : "Who sent this? 👀"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
