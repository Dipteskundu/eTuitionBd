import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, User, BookOpen, MapPin, DollarSign, ArrowRight, Trash2 } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import axiosInstance from '../../../utils/axiosInstance';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import useToast from '../../../hooks/useToast';

const Bookmarks = () => {
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('tutor');
    const [bookmarks, setBookmarks] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, [activeTab]);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get('/my-bookmarks', {
                params: { type: activeTab }
            });
            setBookmarks(res.data || []);

            // Fetch actual item data
            const itemIds = res.data.map(b => b.itemId);
            if (itemIds.length > 0) {
                if (activeTab === 'tutor') {
                    const tutorRes = await axiosInstance.get('/tutors', { params: { limit: 100 } });
                    const allTutors = tutorRes.data.data || [];
                    setItems(allTutors.filter(t => itemIds.includes(t._id)));
                } else {
                    const tuitionRes = await axiosInstance.get('/tuitions', { params: { limit: 100 } });
                    const allTuitions = tuitionRes.data.data || [];
                    setItems(allTuitions.filter(t => itemIds.includes(t._id)));
                }
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeBookmark = async (itemId) => {
        try {
            await axiosSecure.post('/bookmarks', { itemId, type: activeTab });
            setItems(prev => prev.filter(i => i._id !== itemId));
            toast.success('Bookmark removed');
        } catch (error) {
            toast.error('Failed to remove bookmark');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold gradient-text">My Bookmarks</h1>
                    <p className="text-base-content/60">Your saved tutors and tuitions</p>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed bg-base-200">
                    <button
                        onClick={() => setActiveTab('tutor')}
                        className={`tab ${activeTab === 'tutor' ? 'tab-active' : ''}`}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Tutors
                    </button>
                    <button
                        onClick={() => setActiveTab('tuition')}
                        className={`tab ${activeTab === 'tuition' ? 'tab-active' : ''}`}
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Tuitions
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner variant="dots" size="lg" />
                </div>
            ) : items.length === 0 ? (
                <Card className="text-center py-12">
                    <Bookmark className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                    <h3 className="text-xl font-bold text-base-content/60 mb-2">
                        No {activeTab === 'tutor' ? 'tutors' : 'tuitions'} bookmarked
                    </h3>
                    <p className="text-base-content/40 mb-6">
                        Browse and save your favorite {activeTab === 'tutor' ? 'tutors' : 'tuitions'} for quick access
                    </p>
                    <Link to={activeTab === 'tutor' ? '/tutors' : '/tuitions'}>
                        <Button variant="primary">
                            Browse {activeTab === 'tutor' ? 'Tutors' : 'Tuitions'}
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Card key={item._id} hover glass className="relative">
                            {/* Remove Button */}
                            <button
                                onClick={() => removeBookmark(item._id)}
                                className="absolute top-3 right-3 btn btn-ghost btn-sm btn-circle text-error"
                                title="Remove bookmark"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            {activeTab === 'tutor' ? (
                                // Tutor Card
                                <div className="flex flex-col items-center text-center">
                                    <div className="avatar mb-4">
                                        <div className="w-20 h-20 rounded-full ring-2 ring-primary">
                                            <img
                                                src={item.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                                                alt={item.displayName}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">{item.displayName || item.name}</h3>
                                    <p className="text-sm text-base-content/60 mb-4">
                                        {item.location || 'Bangladesh'}
                                    </p>
                                    <Link to={`/tutors/${item._id}`} className="w-full">
                                        <Button variant="outline" size="sm" fullWidth rightIcon={ArrowRight}>
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                // Tuition Card
                                <div>
                                    <div className="badge badge-primary badge-outline mb-2">{item.class}</div>
                                    <h3 className="font-bold text-lg mb-3">{item.subject}</h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                                            <MapPin className="w-4 h-4 text-secondary" />
                                            {item.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-success font-bold">
                                            <DollarSign className="w-4 h-4" />
                                            ৳{item.salary}/month
                                        </div>
                                    </div>
                                    <Link to={`/tuitions/${item._id}`}>
                                        <Button variant="outline" size="sm" fullWidth rightIcon={ArrowRight}>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
