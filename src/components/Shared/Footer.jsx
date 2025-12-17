import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-neutral text-base-100 dark:bg-gray-900 border-t border-base-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                            eTuitionBd
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Connecting students with the best tutors across Bangladesh.
                            Quality education made accessible for everyone.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/tuitions" className="hover:text-primary transition-colors">Find Tuitions</Link></li>
                            <li><Link to="/tutors" className="hover:text-primary transition-colors">Hire Tutors</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">Login / Register</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <MapPin size={18} className="text-primary" />
                                <span>123 Dhanmondi, Dhaka-1209, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={18} className="text-primary" />
                                <span>+880 1234 567890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={18} className="text-primary" />
                                <span>support@etuitionbd.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="h-px bg-gray-800 my-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} eTuitionBd. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
