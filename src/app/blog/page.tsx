import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogListingClient } from "@/components/BlogListingClient";

const SITE_URL = "https://dailydeveloperinsights.tech";

export const revalidate = 300; // ISR every 5 min

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Browse, search, and filter all articles on AI, machine learning, cloud computing, and emerging technologies.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

const LISTING_COLUMNS =
  "id, title, slug, meta_description, image_url, published_at, is_published, view_count, created_at, updated_at" as const;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(LISTING_COLUMNS)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <BlogListingClient posts={posts || []} />;
}
