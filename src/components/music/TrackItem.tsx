
import React from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { Track } from '@/lib/data';
import { usePlayer } from '@/context/PlayerContext';
import { formatTime } from '@/lib/data';

interface TrackItemProps {
  track: Track;
  index: number;
  playlistId?: string;
}

export function TrackItem({ track, index, playlistId }: TrackItemProps) {
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack } = usePlayer();
  
  const isCurrentTrack = currentTrack && currentTrack.id === track.id;
  
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      playTrack(track);
    }
  };

  return (
    <div 
      className={`group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_2fr_1fr_auto] items-center gap-4 px-4 py-2 rounded-md transition-colors ${
        isCurrentTrack ? 'bg-secondary/50' : 'hover:bg-secondary/20'
      }`}
    >
      <div className="w-10 text-center flex items-center justify-center">
        <span className={`group-hover:hidden ${isCurrentTrack ? 'text-primary' : 'text-muted-foreground'}`}>
          {index + 1}
        </span>
        <button 
          className="hidden group-hover:flex items-center justify-center text-foreground"
          onClick={handlePlayPause}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause size={18} className="text-primary" />
          ) : (
            <Play size={18} />
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-3 min-w-0">
        <img 
          src={track.coverArt}
          alt={track.title}
          className="h-10 w-10 rounded object-cover"
        />
        <div className="min-w-0">
          <h4 className={`truncate font-medium ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
            {track.title}
          </h4>
          <p className="truncate text-sm text-muted-foreground">
            {track.artist}
          </p>
        </div>
      </div>
      
      <div className="hidden md:block truncate text-sm text-muted-foreground">
        {track.album}
      </div>
      
      <div className="hidden md:block text-sm text-muted-foreground">
        {formatTime(track.duration)}
      </div>
      
      <div>
        <button className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default TrackItem;
