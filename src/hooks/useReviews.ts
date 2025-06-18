import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  serverTimestamp,
  limit,
  getDoc,
  enableNetwork,
  disableNetwork,
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Review, MealBox, ReviewsByMeal } from '../types';

// Local storage key for caching
const CACHE_KEY = 'reviews_cache';

// Load initial cache from localStorage
const loadCachedReviews = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : new Map();
  } catch (e) {
    console.error('Error loading cache:', e);
    return new Map();
  }
};

// Save cache to localStorage
const saveCacheToStorage = (cache: Map<string, Review[]>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Array.from(cache.entries())));
  } catch (e) {
    console.error('Error saving cache:', e);
  }
};

// In-memory cache
const reviewsCache = new Map<string, Review[]>();

// Helper function to check if an ID is a valid Firestore ID
const isValidFirestoreId = (id: string): boolean => {
  // Firestore IDs are typically 20 characters long and alphanumeric
  return /^[a-zA-Z0-9]{20}$/.test(id);
};

export const useReviews = (mealBoxes: MealBox[]) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewsByMeal>(() => {
    // Initialize from cache
    const cached: ReviewsByMeal = {};
    mealBoxes.forEach(box => {
      const cachedReviews = reviewsCache.get(box.title);
      if (cachedReviews) {
        cached[box.title] = cachedReviews;
      }
    });
    return cached;
  });
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      enableNetwork(db);
      setError(null);
    };
    
    const handleOffline = () => {
      setOffline(true);
      disableNetwork(db);
      setError("You're currently offline. Using cached data.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Batch updates for better performance
  const batchUpdate = async (updates: Array<{ ref: any, data: any }>) => {
    const batch = writeBatch(db);
    updates.forEach(({ ref, data }) => {
      batch.update(ref, data);
    });
    await batch.commit();
  };

  const submitReview = useCallback(async (meal: string, comment: string, rating: number) => {
    if (!user) {
      toast.error("Please sign in to submit a review.");
      return false;
    }

    if (!comment || rating === 0) {
      toast.error("Please rate and write a comment.");
      return false;
    }

    setError(null);

    // Create a temporary review with a special prefix
    const newReview: Review = {
      id: `temp_${Date.now()}`,
      comment,
      rating,
      user: {
        name: user.displayName ?? "",
        uid: user.uid,
      },
      timestamp: new Date(),
    };

    // Update local state immediately
    setReviews(prev => ({
      ...prev,
      [meal]: [newReview, ...(prev[meal] || [])]
    }));

    try {
      const commentsRef = collection(db, "reviews", meal, "comments");
      const docRef = await addDoc(commentsRef, {
        comment,
        rating,
        user: {
          name: user.displayName,
          uid: user.uid,
        },
        timestamp: serverTimestamp(),
      });

      // Update the review with the actual Firestore ID
      const finalReview = { ...newReview, id: docRef.id };
      
      // Replace the temporary review with the final version
      setReviews(prev => ({
        ...prev,
        [meal]: prev[meal].map(r => r.id === newReview.id ? finalReview : r)
      }));

      // Update cache
      const updatedReviews = reviews[meal].map(r => 
        r.id === newReview.id ? finalReview : r
      );
      reviewsCache.set(meal, updatedReviews);
      saveCacheToStorage(reviewsCache);

      toast.success('Review submitted successfully!');
      return true;
    } catch (error: any) {
      console.error("Error submitting review:", error);
      
      // Revert optimistic update
      setReviews(prev => ({
        ...prev,
        [meal]: prev[meal].filter(r => r.id !== newReview.id)
      }));
      
      if (error.code === 'permission-denied') {
        toast.error("You don't have permission to submit reviews.");
      } else if (offline) {
        toast.error("You're offline. Please try again when you're back online.");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
      return false;
    }
  }, [user, reviews, offline]);

  const updateReview = useCallback(async (meal: string, reviewId: string, comment: string, rating: number) => {
    if (!user) {
      toast.error("Please sign in to update a review.");
      return false;
    }

    // Don't allow updates on temporary reviews
    if (reviewId.startsWith('temp_')) {
      toast.error("Cannot update this review yet. Please wait for it to sync.");
      return false;
    }

    // Validate Firestore ID
    if (!isValidFirestoreId(reviewId)) {
      toast.error("Invalid review ID. Cannot update this review.");
      return false;
    }

    setError(null);

    const previousReviews = reviews[meal];
    const reviewToUpdate = previousReviews.find(r => r.id === reviewId);

    if (!reviewToUpdate) {
      toast.error("Review not found.");
      return false;
    }

    // Optimistic update
    setReviews(prev => ({
      ...prev,
      [meal]: prev[meal].map(review =>
        review.id === reviewId
          ? { ...review, comment, rating, timestamp: new Date() }
          : review
      )
    }));

    try {
      const ref = doc(db, "reviews", meal, "comments", reviewId);
      
      // Verify ownership
      const reviewDoc = await getDoc(ref);
      if (!reviewDoc.exists()) {
        throw new Error("Review not found");
      }
      
      const reviewData = reviewDoc.data();
      if (reviewData.user.uid !== user.uid) {
        throw new Error("Permission denied");
      }

      await updateDoc(ref, {
        comment,
        rating,
        timestamp: serverTimestamp(),
      });

      // Update cache
      reviewsCache.set(meal, reviews[meal]);
      saveCacheToStorage(reviewsCache);
      
      toast.success("Review updated successfully!");
      return true;
    } catch (error: any) {
      // Revert optimistic update
      setReviews(prev => ({
        ...prev,
        [meal]: previousReviews
      }));

      console.error("Error updating review:", error);
      
      if (error.message === "Permission denied") {
        toast.error("You can only edit your own reviews.");
      } else if (error.message === "Review not found") {
        toast.error("This review no longer exists.");
      } else if (offline) {
        toast.error("You're offline. Please try again when you're back online.");
      } else {
        toast.error("Failed to update review. Please try again.");
      }
      return false;
    }
  }, [user, reviews, offline]);

  const deleteReview = useCallback(async (meal: string, reviewId: string) => {
    if (!user) {
      toast.error("Please sign in to delete a review.");
      return false;
    }

    // Handle temporary reviews
    if (reviewId.startsWith('temp_')) {
      setReviews(prev => ({
        ...prev,
        [meal]: prev[meal].filter(r => r.id !== reviewId)
      }));
      toast.success("Review removed.");
      return true;
    }

    // Validate Firestore ID
    if (!isValidFirestoreId(reviewId)) {
      toast.error("Cannot delete this review. Invalid review ID.");
      return false;
    }

    const previousReviews = reviews[meal];
    const reviewToDelete = previousReviews.find(r => r.id === reviewId);

    if (!reviewToDelete) {
      toast.error("Review not found.");
      return false;
    }

    // Optimistic delete
    setReviews(prev => ({
      ...prev,
      [meal]: prev[meal].filter(r => r.id !== reviewId)
    }));

    try {
      const ref = doc(db, "reviews", meal, "comments", reviewId);
      
      // Verify ownership
      const reviewDoc = await getDoc(ref);
      if (!reviewDoc.exists()) {
        // If the document doesn't exist, consider it a success
        toast.success("Review already deleted.");
        return true;
      }
      
      const reviewData = reviewDoc.data();
      if (reviewData.user.uid !== user.uid) {
        throw new Error("Permission denied");
      }

      await deleteDoc(ref);
      
      // Update cache
      reviewsCache.set(meal, reviews[meal].filter(r => r.id !== reviewId));
      saveCacheToStorage(reviewsCache);
      
      toast.success("Review deleted successfully!");
      return true;
    } catch (error: any) {
      // Revert optimistic delete unless the review was already gone
      if (error.message !== "Review already deleted") {
        setReviews(prev => ({
          ...prev,
          [meal]: previousReviews
        }));
      }

      console.error("Error deleting review:", error);
      
      if (error.message === "Permission denied") {
        toast.error("You can only delete your own reviews.");
      } else if (offline) {
        toast.error("You're offline. Please try again when you're back online.");
      } else {
        toast.error("Failed to delete review. Please try again.");
      }
      return false;
    }
  }, [user, reviews, offline]);

  const getAverageRating = useCallback((meal: string) => {
    const list = reviews[meal] || [];
    if (list.length === 0) return "0.0";
    const total = list.reduce((acc, r) => acc + r.rating, 0);
    return (total / list.length).toFixed(1);
  }, [reviews]);

  // Load and sync reviews
  useEffect(() => {
    // Load cached data first
    const cachedData = loadCachedReviews();
    if (cachedData.size > 0) {
      const initialReviews: ReviewsByMeal = {};
      mealBoxes.forEach(box => {
        const cached = cachedData.get(box.title);
        if (cached) {
          initialReviews[box.title] = cached;
          reviewsCache.set(box.title, cached);
        }
      });
      setReviews(initialReviews);
      setLoading(false);
    }

    // Only set up real-time sync if user is authenticated
    if (!user) {
      setLoading(false);
      setError("Please sign in to view reviews.");
      return;
    }

    // Set up real-time sync
    const unsubscribes = mealBoxes.map((box) => {
      const q = query(
        collection(db, "reviews", box.title, "comments"),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      return onSnapshot(q, (snapshot) => {
        const reviewsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];

        reviewsCache.set(box.title, reviewsList);
        saveCacheToStorage(reviewsCache);

        setReviews(prev => ({
          ...prev,
          [box.title]: reviewsList
        }));
        setLoading(false);
        setError(null);
      }, (error: any) => {
        console.error("Error syncing reviews:", error);
        if (error.code === 'permission-denied') {
          setError("You don't have permission to view reviews. Please check if you're properly signed in.");
          toast.error("Permission denied when accessing reviews.");
        } else if (!offline) {
          setError("Error loading reviews. Some data may be outdated.");
          toast.error("Error syncing reviews. Some data may be outdated.");
        }
        setLoading(false);
      });
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [mealBoxes, user]);

  return {
    reviews,
    loading,
    submitReview,
    updateReview,
    deleteReview,
    getAverageRating,
    offline,
    error
  };
};