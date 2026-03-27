"use client";

import { useState } from "react";
import { Eye, Settings } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import PlayTab from "./PlayTab";
import SettingsTab from "./SettingsTab";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DashboardWrapper({ username, messages }: { username: string, messages: any[] }) {
  const [activeTab, setActiveTab] = useState<"PLAY" | "INBOX" | "SETTINGS">("INBOX");

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
                  onClick={() => alert("This button usually prompts a PRO subscription in NGL! Click individual messages to reveal.")} 
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
    </div>
  );
}
