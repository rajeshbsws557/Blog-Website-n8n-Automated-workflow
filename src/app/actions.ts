"use server";

import { createClient } from "@/lib/supabase/server";

export type SubscribeResult =
  | { success: true; message: string }
  | { success: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(
  _prev: SubscribeResult | null,
  formData: FormData
): Promise<SubscribeResult> {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { success: false, error: "Please enter an email address." };
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("subscribers")
      .insert({ email: trimmed });

    if (error) {
      // Supabase unique-violation code
      if (error.code === "23505") {
        return {
          success: false,
          error: "You're already subscribed! 🎉",
        };
      }
      console.error("Subscribe error:", error);
      return { success: false, error: "Something went wrong. Please try again." };
    }

    return { success: true, message: "Welcome aboard! 🚀 Check your inbox soon." };
  } catch (err) {
    console.error("Unexpected subscribe error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
