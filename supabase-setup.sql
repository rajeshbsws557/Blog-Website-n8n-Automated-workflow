-- ============================================================
-- Supabase Setup Script for AI & IT Tech Blog
-- Run this SQL in the Supabase Dashboard SQL Editor
-- ============================================================

-- 1. Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meta_description TEXT,
  content_markdown TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON public.posts (is_published);

-- Full-text search index on title and content
CREATE INDEX IF NOT EXISTS idx_posts_fts ON public.posts 
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_markdown, '')));

-- 3. Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Public can only read published posts
CREATE POLICY "Public can read published posts" 
  ON public.posts 
  FOR SELECT 
  USING (is_published = true);

-- Authenticated users have full CRUD access
CREATE POLICY "Admins can do everything" 
  ON public.posts 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_posts_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies - public read, authenticated upload/delete
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
