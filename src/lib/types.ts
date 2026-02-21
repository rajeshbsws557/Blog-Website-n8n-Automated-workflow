export interface Post {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  content_markdown: string;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  meta_description: string;
  content_markdown: string;
  image_url: string;
  is_published: boolean;
}
