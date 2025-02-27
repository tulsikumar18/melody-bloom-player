
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, Playlist } from '@/lib/data';

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

  // In a real implementation, these functions would interact with the Web Audio API
  // or HTML5 audio elements to control playback
  const playTrack = (track: Track, playlist?: Playlist) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (playlist) {
      setCurrentPlaylist(playlist);
      // Set queue based on playlist
      setQueue(playlist.tracks.filter(t => t.id !== track.id));
    }
    // Simulate a track duration
    setDuration(track.duration);
    setProgress(0);
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
    setProgress(position);
  };

  // In a real implementation, we would update the progress based on actual playback
  // For now, we'll simulate progress to show the UI
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= duration) {
            if (repeatMode === 'one') {
              return 0; // Reset progress
            } else {
              nextTrack(); // Go to next track
              return 0;
            }
          }
          return newProgress;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack, duration, repeatMode]);

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
