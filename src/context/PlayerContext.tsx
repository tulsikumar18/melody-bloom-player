
import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { Track, Playlist } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface PlayerContextProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentPlaylist: Playlist | null;
  queue: Track[];
  playTrack: (track: Track, playlist?: Playlist) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  progress: number;
  duration: number;
  seekTo: (position: number) => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Define functions first to avoid the "used before declaration" error
  const playTrack = (track: Track, playlist?: Playlist) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (playlist) {
      setCurrentPlaylist(playlist);
      // Set queue based on playlist
      setQueue(playlist.tracks.filter(t => t.id !== track.id));
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentPlaylist.tracks.length) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => currentTrack && track.id === currentTrack.id
    );
    
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1], currentPlaylist);
    } else if (repeatMode === 'all') {
      // If repeat is on, go back to the first track
      playTrack(currentPlaylist.tracks[0], currentPlaylist);
    }
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    
    // If current time is more than 3 seconds, restart the track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    
    if (!currentPlaylist || !currentPlaylist.tracks.length) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(
      track => currentTrack && track.id === currentTrack.id
    );
    
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1], currentPlaylist);
    } else if (repeatMode === 'all') {
      // If repeat is on, go to the last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1], currentPlaylist);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const addToQueue = (track: Track) => {
    setQueue([...queue, track]);
  };

  const seekTo = (position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
    }
    setProgress(position);
  };
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Error replaying track:', err));
      } else {
        nextTrack();
      }
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error('Audio playback error:', e);
      toast({
        title: "Playback Error",
        description: "There was an error playing this track. Please try another.",
        variant: "destructive",
      });
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [repeatMode]);
  
  // Update audio source when current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    // In a real app, this would be the track's audio URL
    // For our demo, we'll use a sample audio file
    const audioUrl = currentTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    // Only change source if it's different
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Error playing track:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, isPlaying]);
  
  // Update playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing track:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentPlaylist,
        queue,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        isShuffle,
        repeatMode,
        progress,
        duration,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
