
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Playlist } from '@/lib/data';
import { usePlayer } from '@/context/PlayerContext';

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { playTrack } = usePlayer();
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist);
    }
  };

  return (
    <Link 
      to={`/playlist/${playlist.id}`}
      className="playlist-card bg-card rounded-md overflow-hidden flex flex-col"
    >
      <div className="relative group">
        <img 
          src={playlist.coverArt} 
          alt={playlist.name}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="h-12 w-12 bg-primary rounded-full text-primary-foreground flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-105"
          >
            <Play size={24} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground truncate">
          {playlist.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
          {playlist.description}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          By {playlist.createdBy}
        </p>
      </div>
    </Link>
  );
}

export default PlaylistCard;
