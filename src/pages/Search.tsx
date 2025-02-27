
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Search as SearchIcon, X } from 'lucide-react';
import { tracks, playlists, artists } from '@/lib/data';
import PlaylistCard from '@/components/music/PlaylistCard';
import TrackItem from '@/components/music/TrackItem';
import { Link } from 'react-router-dom';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    tracks: tracks,
    playlists: playlists,
    artists: artists
  });
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({
        tracks: tracks,
        playlists: playlists,
        artists: artists
      });
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filter tracks
    const filteredTracks = tracks.filter((track) => 
      track.title.toLowerCase().includes(term) || 
      track.artist.toLowerCase().includes(term) ||
      track.album.toLowerCase().includes(term)
    );
    
    // Filter playlists
    const filteredPlaylists = playlists.filter((playlist) => 
      playlist.name.toLowerCase().includes(term) || 
      playlist.description.toLowerCase().includes(term)
    );
    
    // Filter artists
    const filteredArtists = artists.filter((artist) => 
      artist.name.toLowerCase().includes(term) || 
      artist.genres.some(genre => genre.toLowerCase().includes(term))
    );
    
    setSearchResults({
      tracks: filteredTracks,
      playlists: filteredPlaylists,
      artists: filteredArtists
    });
  }, [searchTerm]);
  
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
            <SearchIcon size={20} />
          </div>
          
          <input
            type="text"
            placeholder="Search for songs, artists, or playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-12 bg-secondary/50 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {searchTerm ? (
          <div className="space-y-8">
            {/* Artists */}
            {searchResults.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.artists.map((artist) => (
                    <div key={artist.id} className="text-center">
                      <div className="relative group mb-3 mx-auto">
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="w-full aspect-square object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-full"></div>
                      </div>
                      <h3 className="font-medium">{artist.name}</h3>
                      <p className="text-xs text-muted-foreground">Artist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Playlists */}
            {searchResults.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Tracks */}
            {searchResults.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                <div className="space-y-1">
                  {searchResults.tracks.map((track, index) => (
                    <TrackItem 
                      key={track.id} 
                      track={track} 
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* No Results */}
            {searchResults.artists.length === 0 && 
             searchResults.playlists.length === 0 && 
             searchResults.tracks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-xl font-medium mb-2">No results found for "{searchTerm}"</p>
                <p className="text-muted-foreground">Try searching for something else.</p>
              </div>
            )}
          </div>
        ) : (
          /* Browse categories when not searching */
          <div>
            <h2 className="text-xl font-bold mb-4">Browse All</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Pop', 'Hip-Hop', 'Rock', 'Electronic', 'Jazz', 'Classical', 'R&B', 'Country', 'Latin', 'Podcast', 'New Releases', 'Charts'].map((category, index) => (
                <div 
                  key={index}
                  className="relative rounded-lg overflow-hidden aspect-square"
                  style={{ backgroundColor: `hsl(${(index * 30) % 360}, 70%, 50%)` }}
                >
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <h3 className="text-white font-bold text-xl">{category}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
