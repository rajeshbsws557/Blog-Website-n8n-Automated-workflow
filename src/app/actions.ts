"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type SubscribeResult =
  | { success: true; message: string }
  | { success: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple server-side rate limiter: max 5 subscribe attempts per IP per minute
const subscribeLimiter = new Map<string, { count: number; resetAt: number }>();

function isSubscribeRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = subscribeLimiter.get(ip);

  if (!entry || now > entry.resetAt) {
    subscribeLimiter.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

export async function subscribeAction(
  _prev: SubscribeResult | null,
  formData: FormData
): Promise<SubscribeResult> {
  // Rate limit by IP
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isSubscribeRateLimited(ip)) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

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
