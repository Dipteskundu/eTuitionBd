import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { MapPin, BadgeCheck, User, Search, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import BookmarkButton from '../../components/ui/BookmarkButton';
import useTitle from '../../hooks/useTitle';

const Tutors = () => {
    useTitle('Tutors');
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 8;

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/tutors', {
                    params: { page: currentPage, limit, search: searchTerm }
                });
                setTutors(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
                setTotal(res.data.total || 0);
            } catch (error) {
                console.error("Failed to fetch tutors", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchTutors, 300);
        return () => clearTimeout(debounceTimer);
    }, [currentPage, searchTerm]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="min-h-screen bg-base-100 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] animate-float animation-delay-300" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">
                        Find Expert Tutors
                    </h1>
                    <p className="text-lg text-base-content/70 mb-8">
                        Connect with qualified tutors who can help you achieve your academic goals.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <Input
                            placeholder="Search by name, subject, or location..."
                            leftIcon={<Search size={18} />}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on search
                            }}
                            className="bg-base-100/50 backdrop-blur-sm"
                        />
                    </div>

                    {/* Results Count */}
                    {total > 0 && (
                        <p className="text-sm text-base-content/60 mt-4">
                            Showing {tutors.length} of {total} tutors
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner variant="dots" size="lg" />
                    </div>
                ) : tutors.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-base-content/30" />
                        </div>
                        <h3 className="text-2xl font-bold text-base-content/80 mb-2">No Tutors Found</h3>
                        <p className="text-base-content/60 max-w-md">
                            {searchTerm ? `No results found for "${searchTerm}". Try different keywords.` : "No tutors currently available."}
                        </p>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {tutors.map((tutor) => (
                                <motion.div key={tutor._id} variants={itemVariants}>
                                    <Card className="h-full flex flex-col items-center text-center !p-6 relative" hover glass>
                                        <div className="absolute top-3 right-3 z-10">
                                            <BookmarkButton itemId={tutor._id} type="tutor" />
                                        </div>
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 rounded-full ring-4 ring-primary/20 p-1">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-base-200">
                                                    {tutor.photoURL ? (
                                                        <img src={tutor.photoURL} alt={tutor.displayName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/40">
                                                            <User size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {tutor.verified && (
                                                <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1" title="Verified Tutor">
                                                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-base-content mb-1">
                                            {tutor.displayName || tutor.name}
                                        </h2>

                                        <div className="flex items-center gap-1 text-sm text-base-content/60 mb-3">
                                            <MapPin size={14} className="text-secondary" />
                                            <span>{tutor.location || 'Bangladesh'}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                                            {tutor.expertise && tutor.expertise.slice(0, 3).map((exp, idx) => (
                                                <span key={idx} className="badge badge-primary badge-outline badge-sm bg-primary/5">
                                                    {exp}
                                                </span>
                                            ))}
                                            {tutor.expertise && tutor.expertise.length > 3 && (
                                                <span className="badge badge-ghost badge-sm text-xs">+{tutor.expertise.length - 3}</span>
                                            )}
                                        </div>

                                        <p className="text-sm text-base-content/60 line-clamp-2 mb-6 flex-grow">
                                            {tutor.bio || "Passionate educator dedicated to student success."}
                                        </p>

                                        <Link to={`/tutors/${tutor._id}`} className="w-full mt-auto">
                                            <Button size="sm" variant="outline" fullWidth rightIcon={ArrowRight}>
                                                View Profile
                                            </Button>
                                        </Link>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    leftIcon={ChevronLeft}
                                >
                                    Prev
                                </Button>

                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const pageNum = idx + 1;
                                        // Show limited pages for cleaner UI
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`btn btn-sm ${currentPage === pageNum
                                                        ? 'btn-primary'
                                                        : 'btn-ghost'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="px-2">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    rightIcon={ChevronRight}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Tutors;
