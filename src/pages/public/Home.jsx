import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Search, User, Award, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { ThemeContext } from '../../context/ThemeContext';

const Home = () => {
    const { theme } = useContext(ThemeContext);
    // Mock Data
    const tuitions = [
        {
            id: 1,
            subject: 'Mathematics',
            class: 'Class 10',
            location: 'Dhanmondi, Dhaka',
            salary: 5000,
            days: '3 days/week',
            gender: 'Any',
        },
        {
            id: 2,
            subject: 'English',
            class: 'HSC',
            location: 'Mirpur, Dhaka',
            salary: 6000,
            days: '4 days/week',
            gender: 'Female',
        },
        {
            id: 3,
            subject: 'Physics',
            class: 'Class 9',
            location: 'Uttara, Dhaka',
            salary: 5500,
            days: '3 days/week',
            gender: 'Male',
        },
    ];

    const tutors = [
        {
            id: 1,
            name: 'Rahim Ahmed',
            subject: 'Math Specialist',
            experience: '5 Years Exp',
            rating: 4.8,
            img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        },
        {
            id: 2,
            name: 'Fatima Begum',
            subject: 'English Teacher',
            experience: '3 Years Exp',
            rating: 4.9,
            img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        },
        {
            id: 3,
            name: 'Kamal Hasan',
            subject: 'Science Tutor',
            experience: '7 Years Exp',
            rating: 4.7,
            img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        },
        {
            id: 4,
            name: 'Nusrat Jahan',
            subject: 'Biology Expert',
            experience: '4 Years Exp',
            rating: 5.0,
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80',
        },
    ];

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
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden gradient-bg">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-float animation-delay-300" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse-slow" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block mb-6"
                            >
                                <Badge variant="secondary" size="lg" className="animate-pulse">
                                    🏆 #1 Tuition Platform in Bangladesh
                                </Badge>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-heading text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                            >
                                Find the Perfect{' '}
                                <span className="gradient-text">
                                    Tutor
                                </span>{' '}
                                for Your Child
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Connect with thousands of qualified tutors across Bangladesh.
                                Whether you need help with Math, English, or Science, we have the perfect match.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12"
                            >
                                <Link to="/tuitions">
                                    <Button
                                        variant="gradient"
                                        size="xl"
                                        rightIcon={<Search className="w-5 h-5" />}
                                        className="shadow-glow"
                                    >
                                        Find a Tutor
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Become a Tutor
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-base-content/70">Verified Tutors</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-secondary" />
                                    </div>
                                    <span className="text-base-content/70">Free Registration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="text-base-content/70">Secure Platform</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative"
                        >
                            {/* Main Image Card */}
                            <Card
                                glass
                                className="overflow-hidden transform hover:scale-105 transition-transform duration-500"
                            >
                                <motion.img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Students learning together"
                                    className="w-full h-[500px] object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Card>

                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="avatar">
                                        <div className="w-14 h-14 rounded-full ring-4 ring-primary">
                                            <img
                                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                                                alt="Tutor"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-2xl font-bold gradient-text">
                                            5000+
                                        </h3>
                                        <p className="text-sm text-base-content/60">Active Tutors</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Rating Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -top-6 -right-6 glass rounded-2xl p-4 shadow-2xl"
                            >
                                <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 text-warning fill-warning" />
                                    <div>
                                        <p className="font-heading text-xl font-bold">4.9</p>
                                        <p className="text-xs text-base-content/60">Rating</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-base-200/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                            How It Works
                        </h2>
                        <p className="text-base-content/70 text-lg">
                            Getting started is easy. Follow these simple steps to find your perfect tutor or tuition job.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card glass hover className="text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <User size={40} className="text-primary" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">Create Account</h3>
                            <p className="text-base-content/70">
                                Register as a Student or Tutor. Set up your profile with details about your requirements or qualifications.
                            </p>
                        </Card>

                        <Card glass hover className="text-center">
                            <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-secondary" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">Search & Post</h3>
                            <p className="text-base-content/70">
                                Students post tuition needs. Tutors browse available jobs. Use our advanced filters to find the best match.
                            </p>
                        </Card>

                        <Card glass hover className="text-center">
                            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Award size={40} className="text-accent" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">Start Learning</h3>
                            <p className="text-base-content/70">
                                Connect, agree on terms, and start the journey. We ensure a secure and professional environment.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Latest Tuitions Section */}
            <section className="py-24 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-2 gradient-text">
                                Latest Tuitions
                            </h2>
                            <p className="text-base-content/70 text-lg">Recently posted tuition jobs near you</p>
                        </div>
                        <Link to="/tuitions">
                            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                View All
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {tuitions.map((job) => (
                            <Card
                                key={job.id}
                                glass
                                hover
                                title={job.subject}
                                subtitle={job.class}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-base-content/70">
                                        <MapPin size={16} className="text-primary" />
                                        <span className="text-sm">{job.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-heading text-xl font-bold text-primary">৳{job.salary}</span>
                                        <Badge variant="outline">{job.days}</Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge size="sm" variant="neutral">{job.gender} Tutor</Badge>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-base-300">
                                    <Link to={`/tuitions/${job.id}`} className="w-full block">
                                        <Button variant="primary" size="sm" fullWidth>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </motion.div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/tuitions">
                            <Button variant="outline" fullWidth>View All Tuitions</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top Tutors Section */}
            <section className="py-24 bg-base-200/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                            Top Rated Tutors
                        </h2>
                        <p className="text-base-content/70 text-lg">Meet our highly experienced and verified tutors</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {tutors.map((tutor) => (
                            <Card key={tutor.id} glass hover className="text-center">
                                <div className="avatar mb-4">
                                    <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-100">
                                        <img src={tutor.img} alt={tutor.name} />
                                    </div>
                                </div>
                                <h3 className="font-heading text-xl font-bold mb-1">{tutor.name}</h3>
                                <p className="text-sm text-base-content/60 mb-3">{tutor.subject}</p>
                                <p className="text-xs text-base-content/50 mb-4">{tutor.experience}</p>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Star size={16} className="text-warning fill-warning" />
                                    <span className="font-heading font-bold text-warning">{tutor.rating}</span>
                                </div>
                                <Link to={`/tutors/${tutor.id}`}>
                                    <Button size="sm" variant="outline" fullWidth>
                                        View Profile
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trusted Universities/Partners Marquee */}
            <section className="py-16 bg-base-100 overflow-hidden">
                <div className="container mx-auto px-4 mb-8 text-center">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">Trusted by students from top institutions</p>
                </div>
                <Marquee gradient={true} gradientColor={theme === 'dark' ? [17, 24, 39] : [255, 255, 255]} speed={40}>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/42/University_of_Dhaka_Logo.svg/1200px-University_of_Dhaka_Logo.svg.png" alt="DU" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">Dhaka University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Buet_logo.svg/1200px-Buet_logo.svg.png" alt="BUET" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">BUET</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/North_South_University_Logo.svg/1200px-North_South_University_Logo.svg.png" alt="NSU" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">NSU</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Brac_University_logo.png" alt="BRAC" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">BRAC University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Chittagong_University_logo.svg/1200px-Chittagong_University_logo.svg.png" alt="CU" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">Chittagong University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Rajshahi_University_Emblem.svg/800px-Rajshahi_University_Emblem.svg.png" alt="RU" className="h-16 w-auto object-contain" />
                        <span className="text-xl font-bold text-gray-400">Rajshahi University</span>
                    </div>
                </Marquee>
            </section>

            {/* Call To Action */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
                            <p className="text-lg text-primary-content/80 mb-10">
                                Join thousands of students and tutors on the most trusted tuition platform in Bangladesh.
                                Get started today for free!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <button className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none px-10">
                                        Register Now
                                    </button>
                                </Link>
                                <Link to="/login">
                                    <button className="btn btn-lg btn-outline text-white hover:bg-white/10 px-10">
                                        Log In
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
