import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      setUser({
        uid: result.user.uid,
        displayName: result.user.displayName || 'Anonymous',
        email: result.user.email,
        photoURL: result.user.photoURL
      });
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
