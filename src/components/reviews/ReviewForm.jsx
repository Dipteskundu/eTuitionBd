import React, { useState } from 'react';
import { Star } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const ReviewForm = ({ tutorEmail, tuitionId, onSuccess }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            await axiosSecure.post('/reviews', {
                tutorEmail,
                rating,
                comment,
                tuitionId
            });
            toast.success('Review submitted successfully');
            setRating(0);
            setComment('');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Stars */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= (hover || rating)
                                        ? 'fill-warning text-warning'
                                        : 'text-base-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Your Review</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-24 focus:outline-none focus:border-primary"
                        placeholder="Share your experience with this tutor..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading || rating === 0}
                    >
                        {loading && <Spinner size="sm" className="mr-2" />}
                        Submit Review
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
