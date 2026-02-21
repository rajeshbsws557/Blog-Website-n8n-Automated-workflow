import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostContent } from "@/components/BlogPostContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, meta_description, image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.meta_description || undefined,
    openGraph: {
      title: post.title,
      description: post.meta_description || undefined,
      images: post.image_url ? [{ url: post.image_url }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  return <BlogPostContent post={post} />;
}
