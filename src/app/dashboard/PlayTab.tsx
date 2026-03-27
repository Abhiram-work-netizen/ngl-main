"use client";

import { useState } from "react";
import { Share, Link as LinkIcon, Download } from "lucide-react";
import Image from "next/image";

export default function PlayTab({ username }: { username: string }) {
  const [step, setStep] = useState(1);
  const profileUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${username}`
    : `ngl.link/${username}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-12">
      
      {/* Action Buttons Top */}
      <div className="flex gap-4 mb-8">
        <button className="bg-white text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors">
          <Share size={18} /> Share!
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(profileUrl);
            alert("Link copied!");
          }}
          className="bg-[#1a1c26] text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-[#2a2d39] transition-colors"
        >
          <LinkIcon size={18} /> Copy link
        </button>
      </div>

      {/* Guide Carousel Modal Box */}
      <div className="w-full max-w-[340px] bg-[#11131c] rounded-[2rem] p-6 flex flex-col items-center border border-white/5 relative shadow-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        {/* Top App Bar inside illustration */}
        <div className="flex items-center justify-between w-full mb-6">
          <span className="text-2xl font-light text-white/50 cursor-pointer">✕</span>
          <div className="flex flex-col items-center">
            <span className="text-white font-bold text-sm tracking-wide">🔒 ngl.link</span>
            <span className="text-white/40 text-xs">Instagram</span>
          </div>
          <span className="text-xl font-bold text-white/50">...</span>
        </div>

        <h2 className="text-white font-bold text-xl mb-4 text-center">
          How to add the Link<br/>to your story
        </h2>

        {/* Step Indicators */}
        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num}
              onClick={() => setStep(num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-colors ${
                step === num 
                  ? "bg-white text-black" 
                  : "bg-[#2a2d39] text-white/50 hover:bg-[#39405d]"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <p className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
          Click the <span className="bg-white/10 px-2 rounded flex items-center justify-center"><Download size={18} className="transform rotate-180" /></span> button
        </p>

        {/* Fake Instagram Image Placeholder */}
        <div className="w-full aspect-[4/5] bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl relative overflow-hidden flex items-center justify-center">
           <p className="text-white font-bold text-3xl font-serif italic text-center px-4">
             "Step {step} Simulation"
           </p>
           {/* Click hand indicator */}
           <div className="absolute top-1/3 right-1/3 text-4xl animate-bounce pointer-events-none">
             👆
           </div>
        </div>

        <button 
          onClick={() => setStep(prev => prev < 4 ? prev + 1 : 1)}
          className="w-full bg-white text-black font-bold text-lg py-4 rounded-full mt-6 hover:bg-gray-200 transition-colors"
        >
          {step === 4 ? "Back to Start" : "Next Step"}
        </button>
      </div>

    </div>
  );
}
