
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            username,
            avatar_url: null,
            full_name: null,
          }]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast({
            title: "Profile Creation Warning",
            description: "Account created but profile setup had an issue. Some features may be limited.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account",
          });
        }
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error creating account",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You've been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "There was an error signing out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
