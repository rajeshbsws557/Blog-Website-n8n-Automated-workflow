"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ─── Analytics: track a page view ───────────────────────────────
export async function trackPageView(pageSlug: string) {
  const supabase = await createClient();

  // Insert analytics event
  await supabase.from("analytics_events").insert({
    event_type: "page_view",
    page_slug: pageSlug,
  });

  // Increment the post's view_count atomically via RPC
  if (pageSlug && pageSlug !== "/") {
    await supabase.rpc("increment_view_count", { post_slug: pageSlug });
  }
}

// ─── Dashboard data fetchers ────────────────────────────────────

export async function getDashboardData() {
  const supabase = await createClient();

  // Total subscribers
  const { count: subscriberCount } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  // Total views (all time)
  const { count: totalViews } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  // Total published articles
  const { count: articlesPublished } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  // Traffic last 30 days (aggregated by date)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: trafficRaw } = await supabase
    .from("analytics_events")
    .select("created_at")
    .eq("event_type", "page_view")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // Aggregate by date
  const trafficMap = new Map<string, number>();

  // Pre-fill all 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    trafficMap.set(key, 0);
  }

  trafficRaw?.forEach((event) => {
    const key = new Date(event.created_at).toISOString().split("T")[0];
    trafficMap.set(key, (trafficMap.get(key) || 0) + 1);
  });

  const trafficData = Array.from(trafficMap.entries()).map(([date, views]) => ({
    date,
    views,
  }));

  // Recent 5 subscribers
  const { data: recentSubscribers } = await supabase
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Top 5 posts by view_count
  const { data: topPosts } = await supabase
    .from("posts")
    .select("id, title, slug, view_count, is_published")
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(5);

  return {
    subscriberCount: subscriberCount || 0,
    totalViews: totalViews || 0,
    articlesPublished: articlesPublished || 0,
    trafficData,
    recentSubscribers: recentSubscribers || [],
    topPosts: topPosts || [],
  };
}

// ─── Subscriber management ──────────────────────────────────────

export async function getSubscribers(page: number = 1, perPage: number = 20) {
  const supabase = await createClient();

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    subscribers: data || [],
    totalCount: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export async function deleteSubscriber(id: string) {
  const admin = createAdminClient();

  const { error } = await admin.from("subscribers").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
