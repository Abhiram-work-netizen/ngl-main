"use client";

import { useSearchParams } from "next/navigation";
import { login, signup } from "./actions";
import { useState, Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const initMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  
  const [isLogin, setIsLogin] = useState(initMode === "login");

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-[2rem]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-white/60">
          {isLogin 
            ? "Log in to view your messages" 
            : "Get your personal anonymous link"}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label className="block text-sm text-white/70 mb-1 ml-2 font-medium">Username</label>
            <input
              name="username"
              type="text"
              placeholder="e.g. coolguy99"
              required={!isLogin}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-white/70 mb-1 ml-2 font-medium">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-1 ml-2 font-medium">Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        <button
          formAction={isLogin ? login : signup}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-lg py-4 rounded-full mt-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(236,72,153,0.3)]"
        >
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-white/60 hover:text-white text-sm font-medium transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-pink-500/10 to-transparent opacity-30 blur-2xl -z-10" />
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
