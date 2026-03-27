import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const supabase = createClient();
    const cookieStore = cookies();
    const loggedInUser = cookieStore.get("ngl_user")?.value;

    if (!loggedInUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const { data: currentUser } = await supabase
      .from("users")
      .select("id")
      .eq("username", loggedInUser)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete their messages and views (foreign keys should handle cascading if set up, 
    // but just in case, we'll manually delete to be safe)
    await supabase.from("messages").delete().eq("receiver_id", currentUser.id);
    await supabase.from("views").delete().eq("user_id", currentUser.id);

    // Try deleting sender messages too if they sent any while logged in
    await supabase.from("messages").delete().eq("sender_id", currentUser.id);

    // Finally delete the user
    await supabase.from("users").delete().eq("id", currentUser.id);

    // Clear the cookie
    cookieStore.delete("ngl_user");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete auth error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
