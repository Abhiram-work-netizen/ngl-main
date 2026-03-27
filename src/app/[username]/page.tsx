"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import DiceRandomizer from "@/components/DiceRandomizer";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PublicProfileClient({ params }: { params: { username: string } }) {
  const username = params.username;
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("Send me anonymous messages!");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fakeCount, setFakeCount] = useState(0);

  useEffect(() => {
    // Record view
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch(console.error);
    
    setFakeCount(Math.floor(Math.random() * 300) + 50);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#eb0f59] via-[#ff3b5c] to-[#ff7a00] flex flex-col items-center px-4 pt-12 pb-6 font-sans relative overflow-hidden">
      
      {/* Main White Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[340px] bg-white rounded-3xl shadow-xl overflow-hidden relative"
      >
        {/* Top User Info */}
        <div className="flex items-center gap-3 p-4 px-5">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-black font-bold text-[15px]">@{username}</span>
            <span className="text-black font-extrabold text-[15px] leading-tight">send me anonymous messages!</span>
          </div>
        </div>

        {/* Text Area inside Card */}
        <form onSubmit={handleSubmit} className="px-2 pb-2 relative">
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#ffa1b5] via-[#ff9b97] to-[#ffba7d] border border-black/5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={prompt}
              className="w-full bg-transparent text-white/90 placeholder:text-white/60 focus:outline-none p-5 resize-none min-h-[160px] font-bold text-2xl tracking-tight leading-tight"
              disabled={status === "loading" || status === "success"}
              maxLength={300}
            />
            {/* Dice Button positioned at bottom right */}
            <div className="absolute bottom-2 right-2 flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2 cursor-pointer border border-white/20">
               <DiceRandomizer currentPrompt={prompt} onPromptChange={setPrompt} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <div className="flex justify-center mt-3 h-10">
              <motion.button
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                disabled={!message.trim() || status === "loading"}
                type="submit"
                className={`w-full max-w-[200px] rounded-full text-white font-bold py-2 ${status === 'success' ? 'bg-green-500' : 'bg-black'} disabled:opacity-50 transition-transform hover:scale-105 active:scale-95`}
              >
                {status === "idle" && "Send!"}
                {status === "loading" && "Sending..."}
                {status === "success" && "Sent! ✓"}
                {status === "error" && "Error!"}
              </motion.button>
            </div>
          </AnimatePresence>
        </form>
      </motion.div>

      {/* Under Card Lock */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-white/90 font-medium">
        <Lock size={14} className="text-green-400 fill-green-400" />
        <span className="text-sm tracking-wide">anonymous q&a</span>
      </div>

      <div className="flex-1" />

      {/* Floating Bottom Items */}
      <div className="w-full max-w-[340px] flex flex-col items-center justify-end gap-6 z-10">
        <div className="font-bold text-white text-[15px]">
          👇 {fakeCount} friends just tapped the button 👇
        </div>

        <Link
          href="/login"
          className="w-full bg-black text-white rounded-full py-4 text-center font-bold items-center flex justify-center text-xl tracking-tight hover:scale-[1.02] active:scale-95 transition-transform"
        >
          Get your own messages!
        </Link>
        
        <div className="flex gap-4 text-white/70 font-semibold text-[13px]">
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
        </div>
      </div>
    </main>
  );
}
