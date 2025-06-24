import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
  signInAnonymously
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
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
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName || (user.isAnonymous ? 'Guest User' : 'Anonymous'),
          email: user.email,
          photoURL: user.photoURL
        });
        setAuthError(null);
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
          setAuthError(null);
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        setAuthError('Failed to complete sign-in');
        toast.error('Failed to complete sign-in. Please try guest access.');
      }
    };

    checkRedirectResult();
  }, []);

  const signInAsGuest = async () => {
    try {
      setAuthError(null);
      const result = await signInAnonymously(auth);
      setUser({
        uid: result.user.uid,
        displayName: 'Guest User',
        email: null,
        photoURL: null
      });
      toast.success('Signed in as guest! You can browse and add items to cart.');
    } catch (error: any) {
      console.error('Anonymous sign in error:', error);
      setAuthError('Failed to sign in as guest');
      toast.error('Failed to sign in as guest. Please try again.');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Try popup method first
      try {
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        setUser({
          uid: result.user.uid,
          displayName: result.user.displayName || 'Anonymous',
          email: result.user.email,
          photoURL: result.user.photoURL
        });
        toast.success('Signed in successfully!');
        return;
      } catch (popupError: any) {
        console.log('Popup error:', popupError.code);
        
        // Handle popup blocked - try redirect
        if (popupError.code === 'auth/popup-blocked') {
          toast.loading('Popup blocked. Trying alternative method...', { duration: 2000 });
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch (redirectError: any) {
            console.error('Redirect also failed:', redirectError);
            throw redirectError;
          }
        }
        
        // Handle popup closed by user
        if (popupError.code === 'auth/popup-closed-by-user') {
          toast.error('Sign-in cancelled. You can try guest access instead.');
          return;
        }
        
        throw popupError;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      let errorMessage = 'Failed to sign in with Google.';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. You can use guest access instead.';
        setAuthError('Domain not authorized for Google sign-in');
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. You can use guest access to continue.';
        setAuthError('Popup blocked by browser');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
        setAuthError('Network error');
      } else {
        setAuthError('Google sign-in failed');
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setAuthError(null);
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
    signInAsGuest,
    signOut,
    authError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};