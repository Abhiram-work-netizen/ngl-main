"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/login?error=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };
  
  // Basic validation
  if (!data.email || !data.password || !data.username) {
    return redirect("/login?error=All fields are required");
  }
  
  if (data.username.length < 3) {
    return redirect("/login?error=Username must be at least 3 characters");
  }

  // Check if username is taken
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", data.username.toLowerCase())
    .single();

  if (existingUser) {
    return redirect("/login?mode=signup&error=Username is already taken");
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username.toLowerCase(),
      },
    },
  });

  if (error) {
    return redirect("/login?mode=signup&error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  // Assuming auto confirm is on, or inform user to check email.
  // For this project MVP, we assume they can login immediately.
  redirect("/dashboard");
}
