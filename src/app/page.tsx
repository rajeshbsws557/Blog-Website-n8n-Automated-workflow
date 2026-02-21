import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/Hero";
import { BlogFeed } from "@/components/BlogFeed";

const POSTS_PER_PAGE = 6;

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
      <Hero />
      <BlogFeed
        posts={posts || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </>
  );
}
