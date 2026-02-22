import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostContent } from "@/components/BlogPostContent";

const SITE_URL = "https://dailydeveloperinsights.tech";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, meta_description, image_url, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  const postUrl = `${SITE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.meta_description || undefined,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description || undefined,
      url: postUrl,
      siteName: "Daily Developer Insights",
      images: post.image_url
        ? [{ url: post.image_url, width: 1200, height: 630, alt: post.title }]
        : undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: ["Daily Developer Insights"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description || undefined,
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

function ArticleJsonLd({ post, slug }: { post: { title: string; meta_description: string | null; image_url: string | null; published_at: string | null; updated_at: string }; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.meta_description || post.title,
    image: post.image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    author: {
      "@type": "Organization",
      name: "Daily Developer Insights",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Daily Developer Insights",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
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

  return (
    <>
      <ArticleJsonLd post={post} slug={slug} />
      <BlogPostContent post={post} />
    </>
  );
}
