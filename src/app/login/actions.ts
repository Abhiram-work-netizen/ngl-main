"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = (formData.get("username") as string).trim().toLowerCase();
  
  if (!username || username.length < 3) {
    return redirect("/login?error=Username must be at least 3 characters");
  }

  const supabase = createClient();

  // Create or load the dummy user
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (!user) {
    const { error: insertError } = await supabase.from("users").insert({
      username: username,
      email: `${username}@dummy.local`, // dummy email
    });
    if (insertError) {
      return redirect("/login?error=" + encodeURIComponent(insertError.message));
    }
  }

  // Set the dummy auth cookie
  cookies().set("ngl_user", username, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365 
  });
  
  redirect("/dashboard");
}
