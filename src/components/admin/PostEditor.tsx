"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/types";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface PostEditorProps {
  mode: "create" | "edit";
  initialData?: Post;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostEditor({ mode, initialData }: PostEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.meta_description || ""
  );
  const [contentMarkdown, setContentMarkdown] = useState(
    initialData?.content_markdown || ""
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [isPublished, setIsPublished] = useState(
    initialData?.is_published || false
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === "create") {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !contentMarkdown.trim()) {
      setError("Title, slug, and content are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        meta_description: metaDescription.trim() || null,
        content_markdown: contentMarkdown,
        image_url: imageUrl.trim() || null,
        is_published: isPublished,
        ...(isPublished && !initialData?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      };

      if (mode === "edit" && initialData) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", initialData.id);

        if (error) {
          setError(error.message);
          return;
        }
      } else {
        const { error } = await supabase.from("posts").insert(postData);

        if (error) {
          setError(error.message);
          return;
        }
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-2">
            {mode === "create" ? "Create New Post" : "Edit Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-muted hover:text-foreground transition-all"
          >
            {showPreview ? "Editor" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary text-white font-semibold text-sm hover:shadow-lg hover:shadow-accent/25 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : mode === "create" ? "Publish" : "Update"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
        >
          {error}
        </motion.div>
      )}

      {showPreview ? (
        /* Preview Mode */
        <div className="rounded-2xl border border-border/50 bg-card p-8">
          <h1 className="text-3xl font-extrabold mb-4">{title || "Untitled"}</h1>
          {metaDescription && (
            <p className="text-muted mb-6">{metaDescription}</p>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}
          <MarkdownRenderer content={contentMarkdown || "*Start writing...*"} />
        </div>
      ) : (
        /* Editor Mode */
        <div className="space-y-5">
          {/* Title */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-lg font-semibold"
            />
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all font-mono text-sm"
            />
          </div>

          {/* Meta Description */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description for SEO and social previews..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL or upload below..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all text-sm"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-accent hover:border-accent/30 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "📎 Upload Image"
                )}
              </button>
            </div>
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-32 rounded-lg object-cover border border-border/50"
                />
              </div>
            )}
          </div>

          {/* Markdown Content */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (Markdown)
            </label>
            <textarea
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              placeholder="Write your post in Markdown..."
              rows={20}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all font-mono text-sm leading-relaxed resize-y"
            />
          </div>

          {/* Publish Toggle */}
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Publish</p>
              <p className="text-sm text-muted">
                Make this post visible to the public
              </p>
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isPublished ? "bg-accent" : "bg-border"
              }`}
            >
              <motion.div
                animate={{ x: isPublished ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
