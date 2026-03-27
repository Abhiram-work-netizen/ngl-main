/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageCardProps {
  id: string;
  message: string;
  createdAt: string;
  revealed: boolean;
  senderUsername?: string;
  senderPic?: string;
}

export default function MessageCard({ id, message, createdAt, revealed, senderUsername, senderPic }: MessageCardProps) {
  const [isRevealed, setIsRevealed] = useState(revealed);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedData, setRevealedData] = useState<{username?: string, pic?: string}>({
    username: senderUsername,
    pic: senderPic
  });

  const handleReveal = async () => {
    if (isRevealed) return;
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: id })
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsRevealed(true);
        setRevealedData({ username: data.senderUsername, pic: data.senderPic });
      } else {
        alert(data.error || "Failed to reveal");
      }
    } catch {
      alert("Error revealing message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
      
      <p className="text-lg font-medium text-white leading-relaxed">
        {message}
      </p>
      
      <div className="flex justify-between items-end mt-2">
        <span className="text-xs text-white/50">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
        
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.button
              key="reveal-btn"
              exit={{ opacity: 0 }}
              onClick={handleReveal}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm font-medium disabled:opacity-50"
            >
              <Lock size={14} />
              {isLoading ? "Revealing..." : "Who sent this?"}
            </motion.button>
          ) : (
            <motion.div
              key="revealed-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full"
            >
              {revealedData.pic ? (
                <img src={revealedData.pic} alt="Sender" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center">
                  <Unlock size={12} className="text-white" />
                </div>
              )}
              <span className="text-sm font-semibold">{revealedData.username || 'Anonymous'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
