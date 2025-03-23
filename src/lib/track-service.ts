import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './data';
import { getAudioDuration } from './utils';
import { toast } from '@/components/ui/use-toast';

export interface UploadTrackData {
  title: string;
  artist: string;
  album: string;
  coverArtFile: File;
  audioFile: File;
}

export async function uploadTrack(data: UploadTrackData, userId: string): Promise<Track> {
  const { title, artist, album, coverArtFile, audioFile } = data;
  
  try {
    // Check if the music-assets bucket exists, create if it doesn't
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw new Error(`Unable to check storage buckets: ${bucketsError.message}`);
    }
    
    const musicAssetsBucket = buckets?.find(bucket => bucket.name === 'music-assets');
    
    if (!musicAssetsBucket) {
      console.log('Creating music-assets bucket...');
      const { error: createBucketError } = await supabase.storage.createBucket('music-assets', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit for files
      });
      
      if (createBucketError) {
        console.error('Failed to create bucket:', createBucketError);
        throw new Error(`Failed to create storage bucket: ${createBucketError.message}`);
      }
      console.log('music-assets bucket created successfully');
    } else {
      console.log('music-assets bucket already exists');
    }
    
    // Create necessary folders with a more robust approach
    try {
      await Promise.all([
        supabase.storage.from('music-assets').upload(`covers/${userId}/.folder`, new Blob([''])),
        supabase.storage.from('music-assets').upload(`tracks/${userId}/.folder`, new Blob(['']))
      ]);
      console.log('Folder structure created/verified');
    } catch (error) {
      // Ignore errors for folder creation as they're expected if folders exist
      console.log('Folders likely already exist, continuing...');
    }
    
    // Upload cover art to storage
    const coverArtFileName = `${uuidv4()}-${coverArtFile.name.replace(/\s+/g, '-')}`;
    const coverArtPath = `covers/${userId}/${coverArtFileName}`;
    
    console.log(`Uploading cover art to ${coverArtPath}...`);
    const { error: coverArtError } = await supabase
      .storage
      .from('music-assets')
      .upload(coverArtPath, coverArtFile, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (coverArtError) {
      console.error('Cover art upload error:', coverArtError);
      throw new Error(`Error uploading cover art: ${coverArtError.message}`);
    }
    console.log('Cover art uploaded successfully');
    
    // Upload audio file to storage
    const audioFileName = `${uuidv4()}-${audioFile.name.replace(/\s+/g, '-')}`;
    const audioPath = `tracks/${userId}/${audioFileName}`;
    
    console.log(`Uploading audio to ${audioPath}...`);
    const { error: audioError } = await supabase
      .storage
      .from('music-assets')
      .upload(audioPath, audioFile, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (audioError) {
      console.error('Audio upload error:', audioError);
      throw new Error(`Error uploading audio file: ${audioError.message}`);
    }
    console.log('Audio uploaded successfully');
    
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
    
    console.log('Inserting track record into database...');
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
      console.error('Database insert error:', trackError);
      throw new Error(`Error adding track to database: ${trackError.message}`);
    }
    console.log('Track record created successfully');
    
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
  } catch (error: any) {
    console.error('Upload failed:', error);
    // Re-throw the error for the component to handle
    throw error;
  }
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
