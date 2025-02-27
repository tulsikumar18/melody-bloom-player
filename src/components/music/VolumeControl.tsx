
import React, { useState } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export function VolumeControl() {
  const { volume, setVolume } = usePlayer();
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isHovered, setIsHovered] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.5);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.33) return <Volume size={18} />;
    if (volume < 0.66) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div 
      className="flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={toggleMute}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {getVolumeIcon()}
      </button>
      
      <div 
        className={`transition-all overflow-hidden flex items-center ${
          isHovered ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 rounded-full bg-secondary appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume * 100}%, var(--secondary) ${volume * 100}%, var(--secondary) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

export default VolumeControl;
