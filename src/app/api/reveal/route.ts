import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: "No message ID provided" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the current user is the receiver of the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("receiver_id, sender_id, revealed")
      .eq("id", messageId)
      .single();

    if (messageError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.receiver_id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to reveal this message" }, { status: 403 });
    }

    if (message.revealed) {
       return NextResponse.json({ error: "Already revealed" }, { status: 400 });
    }

    // In a real app, charge credits or check Pro status here

    // Mark as revealed
    const { error: updateError } = await supabase
      .from("messages")
      .update({ revealed: true })
      .eq("id", messageId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to reveal" }, { status: 500 });
    }

    // Now get the sender details if they weren't completely anonymous
    if (message.sender_id) {
      const { data: sender } = await supabase
        .from("users")
        .select("username, profile_pic")
        .eq("id", message.sender_id)
        .single();
        
      if (sender) {
        return NextResponse.json({ 
          success: true, 
          senderUsername: sender.username,
          senderPic: sender.profile_pic
        });
      }
    }

    // If no sender_id, they were completely anonymous (not logged in when sending)
    return NextResponse.json({ 
      success: true, 
      senderUsername: "Unknown (Not logged in)",
      senderPic: null
    });

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
