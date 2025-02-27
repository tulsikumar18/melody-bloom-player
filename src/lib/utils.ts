
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', () => {
      reject(new Error('Failed to load audio file'));
    });
    
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    
    // Clean up the object URL after we're done
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectUrl);
    }, { once: true });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl);
    }, { once: true });
  });
}
