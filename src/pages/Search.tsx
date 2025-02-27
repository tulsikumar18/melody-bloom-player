
import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import { tracks, playlists, artists } from '@/lib/data';
import PlaylistCard from '@/components/music/PlaylistCard';
import TrackItem from '@/components/music/TrackItem';
import { getAllTracks } from '@/lib/track-service';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allTracks, setAllTracks] = useState(tracks);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'tracks' | 'playlists' | 'artists'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'alphabetical'>('relevance');
  
  const { user } = useAuth();
  
  const [searchResults, setSearchResults] = useState({
    tracks: tracks,
    playlists: playlists,
    artists: artists
  });
  
  // Fetch all tracks including user uploaded ones
  const fetchTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseTracks = await getAllTracks();
      // Combine with demo tracks, avoid duplicates
      const combinedTracks = [...tracks];
      
      supabaseTracks.forEach(track => {
        if (!combinedTracks.some(t => t.id === track.id)) {
          combinedTracks.push(track);
        }
      });
      
      setAllTracks(combinedTracks);
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);
  
  // Search function
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Default display when no search is active
      let tracksToShow = allTracks;
      
      if (sortBy === 'newest') {
        tracksToShow = [...tracksToShow].sort((a, b) => {
          return b.id.localeCompare(a.id); // Using ID as a proxy for creation time
        });
      } else if (sortBy === 'alphabetical') {
        tracksToShow = [...tracksToShow].sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
      }
      
      setSearchResults({
        tracks: tracksToShow,
        playlists: playlists,
        artists: artists
      });
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filter tracks
    let filteredTracks = allTracks.filter((track) => 
      track.title.toLowerCase().includes(term) || 
      track.artist.toLowerCase().includes(term) ||
      track.album?.toLowerCase().includes(term)
    );
    
    // Apply sorting to filtered tracks
    if (sortBy === 'newest') {
      filteredTracks = [...filteredTracks].sort((a, b) => {
        return b.id.localeCompare(a.id);
      });
    } else if (sortBy === 'alphabetical') {
      filteredTracks = [...filteredTracks].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    } else {
      // For relevance, prioritize title matches
      filteredTracks = [...filteredTracks].sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(term);
        const bTitle = b.title.toLowerCase().includes(term);
        
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
    }
    
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
  }, [searchTerm, allTracks, sortBy]);
  
  const clearSearch = () => {
    setSearchTerm('');
    setFilter('all');
  };
  
  const getFilteredResults = () => {
    if (filter === 'all') return searchResults;
    if (filter === 'tracks') return { ...searchResults, playlists: [], artists: [] };
    if (filter === 'playlists') return { ...searchResults, tracks: [], artists: [] };
    if (filter === 'artists') return { ...searchResults, tracks: [], playlists: [] };
    return searchResults;
  };
  
  const filteredResults = getFilteredResults();

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
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
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-3 rounded-full bg-secondary/50 text-foreground">
                  <Filter size={16} />
                  <span>
                    {filter === 'all' ? 'All Types' : 
                     filter === 'tracks' ? 'Tracks' : 
                     filter === 'playlists' ? 'Playlists' : 'Artists'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('tracks')}>
                    Tracks Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('playlists')}>
                    Playlists Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('artists')}>
                    Artists Only
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-3 rounded-full bg-secondary/50 text-foreground">
                  <span>
                    {sortBy === 'relevance' ? 'Relevance' : 
                     sortBy === 'newest' ? 'Newest' : 'Alphabetical'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortBy('relevance')}>
                    Relevance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('newest')}>
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                    Alphabetical
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Loading Results</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-3 w-[180px]" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : searchTerm ? (
          <div className="space-y-8">
            {/* Artists */}
            {filteredResults.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredResults.artists.map((artist) => (
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
            {filteredResults.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredResults.playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
            
            {/* Tracks */}
            {filteredResults.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                <div className="space-y-1">
                  {filteredResults.tracks.map((track, index) => (
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
            {filteredResults.artists.length === 0 && 
             filteredResults.playlists.length === 0 && 
             filteredResults.tracks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-xl font-medium mb-2">No results found for "{searchTerm}"</p>
                <p className="text-muted-foreground">Try searching for something else or checking your filters.</p>
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
