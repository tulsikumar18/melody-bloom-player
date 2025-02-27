
import React from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import TrackItem from '@/components/music/TrackItem';
import { playlists } from '@/lib/data';
import { Play, Heart, Clock, Download, MoreHorizontal, Share } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';

export default function Playlist() {
  const { id } = useParams<{ id: string }>();
  const playlist = playlists.find(p => p.id === id);
  const { playTrack } = usePlayer();
  
  if (!playlist) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-2">Playlist not found</h1>
          <p className="text-muted-foreground">The playlist you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }
  
  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist);
    }
  };
  
  // Calculate total duration
  const totalDuration = playlist.tracks.reduce((total, track) => total + track.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const formattedDuration = hours > 0 
    ? `${hours} hr ${minutes} min` 
    : `${minutes} min`;

  return (
    <PageContainer>
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <img 
            src={playlist.coverArt} 
            alt={playlist.name}
            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-md shadow-lg"
          />
        </div>
        
        <div className="flex flex-col justify-end">
          <div className="mb-4">
            <span className="text-sm font-medium uppercase text-muted-foreground">Playlist</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{playlist.name}</h1>
            <p className="text-muted-foreground max-w-3xl">{playlist.description}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{playlist.createdBy}</span>
            <span>•</span>
            <span>{playlist.tracks.length} songs</span>
            <span>•</span>
            <span>{formattedDuration}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={handlePlayAll}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-md"
        >
          <Play size={28} />
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Heart size={24} />
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Download size={24} />
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Share size={24} />
        </button>
        
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={24} />
        </button>
      </div>
      
      {/* Track List Header */}
      <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_2fr_1fr_auto] items-center gap-4 px-4 py-2 border-b border-border text-sm text-muted-foreground mb-2">
        <div className="w-10 text-center">#</div>
        <div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="hidden md:block">
          <Clock size={16} />
        </div>
        <div></div>
      </div>
      
      {/* Track List */}
      <div className="space-y-1">
        {playlist.tracks.map((track, index) => (
          <TrackItem 
            key={track.id} 
            track={track} 
            index={index} 
            playlistId={playlist.id}
          />
        ))}
      </div>
    </PageContainer>
  );
}
