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

-- ============================================================
-- 8. Newsletter Subscribers Table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert a new subscription
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can view the subscriber list
CREATE POLICY "Admins can view subscribers"
  ON public.subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
  ON public.subscribers
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 9. Analytics Events Table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  page_slug TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_slug ON public.analytics_events (page_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events (event_type);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert analytics events
CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can view analytics
CREATE POLICY "Admins can view analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 10. Add view_count to posts table
-- ============================================================

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- ============================================================
-- 11. Function to increment post view count (safe, atomic)
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_view_count(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE slug = post_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon so public visitors can trigger it
GRANT EXECUTE ON FUNCTION public.increment_view_count(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view_count(TEXT) TO authenticated;
