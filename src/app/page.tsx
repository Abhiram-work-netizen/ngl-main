import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-gradient-radial from-pink-500/20 to-transparent opacity-50 blur-xl -z-10" />
      
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-2xl">
        <MessageCircle className="text-white w-10 h-10 -rotate-12" />
      </div>

      <h1 className="text-5xl font-black mb-4 tracking-tight">
        Send Anonymous <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
          Messages
        </span>
      </h1>
      
      <p className="text-gray-400 max-w-sm mb-10 text-lg">
        Get an anonymous messaging link and find out what your friends really think of you.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link 
          href="/login" 
          className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_40px_rgba(236,72,153,0.3)] text-center"
        >
          Get Your Link
        </Link>
      </div>

      <p className="mt-12 text-sm text-gray-600 font-medium">
        Made with ♥
      </p>
    </main>
  );
}
