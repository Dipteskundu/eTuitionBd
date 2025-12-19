import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axiosInstance from '../../utils/axiosInstance';
import Spinner from '../ui/Spinner';

const ReviewsList = ({ tutorEmail }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tutorEmail) {
            fetchReviews();
            fetchStats();
        }
    }, [tutorEmail]);

    const fetchReviews = async () => {
        try {
            const res = await axiosInstance.get(`/reviews/${tutorEmail}`);
            setReviews(res.data || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get(`/tutor-rating/${tutorEmail}`);
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch rating stats:', error);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'fill-warning text-warning' : 'text-base-300'
                    }`}
            />
        ));
    };

    if (loading) return <div className="py-8 text-center"><Spinner variant="dots" /></div>;

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-base-100/50 rounded-xl border border-base-200">
                <MessageSquare className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                <h3 className="font-bold text-lg text-base-content/60">No reviews yet</h3>
                <p className="text-sm text-base-content/40">Be the first to review this tutor!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center gap-4 bg-base-100 p-6 rounded-xl border border-base-200 shadow-sm">
                <div className="text-center">
                    <div className="text-4xl font-bold">{stats.averageRating}</div>
                    <div className="flex gap-1 justify-center my-1">
                        {renderStars(Math.round(stats.averageRating))}
                    </div>
                    <div className="text-sm text-base-content/60">{stats.totalReviews} reviews</div>
                </div>

                {/* Rating Distribution could go here if we had detailed stats */}
                <div className="h-12 w-[1px] bg-base-200 mx-4"></div>

                <div className="flex-1">
                    <p className="text-sm italic text-base-content/60">
                        "Reviews are verified from students who have completed tuitions with this tutor."
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                        <img
                                            src={review.reviewerPhoto || "https://i.ibb.co/MBtH413/unknown-user.jpg"}
                                            alt={review.reviewerName}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold">{review.reviewerName}</h4>
                                    <p className="text-xs text-base-content/50">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded">
                                <span className="font-bold text-warning">{review.rating}</span>
                                <Star className="w-4 h-4 fill-warning text-warning" />
                            </div>
                        </div>
                        <p className="text-base-content/80">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsList;
