import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setUser({
            uid: result.user.uid,
            displayName: result.user.displayName || 'Anonymous',
            email: result.user.email,
            photoURL: result.user.photoURL
          });
          toast.success('Signed in successfully!');
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        toast.error('Failed to complete sign-in. Please try again.');
      }
    };

    checkRedirectResult();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // First try popup method
      try {
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        setUser({
          uid: result.user.uid,
          displayName: result.user.displayName || 'Anonymous',
          email: result.user.email,
          photoURL: result.user.photoURL
        });
        toast.success('Signed in successfully!');
      } catch (popupError: any) {
        // If popup is blocked, fall back to redirect
        if (popupError.code === 'auth/popup-blocked') {
          toast.loading('Redirecting to Google sign-in...', { duration: 2000 });
          await signInWithRedirect(auth, provider);
          // Note: The redirect will reload the page, so we won't reach this point
          return;
        }
        throw popupError; // Re-throw other popup errors
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      // Handle specific error cases for better user experience
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for Google sign-in. Please contact support.');
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