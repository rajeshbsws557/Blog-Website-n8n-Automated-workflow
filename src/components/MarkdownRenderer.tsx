"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Partial<Components> = {
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <span className="block relative w-full my-6" style={{ maxHeight: "28rem" }}>
        <Image
          src={src}
          alt={alt || ""}
          width={896}
          height={448}
          className="rounded-xl object-cover w-full"
          style={{ maxHeight: "28rem" }}
          sizes="(max-width: 768px) 100vw, 896px"
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
