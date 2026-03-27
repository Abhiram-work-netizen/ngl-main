"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, Settings, Crown, CheckCircle2 } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import PlayTab from "./PlayTab";
import SettingsTab from "./SettingsTab";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardWrapper({ username, messages }: { username: string, messages: any[] }) {
  const [activeTab, setActiveTab] = useState<"PLAY" | "INBOX" | "SETTINGS">("INBOX");
  const [showProModal, setShowProModal] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#0a0b10] flex flex-col font-sans">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0a0b10] border-b border-white/5 px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/50 cursor-pointer">
          <Eye size={20} />
        </div>

        <div className="flex items-center gap-6 font-extrabold text-[15px] tracking-wide relative top-1">
          <button 
            className={`transition-colors uppercase ${activeTab === 'PLAY' ? 'text-white' : 'text-[#39405d]'}`}
            onClick={() => setActiveTab('PLAY')}
          >
            Play
          </button>
          <button 
            className={`transition-colors uppercase ${activeTab === 'INBOX' ? 'text-white' : 'text-[#39405d]'}`}
            onClick={() => setActiveTab('INBOX')}
          >
            Inbox
          </button>
        </div>

        <div 
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/50 cursor-pointer"
          onClick={() => setActiveTab('SETTINGS')}
        >
          <Settings size={20} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative pb-24">
        {activeTab === "INBOX" && (
          <div className="flex flex-col">
            {messages.length === 0 ? (
              <div className="text-center text-white/40 mt-20 px-8">
                <p className="text-lg font-bold">No messages yet!</p>
                <p className="text-sm">Share your link to get some.</p>
              </div>
            ) : (
              messages.map(msg => <MessageCard key={msg.id} message={msg} />)
            )}
            
            {/* Sticky "Who sent these? 👀" Bottom Button floating over list */}
            {messages.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0b10] to-transparent pt-12">
                <button
                  onClick={() => setShowProModal(true)} 
                  className="w-full bg-[#ff3b5c] text-white font-bold text-lg py-4 rounded-full shadow-[0_4px_20px_rgba(255,59,92,0.4)] hover:scale-[1.02] active:scale-95 transition-transform outline-none"
                >
                  Who sent these? 👀
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "PLAY" && (
          <PlayTab username={username} />
        )}

        {activeTab === "SETTINGS" && (
          <SettingsTab />
        )}
      </main>

      {/* PRO Modal */}
      <AnimatePresence>
        {showProModal && (
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
              className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-full max-w-[340px] rounded-3xl p-1 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowProModal(false)}
                className="absolute -top-12 right-0 text-white p-2 text-xl font-bold"
              >
                ✕ Close
              </button>

              <div className="bg-[#11131c] rounded-[1.4rem] p-6 min-h-[300px] flex flex-col items-center pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                  <Crown size={32} className="text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">NGL Pro</h2>
                <p className="text-white/60 mb-8 font-medium">Unlock exclusive clues to see who sent you messages!</p>

                <div className="w-full space-y-3 mb-8">
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-500" />
                    <span className="text-white font-medium text-sm">See device type & location</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-500" />
                    <span className="text-white font-medium text-sm">Get exact timestamps</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-yellow-500" />
                    <span className="text-white font-medium text-sm">Ad-free experience</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert("This is a dummy application. Payment gateway not integrated!");
                    setShowProModal(false);
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-[17px] py-4 rounded-full hover:opacity-90 active:scale-95 transition-all outline-none"
                >
                  Unlock for $9.99/week
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

