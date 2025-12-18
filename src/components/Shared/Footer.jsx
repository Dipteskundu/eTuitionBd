import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <h3 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                eTuitionBd
                            </h3>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            Connecting students with the best tutors across Bangladesh.
                            Quality education made accessible for everyone.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"><Facebook size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"><Instagram size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="/" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Home</Link></li>
                            <li><Link to="/tuitions" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Find Tuitions</Link></li>
                            <li><Link to="/tutors" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Hire Tutors</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Login / Register</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Support</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link to="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li className="flex flex-col md:flex-row items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-500 shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <span>123 Dhanmondi, Dhaka-1209, BD</span>
                            </li>
                            <li className="flex flex-col md:flex-row items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0">
                                    <Phone size={16} />
                                </div>
                                <span>+880 1234 567890</span>
                            </li>
                            <li className="flex flex-col md:flex-row items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-500 shrink-0">
                                    <Mail size={16} />
                                </div>
                                <span className="break-all">support@etuitionbd.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-10"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-center md:text-left">&copy; {new Date().getFullYear()} eTuitionBd. Crafted with ❤️ for education.</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Link to="#" className="hover:text-primary transition-colors font-medium">Privacy</Link>
                        <Link to="#" className="hover:text-primary transition-colors font-medium">Terms</Link>
                        <Link to="#" className="hover:text-primary transition-colors font-medium">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
