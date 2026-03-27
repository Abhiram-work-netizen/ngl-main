import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, message } = await request.json();
    if (!username || !message || message.trim() === "") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const supabase = createClient();

    // Find user ID by username
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optional: get sender ID if logged in
    const loggedInUser = cookies().get("ngl_user")?.value;
    let senderId = null;
    if (loggedInUser) {
      const { data: currentUser } = await supabase.from("users").select("id").eq("username", loggedInUser).single();
      if (currentUser) senderId = currentUser.id;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      receiver_id: user.id,
      sender_id: senderId,
      message: message.trim(),
    });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
