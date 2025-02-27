
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, UploadCloud, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function MobileNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-player glass-effect border-t border-border">
      <nav className="flex justify-around py-3">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
            isActive('/') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/search"
          className={cn(
            "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
            isActive('/search') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link
          to="/upload"
          className={cn(
            "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
            isActive('/upload') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UploadCloud size={20} />
          <span className="text-xs mt-1">Upload</span>
        </Link>
        
        <Link
          to="/library"
          className={cn(
            "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
            isActive('/library') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Library size={20} />
          <span className="text-xs mt-1">Library</span>
        </Link>
        
        <Link
          to="/auth"
          className={cn(
            "flex flex-col items-center justify-center px-2 py-2 rounded-md transition-colors",
            isActive('/auth') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User size={20} />
          <span className="text-xs mt-1">{user ? 'Account' : 'Sign In'}</span>
        </Link>
      </nav>
    </div>
  );
}

export default MobileNavbar;
