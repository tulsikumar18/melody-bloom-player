
import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileProps {
  userName?: string;
  userAvatar?: string;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onSettings?: () => void;
}

export function UserProfile({
  userName = "Guest User",
  userAvatar,
  isLoggedIn = false,
  onLogin = () => {},
  onLogout = () => {},
  onSettings = () => {},
}: UserProfileProps) {
  
  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  if (!isLoggedIn) {
    return (
      <button 
        onClick={onLogin}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors text-sm"
      >
        <User size={16} />
        <span>Log in</span>
      </button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
          <Avatar className="h-6 w-6">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserProfile;
