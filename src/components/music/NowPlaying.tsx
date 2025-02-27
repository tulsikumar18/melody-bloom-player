
import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Maximize2, List } from 'lucide-react';
import { formatTime } from '@/lib/data';
import VolumeControl from './VolumeControl';
import { Link } from 'react-router-dom';

export function NowPlaying() {
  const {
    currentTrack,
    isPlaying,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    isShuffle,
    repeatMode,
    progress,
    duration,
    seekTo,
  } = usePlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 md:h-20 bg-player glass-effect border-t border-border hidden md:flex items-center justify-center text-muted-foreground p-4">
        <p>Select a track to start playing</p>
      </div>
    );
  }

  const handleSeekChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newPosition = Math.max(0, Math.min(1, position)) * duration;
    
    if (isDragging) {
      setSeekPosition(newPosition);
    } else {
      seekTo(newPosition);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeekChange(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeekChange(e);
    }
  };

  const handleProgressMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleSeekChange(e);
      seekTo(seekPosition);
      setIsDragging(false);
    }
  };

  const progressPercent = isDragging 
    ? (seekPosition / duration) * 100 
    : (progress / duration) * 100;

  // Control button styles
  const controlButtonClass = "h-10 w-10 flex items-center justify-center rounded-full transition-all hover:text-primary";
  const mainButtonClass = "h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:h-20 bg-player glass-effect border-t border-border hidden md:flex items-center justify-between px-4">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/4">
        <img 
          src={currentTrack.coverArt} 
          alt={currentTrack.title} 
          className="h-14 w-14 rounded object-cover shadow-md"
        />
        <div className="overflow-hidden">
          <Link 
            to={`/album/${currentTrack.album}`}
            className="font-semibold text-foreground truncate block hover:underline"
          >
            {currentTrack.title}
          </Link>
          <Link 
            to={`/artist/${currentTrack.artist}`}
            className="text-sm text-muted-foreground truncate block hover:underline"
          >
            {currentTrack.artist}
          </Link>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={toggleShuffle} 
            className={`${controlButtonClass} ${isShuffle ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Shuffle size={18} />
          </button>
          
          <button 
            onClick={prevTrack} 
            className={`${controlButtonClass} text-foreground`}
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={isPlaying ? pauseTrack : resumeTrack} 
            className={mainButtonClass}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          
          <button 
            onClick={nextTrack} 
            className={`${controlButtonClass} text-foreground`}
          >
            <SkipForward size={20} />
          </button>
          
          <button 
            onClick={toggleRepeat} 
            className={`${controlButtonClass} ${repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Repeat size={18} />
            {repeatMode === 'one' && <span className="absolute text-[8px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">1</span>}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(progress)}
          </span>
          
          <div 
            className="track-progress"
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={() => isDragging && setIsDragging(false)}
          >
            <div 
              className="track-progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="progress-handle"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume and Additional Controls */}
      <div className="flex items-center gap-4 justify-end w-1/4">
        <button className={`${controlButtonClass} text-muted-foreground hover:text-foreground`}>
          <List size={18} />
        </button>
        
        <VolumeControl />
        
        <button className={`${controlButtonClass} text-muted-foreground hover:text-foreground`}>
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default NowPlaying;
