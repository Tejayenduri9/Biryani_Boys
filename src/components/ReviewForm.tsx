import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (comment: string, rating: number) => Promise<boolean | undefined>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const success = await onSubmit(comment, rating);
    
    if (success) {
      setComment('');
      setRating(0);
    }
    
    setSubmitting(false);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-4 space-y-3"
    >
      <StarRating rating={rating} setRating={setRating} />
      
      <textarea
        placeholder="Share your thoughts about this meal..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-sm transition focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
        rows={3}
      />
      
      <motion.button
        type="submit"
        disabled={submitting || !comment || rating === 0}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-2 px-4 bg-black dark:bg-amber-600 text-white font-medium rounded-lg shadow hover:bg-gray-800 dark:hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </motion.button>
    </motion.form>
  );
};

export default ReviewForm;