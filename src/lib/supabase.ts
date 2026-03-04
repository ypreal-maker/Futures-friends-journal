import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  user_id: string;
  username: string;
  title: string;
  narrative: string;
  category: 'Moments' | 'Narratives' | 'Archives' | 'Treasures' | 'Daily Log';
  location?: string;
  image_url?: string;
  created_at: string;
};