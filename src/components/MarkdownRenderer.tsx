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

const components: Partial<Components> = {
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
