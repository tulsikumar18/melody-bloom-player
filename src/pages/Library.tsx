
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PlaylistCard from '@/components/music/PlaylistCard';
import { playlists } from '@/lib/data';
import { Grid, List, Clock, Music } from 'lucide-react';

export default function Library() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-1.5 rounded-full bg-secondary text-foreground text-sm font-medium">
          All
        </button>
        <button className="px-4 py-1.5 rounded-full bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium">
          Playlists
        </button>
        <button className="px-4 py-1.5 rounded-full bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium">
          Albums
        </button>
        <button className="px-4 py-1.5 rounded-full bg-transparent text-muted-foreground hover:text-foreground text-sm font-medium">
          Artists
        </button>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-secondary/20 transition-colors"
            >
              <img 
                src={playlist.coverArt}
                alt={playlist.name}
                className="h-14 w-14 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{playlist.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Playlist</span>
                  <span>•</span>
                  <span>{playlist.createdBy}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {playlist.tracks.length} songs
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>
                  {Math.floor(
                    playlist.tracks.reduce((acc, track) => acc + track.duration, 0) / 60
                  )} min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recently Played Section */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Recently Played</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.slice(0, 6).map((playlist) => (
          <div 
            key={playlist.id}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative mb-3">
              <img 
                src={playlist.coverArt}
                alt={playlist.name}
                className="w-full aspect-square object-cover rounded-full"
              />
              <button className="absolute bottom-0 right-0 h-10 w-10 bg-primary rounded-full text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg transform translate-y-2 group-hover:translate-y-0">
                <Play size={16} />
              </button>
            </div>
            <h3 className="font-medium text-sm truncate w-full">{playlist.name}</h3>
            <p className="text-xs text-muted-foreground truncate w-full">Playlist</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
