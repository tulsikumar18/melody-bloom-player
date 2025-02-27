
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import PlaylistCard from '@/components/music/PlaylistCard';
import TrackItem from '@/components/music/TrackItem';
import { playlists } from '@/lib/data';
import { getUserTracks } from '@/lib/track-service';
import { Grid, List, Clock, Music, Play, Upload, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Track } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { toast } from '@/components/ui/use-toast';

export default function Library() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'playlists' | 'tracks'>('all');
  const [userTracks, setUserTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  
  // Fetch user tracks
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getUserTracks(user.id)
        .then(tracks => {
          setUserTracks(tracks);
        })
        .catch(error => {
          console.error('Error fetching user tracks:', error);
          toast({
            title: "Failed to load tracks",
            description: "There was an error loading your tracks.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);
  
  const handleUpload = () => {
    navigate('/upload');
  };
  
  const handleLogin = () => {
    navigate('/auth');
  };
  
  const getFilteredItems = () => {
    if (filter === 'playlists') {
      return {
        playlists: playlists,
        tracks: []
      };
    } else if (filter === 'tracks') {
      return {
        playlists: [],
        tracks: userTracks
      };
    } else {
      return {
        playlists: playlists,
        tracks: userTracks
      };
    }
  };
  
  const filteredItems = getFilteredItems();
  
  // Handle playing all tracks
  const handlePlayAllTracks = () => {
    if (userTracks.length > 0) {
      const firstTrack = userTracks[0];
      // Create a temporary playlist with user tracks
      const userTracksPlaylist = {
        id: 'user-tracks',
        name: 'Your Uploads',
        description: 'Tracks you have uploaded',
        coverArt: userTracks[0].coverArt,
        tracks: userTracks,
        createdBy: user?.user_metadata?.username || user?.email || 'You'
      };
      
      playTrack(firstTrack, userTracksPlaylist);
    }
  };
  
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
        <button 
          className={`px-4 py-1.5 rounded-full ${filter === 'all' ? 'bg-secondary text-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'} text-sm font-medium`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-1.5 rounded-full ${filter === 'playlists' ? 'bg-secondary text-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'} text-sm font-medium`}
          onClick={() => setFilter('playlists')}
        >
          Playlists
        </button>
        <button 
          className={`px-4 py-1.5 rounded-full ${filter === 'tracks' ? 'bg-secondary text-foreground' : 'bg-transparent text-muted-foreground hover:text-foreground'} text-sm font-medium`}
          onClick={() => setFilter('tracks')}
        >
          Your Uploads
        </button>
      </div>
      
      {/* Playlists Section */}
      {filteredItems.playlists.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.playlists.map((playlist) => (
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
        </div>
      )}
      
      {/* User Tracks Section */}
      {(filter === 'all' || filter === 'tracks') && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Uploads</h2>
            {userTracks.length > 0 && (
              <Button
                size="sm"
                onClick={handlePlayAllTracks}
                className="flex items-center gap-2"
              >
                <Play size={16} />
                Play All
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading your tracks...
            </div>
          ) : userTracks.length > 0 ? (
            <div className="space-y-1">
              {userTracks.map((track, index) => (
                <TrackItem 
                  key={track.id} 
                  track={track} 
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed rounded-md">
              <div className="flex flex-col items-center gap-4">
                <Upload size={48} className="text-muted-foreground" />
                <h3 className="text-lg font-medium">No uploads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your own music to see it here
                </p>
                
                {user ? (
                  <Button onClick={handleUpload} className="flex items-center gap-2">
                    <Plus size={16} />
                    Upload Track
                  </Button>
                ) : (
                  <Button onClick={handleLogin} className="flex items-center gap-2">
                    Sign In to Upload
                  </Button>
                )}
              </div>
            </div>
          )}
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
