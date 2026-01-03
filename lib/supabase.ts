import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables. Contact form will be disabled or fallback to mock mode. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

// Create client only if keys exist, otherwise return null (or handle safely)
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

export type Event = {
  id: string; // UUID
  title: string;
  description: string | null;
  event_date: string; // Date in format YYYY-MM-DD
  image_url: string | null; // Default/thumbnail image
  extra_images: string[] | null; // Gallery images array
  is_upcoming: boolean; // true = upcoming, false = completed
  created_at: string;
};

export type BoardMember = {
  id: string; // UUID
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
  created_at: string;
  updated_at: string;
};

