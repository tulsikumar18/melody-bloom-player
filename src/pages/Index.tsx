
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PlaylistCard from '@/components/music/PlaylistCard';
import { categories, playlists } from '@/lib/data';

export default function Index() {
  const featuredPlaylist = playlists[0]; // First playlist as featured
  
  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
        <img 
          src={featuredPlaylist.coverArt} 
          alt="Featured" 
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
          <span className="inline-block px-2 py-1 bg-primary/80 text-primary-foreground text-xs rounded-full mb-2">
            Featured Playlist
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{featuredPlaylist.name}</h1>
          <p className="text-white/80 max-w-xl">{featuredPlaylist.description}</p>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
              Play Now
            </button>
            <button className="px-6 py-2 bg-white/10 text-white rounded-full font-medium backdrop-blur-sm hover:bg-white/20 transition-colors">
              Save to Library
            </button>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      {categories.map((category) => (
        <section key={category.id} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <button className="text-sm text-primary hover:underline">See all</button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {category.playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      ))}
      
      {/* Recent Tracks Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists[0].tracks.slice(0, 4).map((track, index) => (
            <div 
              key={track.id}
              className="flex items-center gap-3 p-3 rounded-md bg-card hover:bg-secondary/50 transition-colors"
            >
              <img 
                src={track.coverArt}
                alt={track.title}
                className="h-12 w-12 rounded object-cover"
              />
              <div>
                <h4 className="font-medium text-foreground">{track.title}</h4>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
