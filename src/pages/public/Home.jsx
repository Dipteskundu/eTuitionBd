import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { Search, User, Award, CheckCircle, ArrowRight, Star, MapPin, BookOpen, Monitor, Calculator, Languages, Music, Palette, Dumbbell, Code, Shield, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { ThemeContext } from '../../context/ThemeContext';
import useTitle from '../../hooks/useTitle';

const Home = () => {
    useTitle('Home');
    const { theme } = useContext(ThemeContext);
    // Mock Data
    const [tuitions, setTuitions] = React.useState([]);
    const [tutors, setTutors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Latest Tuitions
                const tuitionRes = await axiosInstance.get('/tuitions');
                // The API returns { data: [], total: ... }
                const tuitionData = tuitionRes.data.data || [];
                setTuitions(tuitionData.slice(0, 3)); // Show only 3 latest

                // Fetch Top Tutors (Just fetching all and taking first 4 for now)
                const tutorRes = await axiosInstance.get('/tutors');
                // The API now returns { data: [], total: number } or similar, let's verify in index.js but assuming standard structure
                // Adjusting based on common pattern: res.data.data or res.data
                const tutorList = Array.isArray(tutorRes.data) ? tutorRes.data : (tutorRes.data.data || tutorRes.data.result || []);
                setTutors(tutorList.slice(0, 4));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const Counter = ({ target, duration = 2 }) => {
        const [count, setCount] = React.useState(0);
        const [hasAnimated, setHasAnimated] = React.useState(false);

        return (
            <motion.span
                whileInView={() => {
                    if (!hasAnimated) {
                        setHasAnimated(true);
                        let start = 0;
                        const end = parseInt(target.replace(/\D/g, ''));
                        const increment = end / (duration * 60);
                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                setCount(end);
                                clearInterval(timer);
                            } else {
                                setCount(Math.floor(start));
                            }
                        }, 1000 / 60);
                    }
                }}
            >
                {count}{target.includes('+') ? '+' : ''}
            </motion.span>
        );
    };

    const SUBJECTS = [
        { name: 'Mathematics', icon: Calculator, count: '120+ Tutors' },
        { name: 'English', icon: Languages, count: '85+ Tutors' },
        { name: 'Science', icon: Zap, count: '95+ Tutors' },
        { name: 'Computer', icon: Monitor, count: '60+ Tutors' },
        { name: 'Arts', icon: Palette, count: '40+ Tutors' },
        { name: 'Music', icon: Music, count: '25+ Tutors' },
        { name: 'Programming', icon: Code, count: '55+ Tutors' },
        { name: 'Exam Prep', icon: BookOpen, count: '70+ Tutors' },
    ];

    const FEATURES = [
        { title: 'Verified Tutors', desc: 'Every tutor passes a strict background check.', icon: Shield },
        { title: 'Flexible Scheduling', desc: 'Book sessions that fit your busy routine.', icon: Clock },
        { title: 'Affordable Rates', desc: 'Quality education regardless of your budget.', icon: Award },
        { title: 'Expert Guidance', desc: 'Learn from industry professionals and scholars.', icon: User },
    ];

    const TESTIMONIALS = [
        { name: 'Sarah Khan', role: 'Parent', content: "Found an amazing math tutor for my son within 24 hours. His grades have improved significantly!", rating: 5 },
        { name: 'Rahim Uddin', role: 'Student', content: "The platform is so easy to use. I found a physics tutor who explains complex concepts simply.", rating: 5 },
        { name: 'Anika Rahman', role: 'Tutor', content: "eTuitionBd helped me connect with serious students. The payment system is secure and hassle-free.", rating: 5 },
    ];

    const FAQS = [
        { q: "How do I find a tutor?", a: "Simply create an account, post your tuition requirements, or browse our list of verified tutors and filter by subject and location." },
        { q: "Is the platform free?", a: "Registration is free for both students and tutors. Tutors pay a small commission only on successful tuition confirmations." },
        { q: "Are the tutors verified?", a: "Yes, we manually verify every tutor's educational background and identity to ensure safety and quality." },
        { q: "Can I change my tutor?", a: "Absolutely. If you're not satisfied, you can efficiently search for another tutor or contact support for assistance." },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-primary/5">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <motion.div
                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            x: [0, -20, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"
                    />
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


                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="font-heading text-4xl lg:text-5xl font-bold mb-6 leading-tight mt-2"
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
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12"
                            >
                                <motion.div variants={itemVariants}>
                                    <Link to="/tuitions">
                                        <Button
                                            variant="gradient"
                                            size="xl"
                                            rightIcon={<Search className="w-5 h-5" />}
                                            className="shadow-glow hover:scale-105 transition-transform"
                                        >
                                            Find a Tutor
                                        </Button>
                                    </Link>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Link to="/register">
                                        <Button
                                            variant="outline"
                                            size="xl"
                                            rightIcon={<ArrowRight className="w-5 h-5" />}
                                            className="hover:scale-105 transition-transform"
                                        >
                                            Become a Tutor
                                        </Button>
                                    </Link>
                                </motion.div>
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
                                className="overflow-hidden shadow-2xl relative z-10"
                            >
                                <motion.img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Students learning together"
                                    className="w-full h-[500px] object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                />
                            </Card>

                            {/* Floating Stats Card (Top Left reflex) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-10 -left-18 glass rounded-2xl p-6 shadow-2xl animate-float-slow z-20"
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
                                        <h3 className="font-heading text-2xl font-bold text-primary">
                                            <Counter target="5000+" />
                                        </h3>
                                        <p className="text-sm text-base-content/60">Active Tutors</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Round Badge (Bottom Right reflex) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                                className="absolute -top-3 -right-4 z-20"
                            >
                                <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-2xl animate-pulse ring-4 ring-white/30">
                                    <div className="text-center text-black">
                                        <span className="text-2xl">🏆</span>
                                        <p className="text-[10px] font-bold leading-tight px-1">#1 Platform in BD</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Counter Section */}
            <section className="py-12 bg-primary text-primary-content">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-content/20">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <h3 className="text-4xl font-bold mb-1"><Counter target="5000+" /></h3>
                            <p className="text-sm opacity-80">Active Tutors</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <h3 className="text-4xl font-bold mb-1"><Counter target="12000+" /></h3>
                            <p className="text-sm opacity-80">Students</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                            <h3 className="text-4xl font-bold mb-1"><Counter target="8500+" /></h3>
                            <p className="text-sm opacity-80">Tuition Jobs</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                            <h3 className="text-4xl font-bold mb-1">4.8/5</h3>
                            <p className="text-sm opacity-80">Average Rating</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Browse by Subject Section */}
            <section className="py-24 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                            Browse by Subject
                        </h2>
                        <p className="text-base-content/70 text-lg">Find tutors specialized in your area of study</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {SUBJECTS.map((subject, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                            >
                                <Card className="card-hover h-full flex flex-col items-center text-center p-6 cursor-pointer border-base-200 hover:border-primary transition-all duration-300">
                                    <motion.div
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner"
                                    >
                                        <subject.icon size={32} />
                                    </motion.div>
                                    <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
                                    <p className="text-xs text-base-content/50">{subject.count}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
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

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div variants={itemVariants}>
                            <Card glass className="card-hover text-center p-8">
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
                                    <User size={40} className="text-primary" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold mb-4">Create Account</h3>
                                <p className="text-base-content/70">
                                    Register as a Student or Tutor. Set up your profile with details about your requirements or qualifications.
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card glass className="card-hover text-center p-8">
                                <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
                                    <Search size={40} className="text-secondary" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold mb-4">Search & Post</h3>
                                <p className="text-base-content/70">
                                    Students post tuition needs. Tutors browse available jobs. Use our advanced filters to find the best match.
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card glass className="card-hover text-center p-8">
                                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
                                    <Award size={40} className="text-accent" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold mb-4">Start Learning</h3>
                                <p className="text-base-content/70">
                                    Connect, agree on terms, and start the journey. We ensure a secure and professional environment.
                                </p>
                            </Card>
                        </motion.div>
                    </motion.div>
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
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {tuitions.map((job) => (
                            <motion.div key={job._id} variants={itemVariants}>
                                <Card
                                    glass
                                    className="card-hover"
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
                                            <Badge variant="outline">{job.daysPerWeek} days/week</Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge size="sm" variant="neutral">{job.genderPreference} Tutor</Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-base-300">
                                        <Link to={`/tuitions/${job._id}`} className="w-full block">
                                            <Button variant="primary" size="sm" fullWidth className="hover:scale-105 transition-transform">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/tuitions">
                            <Button variant="outline" fullWidth>View All Tuitions</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-base-200/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 gradient-text">
                                Why Choose eTuitionBd?
                            </h2>
                            <p className="text-lg text-base-content/70 mb-8 leading-relaxed">
                                We go beyond just connecting you. We ensure a safe, quality, and effective learning environment for everyone.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {FEATURES.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4"
                                    >
                                        <div className="mt-1">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                <feature.icon size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                                            <p className="text-sm text-base-content/60">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Students studying"
                                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* Top Tutors Section */}
            <section className="py-24 bg-base-200/30">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-16">
                        <div className="text-center md:text-left flex-1">
                            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                                Top Rated Tutors
                            </h2>
                            <p className="text-base-content/70 text-lg">Meet our highly experienced and verified tutors</p>
                        </div>
                        <Link to="/tutors">
                            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                View All
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {tutors.length > 0 ? (
                            tutors.map((tutor) => (
                                <motion.div key={tutor._id} variants={itemVariants}>
                                    <Card glass className="card-hover text-center p-6 h-full flex flex-col items-center">
                                        <div className="avatar mb-4">
                                            <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-2 ring-offset-base-100">
                                                <img src={tutor.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt={tutor.displayName} className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                        <h3 className="font-heading text-xl font-bold mb-1">{tutor.displayName}</h3>
                                        <p className="text-sm text-base-content/60 mb-3">{tutor.expertise?.[0] || 'Tutor'}</p>
                                        <p className="text-xs text-base-content/50 mb-4">{tutor.experience || 'Experienced'}</p>
                                        <div className="flex items-center justify-center gap-2 mb-4 mt-auto">
                                            <Star size={16} className="text-warning fill-warning" />
                                            <span className="font-heading font-bold text-warning">{tutor.rating || 'N/A'}</span>
                                        </div>
                                        <Link to={`/tutors/${tutor._id}`} className="w-full">
                                            <Button size="sm" variant="outline" fullWidth className="hover:scale-105 transition-transform">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-xl text-base-content/50">No top rated tutors found at the moment.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>



            {/* Testimonials Section */}
            <section className="py-24 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                            What People Say
                        </h2>
                        <p className="text-base-content/70 text-lg">Real stories from our community</p>
                    </div>

                    <div className="space-y-12 overflow-hidden">
                        {/* Row 1: Left to Right */}
                        <Marquee
                            gradient={false}
                            speed={40}
                            direction="right"
                            pauseOnHover={true}
                            className="pb-4"
                        >
                            <div className="flex gap-8 px-4">
                                {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                                    <div key={`row1-${idx}`} className="w-[350px] md:w-[450px]">
                                        <Card glass className="h-full relative p-8 card-hover hover:border-primary/50 transition-colors">
                                            <div className="absolute top-6 right-8 opacity-10">
                                                <span className="text-6xl font-serif">"</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={16} className="text-warning fill-warning" />
                                                ))}
                                            </div>
                                            <p className="text-base-content/80 mb-6 italic line-clamp-3 md:line-clamp-none">
                                                {testimonial.content}
                                            </p>
                                            <div className="flex items-center gap-4 mt-auto">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {testimonial.name[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{testimonial.name}</h4>
                                                    <p className="text-xs text-base-content/50 uppercase">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </Marquee>

                        {/* Row 2: Right to Left */}

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-base-200/30">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 gradient-text">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-4"
                    >
                        {FAQS.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                            >
                                <div className="collapse collapse-plus bg-base-100 border border-base-200 rounded-xl card-hover">
                                    <input type="radio" name="my-accordion-3" defaultChecked={idx === 0} />
                                    <div className="collapse-title text-xl font-medium">
                                        {faq.q}
                                    </div>
                                    <div className="collapse-content">
                                        <p className="text-base-content/70">{faq.a}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trusted Universities/Partners Marquee */}
            <section className="py-16 bg-base-100 overflow-hidden">
                <div className="container mx-auto px-4 mb-8 text-center">
                    <p className="text-2xl font-semibold text-primary uppercase tracking-wider">Trusted by students from top institutions</p>
                </div>
                <Marquee gradient={false} speed={40}>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">Dhaka University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">NSU</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">BRAC University</span>
                    </div>

                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">Jahangirnagar University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">Jagannath University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">Ahsanullah University of Science and Technology</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">American International University-Bangladesh</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">Daffodil International University</span>
                    </div>
                    <div className="flex items-center gap-12 mx-6 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">

                        <span className="text-xl font-bold text-base-content/60">International Islamic University Chittagong</span>
                    </div>
                </Marquee>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-primary shadow-xl">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>

                        <div className="relative z-10 mx-auto max-w-4xl px-8 py-16 text-center text-white md:px-16">
                            <h2 className="mb-6 font-heading text-3xl font-bold leading-tight md:text-5xl">
                                Ready to Transform Your Learning Journey?
                            </h2>
                            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
                                Join thousands of students and tutors on <span className="font-bold">eTuitionBd</span>.
                                Experience the new standard of education today.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link to="/register">
                                    <Button
                                        size="xl"
                                        className="border-none bg-secondary font-bold text-primary hover:bg-gray-600 hover:scale-105 shadow-lg"
                                        rightIcon={<ArrowRight size={20} />}
                                    >
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        className="border-white text-white hover:bg-white/20 hover:border-white hover:text-white"
                                    >
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Home;
