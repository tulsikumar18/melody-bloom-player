
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string
          avatar_url: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username: string
          avatar_url?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string
          avatar_url?: string | null
          full_name?: string | null
        }
      }
      tracks: {
        Row: {
          id: string
          created_at: string
          title: string
          artist: string
          album: string
          cover_art: string
          audio_url: string
          duration: number
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist: string
          album: string
          cover_art: string
          audio_url: string
          duration: number
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist?: string
          album?: string
          cover_art?: string
          audio_url?: string
          duration?: number
          uploaded_by?: string | null
        }
      }
      playlists: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          cover_art: string | null
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          cover_art?: string | null
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          cover_art?: string | null
          created_by?: string
        }
      }
      playlist_tracks: {
        Row: {
          id: string
          created_at: string
          playlist_id: string
          track_id: string
          position: number
        }
        Insert: {
          id?: string
          created_at?: string
          playlist_id: string
          track_id: string
          position: number
        }
        Update: {
          id?: string
          created_at?: string
          playlist_id?: string
          track_id?: string
          position?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
