
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { UploadTrackData, uploadTrack } from '@/lib/track-service';
import { UploadCloud, Music } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    try {
      const trackData: UploadTrackData = {
        title,
        artist,
        album,
        coverArtFile: coverArt,
        audioFile,
      };
      
      await uploadTrack(trackData, user.id);
      
      toast({
        title: "Upload Successful",
        description: "Your track has been uploaded successfully!",
      });
      
      // Reset form
      setTitle('');
      setArtist('');
      setAlbum('');
      setCoverArt(null);
      setAudioFile(null);
      setCoverArtPreview(null);
      
      // Navigate to library
      navigate('/library');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your track.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Your Music</h1>
        
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
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => document.getElementById('audioFile')?.click()}
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
                        onClick={() => document.getElementById('coverArt')?.click()}
                      >
                        <UploadCloud size={48} className="mb-2" />
                        <p>Click to select cover image</p>
                        <p className="text-xs mt-2">
                          Recommended: 500x500px JPG or PNG
                        </p>
                      </div>
                    )}
                    
                    {coverArtPreview && (
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
