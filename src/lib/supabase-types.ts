
// This file will contain all the TypeScript types for our Supabase integration

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItem {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover_url: string;
  audio_url: string | null;
  duration: number;
  created_at: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
  track: TrackItem;
}

export interface LikedTrack {
  id: string;
  user_id: string;
  track_id: string;
  added_at: string;
  track: TrackItem;
}

// Database schema for reference when setting up Supabase
export const TABLES = {
  PROFILES: 'profiles',
  PLAYLISTS: 'playlists',
  TRACKS: 'tracks',
  PLAYLIST_TRACKS: 'playlist_tracks',
  LIKED_TRACKS: 'liked_tracks',
};
