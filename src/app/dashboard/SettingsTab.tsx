"use client";

import { Bell, Heart, Crown, Paintbrush, FileText, Delete, ChevronRight, ShieldAlert, Ban, PauseCircle, Settings as SettingsIcon } from "lucide-react";

export default function SettingsTab() {
  const resetAccount = async () => {
    if (confirm("Are you sure? This will delete all your messages, views, and your account forever.")) {
      try {
        const res = await fetch("/api/delete-account", { method: "POST" });
        if (res.ok) {
          window.location.href = "/login";
        } else {
          alert("Failed to delete account");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="p-4 pt-8 pb-24 max-w-sm mx-auto">
      
      {/* Preferences Section */}
      <div className="mb-8">
        <h3 className="text-white/50 font-bold text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
          <Bell size={14} /> Preferences
        </h3>
        
        <div className="bg-[#11131c] rounded-3xl overflow-hidden border border-white/5">
          <MenuItem icon={<Bell size={18} />} title="Notifications" />
          <MenuItem icon={<Heart size={18} />} title="Team NGL messages" />
          <MenuItem icon={<Crown size={18} />} title="NGL Pro" />
          <MenuItem icon={<Paintbrush size={18} />} title="Appearance" hasBorder={false} />
        </div>
      </div>

      {/* Safety controls Section */}
      <div className="mb-8">
        <h3 className="text-white/50 font-bold text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
          <ShieldAlert size={14} /> Safety controls
        </h3>
        
        <div className="bg-[#11131c] rounded-3xl overflow-hidden border border-white/5">
          <MenuItem icon={<FileText size={18} />} title="Hidden words" />
          <MenuItem icon={<Ban size={18} />} title="Blocked users" />
          <MenuItem icon={<PauseCircle size={18} />} title="Pause my link" />
          <MenuItem icon={<SettingsIcon size={18} />} title="Advanced message filtering" hasBorder={false} />
        </div>
      </div>
      
      {/* More Section */}
      <div className="mb-8">
        <h3 className="text-white/50 font-bold text-[13px] uppercase tracking-wider mb-4 flex items-center gap-2 px-2">
          More
        </h3>
        
        <div className="bg-[#11131c] rounded-3xl overflow-hidden border border-white/5">
          <MenuItem icon={<ShieldAlert size={18} />} title="I need help" />
          <MenuItem icon={<ShieldAlert size={18} />} title="Safety resources" />
          <MenuItem icon={<FileText size={18} />} title="Terms of use" />
          <MenuItem icon={<ShieldAlert size={18} />} title="Privacy policy" />
          <MenuItem 
            icon={<Delete size={18} className="text-red-500" />} 
            title="Delete account" 
            titleClass="text-red-500"
            onClick={resetAccount}
            hasBorder={false}
          />
        </div>
      </div>

    </div>
  );
}

function MenuItem({ 
  icon, 
  title, 
  titleClass = "text-white", 
  onClick, 
  hasBorder = true 
}: { 
  icon: React.ReactNode, 
  title: string, 
  titleClass?: string,
  onClick?: () => void,
  hasBorder?: boolean
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 pl-5 cursor-pointer hover:bg-white/5 transition-colors ${hasBorder ? "border-b border-white/5" : ""}`}
    >
      <div className="bg-[#2a2d39] text-white/80 p-2 rounded-full flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className={`font-bold text-[15px] flex-1 ${titleClass}`}>{title}</span>
      <ChevronRight size={20} className="text-white/40 shrink-0" />
    </div>
  );
}
