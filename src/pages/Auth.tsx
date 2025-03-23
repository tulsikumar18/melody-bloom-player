import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  
  // Check online status
  React.useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    setError(null);
    
    if (!isOnline) {
      setError('You appear to be offline. Please check your internet connection and try again.');
      return false;
    }
    
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    if (isRegistering && !username) {
      setError('Username is required');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation - at least 6 characters
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await signUp(email, password, username);
        toast({
          title: "Registration successful",
          description: "You can now sign in with your new account",
        });
        // After registration, switch to the login tab
        setIsRegistering(false);
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Error is already handled and displayed by the AuthContext
      // We just need to make sure loading state is updated
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Melody</CardTitle>
            <CardDescription>
              {isRegistering ? 'Create your account to share music.' : 'Sign in to your account.'}
            </CardDescription>
          </CardHeader>
          
          {!isOnline && (
            <div className="mx-6 mb-2 p-3 bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 text-sm rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              You are currently offline. Please check your internet connection.
            </div>
          )}
          
          <Tabs defaultValue="login" onValueChange={(value) => setIsRegistering(value === 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="mx-6 mt-4 p-3 bg-destructive/15 text-destructive text-sm rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isOnline}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isOnline}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </PageContainer>
  );
}
