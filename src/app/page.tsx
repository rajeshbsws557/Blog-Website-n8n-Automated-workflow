import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BlogFeed } from "@/components/BlogFeed";
import { LatestPosts } from "@/components/LatestPosts";

const SITE_URL = "https://dailydeveloperinsights.tech";
const POSTS_PER_PAGE = 6;

// Revalidate every 5 minutes for ISR
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

// Only select the columns we need on the homepage (skip content_markdown)
const LISTING_COLUMNS = "id, title, slug, meta_description, image_url, published_at, is_published, view_count, created_at, updated_at" as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));

  const supabase = await createClient();

  // Single query: fetch enough posts for both LatestPosts (3) and the paginated feed.
  // On page 1, the latest 3 are shown in the featured section too, so we fetch
  // max(3, POSTS_PER_PAGE) + offset in one go to avoid a second round-trip.
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  // For page 1, also ensure we cover the 3 latest posts
  const fetchTo = page === 1 ? Math.max(to, 2) : to;

  const { data: allPosts, count } = await supabase
    .from("posts")
    .select(LISTING_COLUMNS, { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, fetchTo);

  const latestPosts = page === 1 ? (allPosts || []).slice(0, 3) : [];
  const posts = (allPosts || []).slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Daily Developer Insights",
            url: SITE_URL,
            description:
              "Cutting-edge insights on Artificial Intelligence, Machine Learning, and emerging IT technologies.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Hero />
      {latestPosts.length > 0 && (
        <LatestPosts posts={latestPosts} />
      )}
      <BlogFeed
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
