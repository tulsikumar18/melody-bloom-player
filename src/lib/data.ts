
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverArt: string;
  duration: number; // in seconds
  audioUrl?: string; // would be populated in a real app
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverArt: string;
  tracks: Track[];
  createdBy: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genres: string[];
}

// Mock data for our application
export const tracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D',
    duration: 203,
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    coverArt: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 234,
  },
  {
    id: '3',
    title: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    coverArt: 'https://images.unsplash.com/photo-1629276281744-19b21514caef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 285,
  },
  {
    id: '4',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep, Where Do We Go?',
    coverArt: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 194,
  },
  {
    id: '5',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    album: 'Uptown Special',
    coverArt: 'https://images.unsplash.com/photo-1629276309471-9ee4a0df2a35?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 270,
  },
  {
    id: '6',
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    coverArt: 'https://images.unsplash.com/photo-1629276281041-cf56af16b8ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 281,
  },
  {
    id: '7',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    album: '21',
    coverArt: 'https://images.unsplash.com/photo-1629276281071-0138ccef3a29?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 228,
  },
  {
    id: '8',
    title: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    coverArt: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWxidW0lMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D',
    duration: 212,
  },
  {
    id: '9',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    coverArt: 'https://images.unsplash.com/photo-1629276301820-0f3eedc29fd0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 174,
  },
  {
    id: '10',
    title: 'Don\'t Start Now',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    coverArt: 'https://images.unsplash.com/photo-1629276281744-19b21514caef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGFsYnVtJTIwY292ZXJ8ZW58MHx8MHx8fDA%3D',
    duration: 213,
  },
];

export const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Chill Vibes',
    description: 'Relaxing beats to help you unwind',
    coverArt: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpbGx8ZW58MHx8MHx8fDA%3D',
    tracks: [tracks[1], tracks[5], tracks[8], tracks[2]],
    createdBy: 'Alex',
  },
  {
    id: '2',
    name: 'Workout Hits',
    description: 'High energy tracks to power your workout',
    coverArt: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29ya291dHxlbnwwfHwwfHx8MA%3D%3D',
    tracks: [tracks[0], tracks[3], tracks[4], tracks[9]],
    createdBy: 'Fitness Pro',
  },
  {
    id: '3',
    name: 'Focus Flow',
    description: 'Instrumental tracks to help you concentrate',
    coverArt: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9jdXN8ZW58MHx8MHx8fDA%3D',
    tracks: [tracks[6], tracks[7], tracks[1], tracks[5]],
    createdBy: 'Productivity Guru',
  },
  {
    id: '4',
    name: 'Party Mix',
    description: 'Upbeat hits to get the party started',
    coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcnR5fGVufDB8fDB8fHww',
    tracks: [tracks[4], tracks[9], tracks[0], tracks[3]],
    createdBy: 'Party Animal',
  },
  {
    id: '5',
    name: 'Acoustic Gems',
    description: 'Stripped back acoustic performances',
    coverArt: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWNvdXN0aWN8ZW58MHx8MHx8fDA%3D',
    tracks: [tracks[2], tracks[5], tracks[6], tracks[1]],
    createdBy: 'Acoustic Lover',
  },
  {
    id: '6',
    name: 'Drive Time',
    description: 'Perfect tracks for a road trip',
    coverArt: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJpdmV8ZW58MHx8MHx8fDA%3D',
    tracks: [tracks[8], tracks[0], tracks[4], tracks[7]],
    createdBy: 'Road Tripper',
  },
];

export const artists: Artist[] = [
  {
    id: '1',
    name: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNpbmdlcnxlbnwwfHwwfHx8MA%3D%3D',
    genres: ['R&B', 'Pop', 'Dance'],
  },
  {
    id: '2',
    name: 'Ed Sheeran',
    image: 'https://images.unsplash.com/photo-1529354235303-cc42f23d767a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNpbmdlcnxlbnwwfHwwfHx8MA%3D%3D',
    genres: ['Pop', 'Folk', 'Acoustic'],
  },
  {
    id: '3',
    name: 'Adele',
    image: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHNpbmdlcnxlbnwwfHwwfHx8MA%3D%3D',
    genres: ['Pop', 'Soul', 'R&B'],
  },
  {
    id: '4',
    name: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1623761403424-724aa75604e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNpbmdlcnxlbnwwfHwwfHx8MA%3D%3D',
    genres: ['Pop', 'Electropop', 'Alternative'],
  },
];

// Categories for recommendations
export const categories = [
  { id: '1', name: 'Made For You', playlists: [playlists[0], playlists[2], playlists[4]] },
  { id: '2', name: 'Recently Played', playlists: [playlists[1], playlists[3], playlists[5]] },
  { id: '3', name: 'New Releases', playlists: [playlists[3], playlists[0], playlists[4]] },
];

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
