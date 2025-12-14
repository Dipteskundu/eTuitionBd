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
            <section className="relative bg-base-100 dark:bg-gray-900 pt-20 pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            <Badge variant="secondary" size="lg" className="mb-6 animate-pulse">
                                #1 Tuition Platform in Bangladesh
                            </Badge>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                                Find the Perfect <br />
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Tutor for Your Child
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Connect with thousands of qualified student tutors and experienced teachers.
                                Whether you need help with Math, English, or Science, we have the right match for you.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Link to="/tuitions">
                                    <Button size="lg" className="rounded-full px-8">
                                        Find a Tutor <Search className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" size="lg" className="rounded-full px-8">
                                        Become a Tutor
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 bg-primary/10 rounded-full text-primary"><CheckCircle size={16} /></span>
                                    Verified Tutors
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="p-2 bg-secondary/10 rounded-full text-secondary"><CheckCircle size={16} /></span>
                                    Free Registration
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="p-2 bg-accent/10 rounded-full text-accent"><CheckCircle size={16} /></span>
                                    Secure Platform
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl skew-y-3 transform hover:rotate-2 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Student learning"
                                    className="rounded-xl w-full object-cover h-[400px]"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-base-100 p-4 rounded-xl shadow-xl flex items-center gap-4">
                                    <div className="avatar px-4">
                                        <div className="w-12 h-12 rounded-full border-4 border-primary">
                                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">5000+</h3>
                                        <p className="text-xs text-gray-500">Active Tutors</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-base-200/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-600 dark:text-gray-300">Getting started is easy. Follow these simple steps to find your perfect tutor or tuition job.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-base-100 p-8 rounded-2xl shadow-lg border border-base-200 text-center hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                                <User size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Create Account</h3>
                            <p className="text-gray-500 dark:text-gray-400">Register as a Student or Tutor. Set up your profile with details about your requirements or qualifications.</p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-base-100 p-8 rounded-2xl shadow-lg border border-base-200 text-center hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Search & Post</h3>
                            <p className="text-gray-500 dark:text-gray-400">Students post tuition needs. Tutors browse available jobs. Use our advanced filters to find the best match.</p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-base-100 p-8 rounded-2xl shadow-lg border border-base-200 text-center hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Start Learning</h3>
                            <p className="text-gray-500 dark:text-gray-400">Connect, agree on terms, and start the journey. We ensure a secure and professional environment.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Latest Tuitions Section */}
            <section className="py-24 bg-base-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-2">Latest Tuitions</h2>
                            <p className="text-gray-600 dark:text-gray-300">Recently posted tuition jobs near you</p>
                        </div>
                        <Link to="/tuitions">
                            <Button variant="ghost" className="hidden md:flex">View All <ArrowRight className="ml-2 w-4 h-4" /></Button>
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
                            <Card key={job.id} title={job.subject} subtitle={job.class} className="hover:-translate-y-2">
                                <div className="py-4 space-y-3">
                                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                                        <MapPin size={16} className="text-primary" /> {job.location}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-primary text-lg">৳ {job.salary}</span>
                                        <Badge variant="outline">{job.days}</Badge>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Badge size="sm" variant="neutral">{job.gender} Tutor</Badge>
                                    </div>
                                </div>
                                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                                    <Link to={`/tuitions/${job.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">View Details</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </motion.div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/tuitions">
                            <Button variant="outline" className="w-full">View All Tuitions</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top Tutors Section */}
            <section className="py-24 bg-base-200/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Top Rated Tutors</h2>
                        <p className="text-gray-600 dark:text-gray-300">Meet our highly experienced and verified tutors</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {tutors.map((tutor) => (
                            <motion.div variants={itemVariants} key={tutor.id} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative bg-base-100 p-6 rounded-xl border border-base-200 hover:border-transparent transition duration-300 text-center h-full flex flex-col items-center">
                                    <div className="avatar mb-4">
                                        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={tutor.img} alt={tutor.name} />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg">{tutor.name}</h3>
                                    <p className="text-primary text-sm font-medium mb-1">{tutor.subject}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">{tutor.experience}</p>
                                    <div className="flex items-center gap-1 mb-4 bg-yellow-100 px-2 py-1 rounded-lg">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-yellow-700">{tutor.rating}</span>
                                    </div>
                                    <Link to={`/tutors/${tutor.id}`} className="mt-auto">
                                        <Button size="sm" variant="ghost" className="group-hover:text-primary">View Profile</Button>
                                    </Link>
                                </div>
                            </motion.div>
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
