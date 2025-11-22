import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. " +
      "Get these from your Supabase project dashboard at https://supabase.com/dashboard"
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

export type Event = {
  id: string; // UUID
  title: string;
  description: string | null;
  event_date: string; // Date in format YYYY-MM-DD
  image_url: string | null;
  created_at: string;
};

export type BoardMember = {
  id: string; // UUID
  name: string;
  designation: string;
  section?: string; // "fixed", "layer1", "layer2", "layer3" - controls which section member appears in
  created_at: string;
};

export type GalleryImage = {
  id: string; // UUID
  title: string;
  description: string | null;
  image_url: string;
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
