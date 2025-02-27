
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-player glass-effect border-t border-border">
      <nav className="flex justify-around py-3">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center px-5 py-2 rounded-md transition-colors",
            isActive('/') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/search"
          className={cn(
            "flex flex-col items-center justify-center px-5 py-2 rounded-md transition-colors",
            isActive('/search') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link
          to="/library"
          className={cn(
            "flex flex-col items-center justify-center px-5 py-2 rounded-md transition-colors",
            isActive('/library') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Library size={24} />
          <span className="text-xs mt-1">Library</span>
        </Link>
      </nav>
    </div>
  );
}

export default MobileNavbar;
