
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { UploadTrackData, uploadTrack } from '@/lib/track-service';
import { UploadCloud, Music, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioInfo, setAudioInfo] = useState<{ duration: string, size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to auth page if not logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload tracks.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Cover art must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Cover art must be an image file",
          variant: "destructive",
        });
        return;
      }
      
      setCoverArt(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverArtPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Audio file must be less than 50MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "File must be an audio file",
          variant: "destructive",
        });
        return;
      }
      
      setAudioFile(file);
      
      // Display file info
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setAudioInfo({
        duration: "Calculating...",
        size: `${sizeMB} MB`
      });
      
      // Try to get audio duration
      try {
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
          const minutes = Math.floor(audio.duration / 60);
          const seconds = Math.floor(audio.duration % 60);
          setAudioInfo(prev => ({
            ...prev!,
            duration: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
          }));
        });
        
        audio.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error getting audio duration:', error);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload tracks.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!title || !artist || !album || !coverArt || !audioFile) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields and select both files.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    try {
      const trackData: UploadTrackData = {
        title,
        artist,
        album,
        coverArtFile: coverArt,
        audioFile,
      };
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 500);
      
      await uploadTrack(trackData, user.id);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload Successful",
        description: "Your track has been uploaded successfully!",
      });
      
      // Reset form
      setTimeout(() => {
        setTitle('');
        setArtist('');
        setAlbum('');
        setCoverArt(null);
        setAudioFile(null);
        setCoverArtPreview(null);
        setAudioInfo(null);
        setUploadProgress(0);
        setIsUploading(false);
        
        // Navigate to library
        navigate('/library');
      }, 1000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || "There was an error uploading your track.");
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your track.",
        variant: "destructive",
      });
      setUploadProgress(0);
      setIsUploading(false);
    }
  };
  
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Your Music</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Share Your Tracks</CardTitle>
            <CardDescription>
              Upload your original music to share with the world
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Track Title</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter track title"
                      required
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist Name</Label>
                    <Input 
                      id="artist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Enter artist name"
                      required
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="album">Album Name</Label>
                    <Input 
                      id="album"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      placeholder="Enter album name"
                      required
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audioFile">Audio File</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Input 
                          id="audioFile"
                          type="file"
                          onChange={handleAudioFileChange}
                          accept="audio/*"
                          className="sr-only"
                          required
                          disabled={isUploading}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => document.getElementById('audioFile')?.click()}
                          disabled={isUploading}
                        >
                          <Music size={18} />
                          <span>Select Audio File</span>
                        </Button>
                      </div>
                      {audioFile && (
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {audioFile.name}
                        </span>
                      )}
                    </div>
                    
                    {audioInfo && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Size: {audioInfo.size}</span>
                          <span>Duration: {audioInfo.duration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="coverArt">Cover Art</Label>
                  <div 
                    className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center overflow-hidden relative"
                  >
                    <Input 
                      id="coverArt"
                      type="file"
                      onChange={handleCoverArtChange}
                      accept="image/*"
                      className="sr-only"
                      required
                      disabled={isUploading}
                    />
                    
                    {coverArtPreview ? (
                      <img 
                        src={coverArtPreview} 
                        alt="Cover Art Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center h-full w-full cursor-pointer"
                        onClick={() => !isUploading && document.getElementById('coverArt')?.click()}
                      >
                        <UploadCloud size={48} className="mb-2" />
                        <p>Click to select cover image</p>
                        <p className="text-xs mt-2">
                          Recommended: 500x500px JPG or PNG
                        </p>
                      </div>
                    )}
                    
                    {coverArtPreview && !isUploading && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute bottom-2 right-2 bg-background/80 hover:bg-background"
                        onClick={() => {
                          setCoverArt(null);
                          setCoverArtPreview(null);
                        }}
                      >
                        Change
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                disabled={isUploading || !user}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : 'Upload Track'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
