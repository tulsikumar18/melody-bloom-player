
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, Heart } from 'lucide-react';
import { playlists } from '@/lib/data';
import { cn } from '@/lib/utils';
import CreatePlaylistForm from '@/components/music/CreatePlaylistForm';
import UserProfile from '@/components/user/UserProfile';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCreatePlaylist = (playlistData: { name: string; description: string }) => {
    console.log('Create playlist:', playlistData);
    // This will be implemented with Supabase later
  };

  const handleLogin = () => {
    console.log('Login clicked');
    // This will be implemented with Supabase later
  };

  return (
    <aside className="h-full w-64 flex-shrink-0 bg-sidebar border-r border-border hidden md:flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-primary">Melody</h1>
          <UserProfile 
            isLoggedIn={false}
            onLogin={handleLogin}
          />
        </div>
        
        <nav className="space-y-1 mb-8">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive('/') 
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive('/search') 
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
          <Link
            to="/library"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive('/library') 
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Library size={20} />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="space-y-1 mb-8">
          <CreatePlaylistForm onCreatePlaylist={handleCreatePlaylist} />
          <button className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full text-left">
            <Heart size={20} />
            <span>Liked Songs</span>
          </button>
        </div>
        
        <div className="border-t border-border pt-4 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">YOUR PLAYLISTS</h3>
          
          <div className="space-y-1 overflow-y-auto custom-scrollbar pr-2 flex-1">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm",
                  isActive(`/playlist/${playlist.id}`) 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <img 
                  src={playlist.coverArt} 
                  alt={playlist.name} 
                  className="h-8 w-8 rounded object-cover"
                />
                <span className="truncate">{playlist.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
