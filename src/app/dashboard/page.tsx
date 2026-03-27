/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardWrapper from "./DashboardWrapper";
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
    redirect("/login");
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, message, created_at, revealed, sender:users!messages_sender_id_fkey(username, profile_pic)")
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardWrapper username={user.username} messages={messages || []} />
  );
}
