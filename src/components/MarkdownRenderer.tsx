"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { BlogImage } from "@/components/BlogImage";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Custom heading components that demote all headings by one level.
 * Blog posts already have an <h1> from BlogPostContent, so markdown
 * # headings should render as <h2>, ## as <h3>, etc.
 * This ensures only one <h1> per page for proper SEO.
 */
const components: Partial<Components> = {
  h1: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h2: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h3: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h4: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h5: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="block relative w-full my-6" style={{ minHeight: "14rem", maxHeight: "28rem" }}>
        <BlogImage
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="rounded-xl object-cover"
          loading="lazy"
        />
      </span>
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-blog">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

