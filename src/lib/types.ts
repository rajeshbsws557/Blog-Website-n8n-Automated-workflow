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
  view_count: number;
}

export interface PostFormData {
  title: string;
  slug: string;
  meta_description: string;
  content_markdown: string;
  image_url: string;
  is_published: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_slug: string | null;
  country: string | null;
  created_at: string;
}

export interface TrafficDataPoint {
  date: string;
  views: number;
}

export interface DashboardData {
  subscriberCount: number;
  totalViews: number;
  articlesPublished: number;
  trafficData: TrafficDataPoint[];
  recentSubscribers: Subscriber[];
  topPosts: Pick<Post, "id" | "title" | "slug" | "view_count" | "is_published">[];
}
