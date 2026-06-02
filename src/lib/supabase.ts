import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Typed helper for common queries
export type Member = Database['public']['Tables']['members']['Row'];
export type Relationship = Database['public']['Tables']['relationships']['Row'];
export type Memory = Database['public']['Tables']['memories']['Row'];
export type MemoryMember = Database['public']['Tables']['memory_members']['Row'];
export type Wish = Database['public']['Tables']['wishes']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
