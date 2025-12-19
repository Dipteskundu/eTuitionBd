import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

const BookmarkButton = ({ itemId, type, className = '' }) => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const toast = useToast();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && itemId) {
            checkBookmarkStatus();
        }
    }, [user, itemId]);

    const checkBookmarkStatus = async () => {
        try {
            const res = await axiosSecure.get('/is-bookmarked', {
                params: { itemId, type }
            });
            setIsBookmarked(res.data.bookmarked);
        } catch (error) {
            console.error('Failed to check bookmark status:', error);
        }
    };

    const toggleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error('Please login to bookmark');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosSecure.post('/bookmarks', { itemId, type });
            setIsBookmarked(res.data.bookmarked);
            toast.success(res.data.message);
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            toast.error('Failed to update bookmark');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleBookmark}
            disabled={loading}
            className={`btn btn-ghost btn-sm btn-circle ${className}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark
                className={`w-5 h-5 transition-all ${isBookmarked
                        ? 'fill-primary text-primary'
                        : 'text-base-content/50 hover:text-primary'
                    } ${loading ? 'animate-pulse' : ''}`}
            />
        </button>
    );
};

export default BookmarkButton;
