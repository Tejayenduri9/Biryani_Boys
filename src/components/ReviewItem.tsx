import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Loader2, Star } from 'lucide-react';
import StarRating from './StarRating';
import { Review } from '../types';

interface ReviewItemProps {
  review: Review;
  isOwner: boolean;
  onUpdate: (reviewId: string, comment: string, rating: number) => Promise<boolean | undefined>;
  onDelete: (reviewId: string) => Promise<boolean | undefined>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ 
  review, 
  isOwner, 
  onUpdate, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const success = await onUpdate(review.id, editComment, editRating);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await onDelete(review.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formattedDate = review.timestamp?.toDate ? 
    new Date(review.timestamp.toDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 
    'Recently';

  const handleCancel = () => {
    setEditComment(review.comment);
    setEditRating(review.rating);
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      <motion.div layout="position" className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-200 font-semibold text-lg">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-medium text-base">{review.user.name}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.form 
            key="edit-form"
            layout="position"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleEditSubmit}
            className="space-y-4"
          >
            <motion.div layout="position" className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <StarRating 
                rating={editRating} 
                setRating={setEditRating} 
                size="sm"
                disabled={isUpdating}
              />
            </motion.div>
            
            <motion.textarea
              layout="position"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              disabled={isUpdating}
              className="w-full p-3 border border-amber-200 dark:border-amber-800 rounded-lg text-sm bg-white dark:bg-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50 resize-none"
              rows={3}
              placeholder="Share your thoughts..."
            />
            
            <motion.div layout="position" className="flex gap-2">
              <motion.button
                type="submit"
                disabled={isUpdating || !editComment.trim() || editRating === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 disabled:hover:bg-amber-600 flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="review-content"
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <motion.div layout="position" className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < review.rating 
                      ? 'text-yellow-500 fill-yellow-500' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </motion.div>
            
            <motion.p layout="position" className="text-base leading-relaxed">{review.comment}</motion.p>
            
            {isOwner && (
              <motion.div layout="position" className="flex gap-4 items-center pt-2">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1.5 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </motion.button>
                
                <motion.button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1.5 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReviewItem;