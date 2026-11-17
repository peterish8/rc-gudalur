// Row shapes returned by the Convex functions in convex/ (see convex/lib.ts toRow).

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string; // Date in format YYYY-MM-DD
  image_url: string | null; // Default/thumbnail image
  extra_images: string[] | null; // Gallery images array
  is_upcoming: boolean; // true = upcoming, false = completed
  created_at: string;
};

export type BoardMember = {
  id: string;
  name: string;
  designation: string;
  section?: string; // "fixed", "layer1", "layer2", "layer3" - controls which section member appears in
  created_at: string;
};


export type About = {
  id: number;
  welcome_title: string;
  about_text: string;
  created_at: string;
};

export type ContactSubmission = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
};

export type CommunityAd = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  duration_seconds: number;  // Seconds to display this ad (default: 10)
  display_order: number;     // Lower numbers appear first (default: 0)
  created_at: string;
  updated_at: string;
};

