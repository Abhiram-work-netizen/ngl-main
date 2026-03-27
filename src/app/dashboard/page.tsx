/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MessageCard from "@/components/MessageCard";
import { Eye, Share } from "lucide-react";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const loggedInUser = cookies().get("ngl_user")?.value;

  if (!loggedInUser) {
    redirect("/login");
  }

  const supabase = createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", loggedInUser)
    .single();

  if (!user) {
    // If handle_new_user trigger hasn't finished perhaps
    return <div className="p-8 text-white">Loading profile...</div>;
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("id, message, created_at, revealed, sender:users!messages_sender_id_fkey(username, profile_pic)")
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  // Get view count
  const { count: viewCount } = await supabase
    .from("views")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const profileUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${user.username}`
    : `http://localhost:3000/${user.username}`; // fallback for dev

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header / Stats */}
        <div className="glass-card p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-orange-500/20 blur-3xl -z-10 rounded-full" />
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Inbox</h1>
            <p className="text-white/60 font-medium tracking-wide">
              {messages?.length || 0} messages received
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col items-center min-w-[100px]">
              <div className="flex items-center gap-2 text-white/50 text-sm font-semibold mb-1">
                <Eye size={16} /> Views
              </div>
              <span className="text-2xl font-bold text-white">{viewCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="glass-card p-6 rounded-[2rem] border-pink-500/30">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Share className="text-pink-500" size={20} /> Share your link
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white/80 font-mono text-sm truncate select-all">
              {profileUrl}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Latest Messages</h2>
          
          {messages && messages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {messages.map((msg) => (
                <MessageCard 
                  key={msg.id}
                  id={msg.id}
                  message={msg.message}
                  createdAt={msg.created_at}
                  revealed={msg.revealed}
                  senderUsername={(msg.sender as any)?.username || (Array.isArray(msg.sender) ? msg.sender[0]?.username : undefined)}
                  senderPic={(msg.sender as any)?.profile_pic || (Array.isArray(msg.sender) ? msg.sender[0]?.profile_pic : undefined)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 glass-card rounded-[2rem]">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-xl font-bold text-white mb-2">It&apos;s quiet here...</h3>
              <p className="text-white/50 max-w-sm mx-auto">
                Share your link on Instagram, Snapchat, or Twitter to start receiving anonymous messages!
              </p>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}
