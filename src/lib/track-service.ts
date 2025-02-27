
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './data';
import { getAudioDuration } from './utils';

export interface UploadTrackData {
  title: string;
  artist: string;
  album: string;
  coverArtFile: File;
  audioFile: File;
}

export async function uploadTrack(data: UploadTrackData, userId: string): Promise<Track> {
  const { title, artist, album, coverArtFile, audioFile } = data;
  
  // Upload cover art to storage
  const coverArtFileName = `${uuidv4()}-${coverArtFile.name.replace(/\s+/g, '-')}`;
  const coverArtPath = `covers/${userId}/${coverArtFileName}`;
  
  const { error: coverArtError } = await supabase
    .storage
    .from('music-assets')
    .upload(coverArtPath, coverArtFile, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (coverArtError) {
    throw new Error(`Error uploading cover art: ${coverArtError.message}`);
  }
  
  // Upload audio file to storage
  const audioFileName = `${uuidv4()}-${audioFile.name.replace(/\s+/g, '-')}`;
  const audioPath = `tracks/${userId}/${audioFileName}`;
  
  const { error: audioError } = await supabase
    .storage
    .from('music-assets')
    .upload(audioPath, audioFile, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (audioError) {
    throw new Error(`Error uploading audio file: ${audioError.message}`);
  }
  
  // Get the public URLs
  const coverArtUrl = supabase
    .storage
    .from('music-assets')
    .getPublicUrl(coverArtPath).data.publicUrl;
  
  const audioUrl = supabase
    .storage
    .from('music-assets')
    .getPublicUrl(audioPath).data.publicUrl;
  
  // Calculate duration
  let duration: number;
  try {
    duration = await getAudioDuration(audioFile);
  } catch (error) {
    console.error('Error calculating duration:', error);
    // Default to estimated duration if we can't calculate it
    duration = 180; // 3 minutes
  }
  
  // Insert track record into database
  const { data: trackData, error: trackError } = await supabase
    .from('tracks')
    .insert({
      title,
      artist,
      album,
      cover_art: coverArtUrl,
      audio_url: audioUrl,
      duration,
      uploaded_by: userId,
    })
    .select()
    .single();
  
  if (trackError) {
    throw new Error(`Error adding track to database: ${trackError.message}`);
  }
  
  // Convert to our Track type
  return {
    id: trackData.id,
    title: trackData.title,
    artist: trackData.artist,
    album: trackData.album,
    coverArt: trackData.cover_art,
    duration: trackData.duration,
    audioUrl: trackData.audio_url,
  };
}

export async function getUserTracks(userId: string): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('uploaded_by', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching user tracks: ${error.message}`);
  }
  
  if (!data) {
    return [];
  }
  
  return data.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    coverArt: track.cover_art,
    duration: track.duration,
    audioUrl: track.audio_url,
  }));
}

export async function getAllTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Error fetching tracks: ${error.message}`);
  }
  
  if (!data) {
    return [];
  }
  
  return data.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    coverArt: track.cover_art,
    duration: track.duration,
    audioUrl: track.audio_url,
  }));
}
