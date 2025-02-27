
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, PlusCircle, Heart } from 'lucide-react';
import { playlists } from '@/lib/data';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="h-full w-64 flex-shrink-0 bg-sidebar border-r border-border hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-8">Melody</h1>
        
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
          <button className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full text-left">
            <PlusCircle size={20} />
            <span>Create Playlist</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full text-left">
            <Heart size={20} />
            <span>Liked Songs</span>
          </button>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">YOUR PLAYLISTS</h3>
          
          <div className="space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
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
