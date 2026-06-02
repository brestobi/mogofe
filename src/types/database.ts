// Database types for FamilyRoots
// These types are explicitly defined to avoid inference issues with Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          first_name: string;
          middle_name: string | null;
          last_name: string;
          nickname: string | null;
          gender: 'male' | 'female' | 'other' | null;
          birth_date: string | null;
          death_date: string | null;
          occupation: string | null;
          biography: string | null;
          photo_url: string | null;
          branch: string | null;
          generation: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          middle_name?: string | null;
          last_name: string;
          nickname?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          birth_date?: string | null;
          death_date?: string | null;
          occupation?: string | null;
          biography?: string | null;
          photo_url?: string | null;
          branch?: string | null;
          generation?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          middle_name?: string | null;
          last_name?: string;
          nickname?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          birth_date?: string | null;
          death_date?: string | null;
          occupation?: string | null;
          biography?: string | null;
          photo_url?: string | null;
          branch?: string | null;
          generation?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      relationships: {
        Row: {
          id: string;
          member_id: string;
          father_id: string | null;
          mother_id: string | null;
          spouse_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          father_id?: string | null;
          mother_id?: string | null;
          spouse_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          father_id?: string | null;
          mother_id?: string | null;
          spouse_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "relationships_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: true;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "relationships_father_id_fkey";
            columns: ["father_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "relationships_mother_id_fkey";
            columns: ["mother_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "relationships_spouse_id_fkey";
            columns: ["spouse_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      memories: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_date: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          event_date?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          event_date?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      memory_members: {
        Row: {
          id: string;
          memory_id: string;
          member_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_id: string;
          member_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          memory_id?: string;
          member_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memory_members_memory_id_fkey";
            columns: ["memory_id"];
            isOneToOne: false;
            referencedRelation: "memories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memory_members_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      wishes: {
        Row: {
          id: string;
          member_id: string;
          title: string;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          title: string;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          title?: string;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishes_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      gallery: {
        Row: {
          id: string;
          member_id: string;
          file_url: string;
          file_type: 'photo' | 'video' | 'document';
          caption: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          file_url: string;
          file_type: 'photo' | 'video' | 'document';
          caption?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          file_url?: string;
          file_type?: 'photo' | 'video' | 'document';
          caption?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          }
        ];
      };
      activities: {
        Row: {
          id: string;
          type: 'member_added' | 'member_updated' | 'member_deleted' | 'memory_added' | 'wish_added' | 'gallery_added';
          description: string;
          member_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'member_added' | 'member_updated' | 'member_deleted' | 'memory_added' | 'wish_added' | 'gallery_added';
          description: string;
          member_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'member_added' | 'member_updated' | 'member_deleted' | 'memory_added' | 'wish_added' | 'gallery_added';
          description?: string;
          member_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper type for typed Supabase client
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
