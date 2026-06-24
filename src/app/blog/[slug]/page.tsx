import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostContent } from "@/components/BlogPostContent";

const SITE_URL = "https://dailydeveloperinsights.tech";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Auto-generates a meta description from markdown content when none is provided.
 * Strips markdown formatting and truncates to ~155 characters at a word boundary.
 */
function generateDescriptionFromContent(markdown: string): string {
  const plain = markdown
    .replace(/^#{1,6}\s+.*/gm, "") // remove headings
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links → text
    .replace(/[*_~`>#\-|]/g, "") // strip markdown chars
    .replace(/\n+/g, " ") // collapse newlines
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();

  if (plain.length <= 160) return plain;
  const truncated = plain.slice(0, 157);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, meta_description, content_markdown, image_url, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  const postUrl = `${SITE_URL}/blog/${slug}`;
  const description =
    post.meta_description ||
    generateDescriptionFromContent(post.content_markdown || "") ||
    `Read ${post.title} on Daily Developer Insights.`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
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
      description,
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

function BreadcrumbJsonLd({ title, slug }: { title: string; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function ArticleJsonLd({ post, slug }: { post: { title: string; meta_description: string | null; content_markdown: string; image_url: string | null; published_at: string | null; updated_at: string }; slug: string }) {
  const description =
    post.meta_description ||
    generateDescriptionFromContent(post.content_markdown || "") ||
    post.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description,
    image: post.image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    articleSection: "AI & Technology",
    author: {
      "@type": "Organization",
      name: "Daily Developer Insights",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Daily Developer Insights",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    inLanguage: "en",
    isAccessibleForFree: true,
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
      <BreadcrumbJsonLd title={post.title} slug={slug} />
      <ArticleJsonLd post={post} slug={slug} />
      <BlogPostContent post={post} />
    </>
  );
}
