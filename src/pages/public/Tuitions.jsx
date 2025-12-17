import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { MapPin, BookOpen, DollarSign, Calendar, Search, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';

const Tuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTuitions = async () => {
            try {
                const res = await axiosInstance.get('/tuitions');
                setTuitions(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch tuitions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTuitions();
    }, []);

    const filteredTuitions = tuitions.filter(t =>
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Spinner variant="dots" size="lg" fullScreen />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-base-100 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-float animation-delay-200" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">
                        Find Your Perfect Tuition
                    </h1>
                    <p className="text-lg text-base-content/70 mb-8">
                        Browse through hundreds of available tuitions and find the one that matches your expertise.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <Input
                            placeholder="Search by subject or location..."
                            leftIcon={<Search size={18} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-base-100/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                {/* Content Section */}
                {filteredTuitions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-base-content/30" />
                        </div>
                        <h3 className="text-2xl font-bold text-base-content/80 mb-2">No Tuitions Found</h3>
                        <p className="text-base-content/60 max-w-md">
                            {searchTerm ? `No results found for "${searchTerm}". Try different keywords.` : "There are no available tuitions at the moment."}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredTuitions.map((tuition) => (
                            <motion.div key={tuition._id} variants={itemVariants}>
                                <Card className="h-full flex flex-col" hover glass>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="badge badge-primary badge-outline mb-2">{tuition.class}</div>
                                            <h2 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                                                {tuition.subject}
                                            </h2>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-primary" />
                                        </div>
                                    </div>

                                    <p className="text-sm text-base-content/60 line-clamp-2 mb-6 flex-grow">
                                        {tuition.description || "No specific requirements provided for this tuition."}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-base-content/70">
                                            <MapPin size={16} className="text-secondary shrink-0" />
                                            <span className="truncate">{tuition.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-base-content/70">
                                            <DollarSign size={16} className="text-success shrink-0" />
                                            <span className="font-bold text-success/90">{tuition.salary} BDT/Month</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-base-content/70">
                                            <Calendar size={16} className="text-warning shrink-0" />
                                            <span>{tuition.daysPerWeek} Days/Week</span>
                                        </div>
                                    </div>

                                    <Link to={`/tuitions/${tuition._id}`} className="block mt-auto">
                                        <Button variant="outline" fullWidth rightIcon={<ArrowRight size={18} />} className="group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                            View Details
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Tuitions;
