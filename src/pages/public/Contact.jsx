import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Contact = () => {
    return (
        <div className="min-h-screen bg-base-100 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-float animation-delay-200" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Get in Touch</h1>
                    <p className="text-lg text-base-content/70">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Card glass className="h-full p-8 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold mb-6 text-primary">Contact Information</h2>
                            <p className="text-base-content/70 mb-8">
                                Whether you're a student looking for the right tutor or a teacher wanting to join our platform, our team is here to help.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email Us</h3>
                                        <p className="text-base-content/70">support@etuitionbd.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Call Us</h3>
                                        <p className="text-base-content/70">+880 1234 567890</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Visit Us</h3>
                                        <p className="text-base-content/70">Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card glass className="p-8">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Name"
                                        placeholder="Your Name"
                                        fullWidth
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="your@email.com"
                                        fullWidth
                                    />
                                </div>

                                <Input
                                    label="Subject"
                                    placeholder="How can we help?"
                                    fullWidth
                                />

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium text-base-content/80">Message</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-base-100/50"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>

                                <Button size="lg" fullWidth rightIcon={Send} className="mt-4">
                                    Send Message
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
