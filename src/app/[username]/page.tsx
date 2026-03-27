"use client";

import { useEffect, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import DiceRandomizer from "@/components/DiceRandomizer";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicProfileClient({ params }: { params: { username: string } }) {
  const username = params.username;
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("Send me anonymous messages!");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Record view
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }).catch(console.error);
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
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/20 blur-3xl -z-10 rounded-full opacity-50 block md:hidden" />
      <div className="absolute inset-0 bg-gradient-radial from-pink-500/10 to-transparent opacity-30 blur-2xl -z-10 hidden md:block" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md bg-gradient-to-b from-pink-500 to-orange-500 rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden"
      >
        {/* Card Content Bubble */}
        <div className="bg-black/80 backdrop-blur-xl rounded-[2.4rem] p-6 relative z-10 h-full w-full flex flex-col items-center">
          
          <div className="bg-gradient-to-tr from-pink-500 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-black">
            <span className="text-4xl">🤫</span>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-white">@{username}</h1>
          <p className="text-white/60 mb-6 font-medium tracking-wide">
            {prompt}
          </p>

          <form onSubmit={handleSubmit} className="w-full relative">
            <div className="relative group">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your secret here..."
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border-0 rounded-3xl p-5 pb-16 text-white placeholder:text-white/40 focus:ring-0 resize-none min-h-[160px] transition-all"
                disabled={status === "loading" || status === "success"}
                maxLength={300}
              />
              <div className="absolute bottom-4 right-4 text-xs font-semibold text-white/30 truncate pointer-events-none">
                {message.length}/300
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <DiceRandomizer currentPrompt={prompt} onPromptChange={setPrompt} />
              
              <AnimatePresence mode="wait">
                <motion.button
                  key={status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  disabled={!message.trim() || status === "loading"}
                  type="submit"
                  className="bg-white text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 disabled:opacity-50 hover:scale-[1.03] transition-transform"
                >
                  {status === "idle" && (
                    <>
                      Send <Send size={18} />
                    </>
                  )}
                  {status === "loading" && "Sending..."}
                  {status === "success" && (
                    <>
                      Sent! <CheckCircle2 size={18} className="text-green-500" />
                    </>
                  )}
                  {status === "error" && "Failed!"}
                </motion.button>
              </AnimatePresence>
            </div>
          </form>
        </div>
      </motion.div>

      <div className="mt-8">
        <p className="text-white/40 text-sm font-semibold tracking-wide">
          100% Anonymous🔒
        </p>
      </div>
    </main>
  );
}
