import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { BlogFeed } from "@/components/BlogFeed";

const SITE_URL = "https://dailydeveloperinsights.tech";
const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));

  const supabase = await createClient();

  // Fetch posts with pagination
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, to);

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
      <BlogFeed
        posts={posts || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
