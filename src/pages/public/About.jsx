import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Shield, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';

const About = () => {
    const features = [
        { icon: Users, text: "Verified Tutors and Students" },
        { icon: Shield, text: "Secure Payment Processing" },
        { icon: BookOpen, text: "Easy Tuition Management" },
        { icon: CheckCircle, text: "Dedicated Support" }
    ];

    return (
        <div className="min-h-screen bg-base-100 py-16 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-float animation-delay-300" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-6">About eTuitionBd</h1>
                        <p className="text-xl text-base-content/70">
                            Empowering education through connection.
                        </p>
                    </motion.div>

                    <Card glass className="p-8 md:p-12">
                        <div className="space-y-8 text-lg text-base-content/80 leading-relaxed">
                            <p>
                                Welcome to <strong className="text-primary">eTuitionBd</strong>, your premier platform for connecting students with qualified tutors.
                                Our mission is to bridge the gap between eager learners and expert educators, making quality education accessible to everyone.
                            </p>
                            <p>
                                Whether you are a student looking for help with your studies or a tutor looking to share your knowledge and earn,
                                eTuitionBd provides a secure, easy-to-use, and efficient environment for all your tutoring needs.
                            </p>

                            <div className="mt-10 p-8 bg-base-100/50 rounded-2xl border border-base-200">
                                <h2 className="text-2xl font-bold mb-6 gradient-text">Why Choose Us?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.1) }}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors"
                                        >
                                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                <feature.icon size={20} />
                                            </div>
                                            <span className="font-medium">{feature.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default About;
