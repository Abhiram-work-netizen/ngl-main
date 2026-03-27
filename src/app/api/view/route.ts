import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const supabase = createClient();

    // Get the user ID
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("username", username.toLowerCase())
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Track view
    await supabase.from("views").insert({
      user_id: user.id,
      viewer_ip: ip,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
