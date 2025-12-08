import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content">
            <div className="page-container section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">eTuitionBd</h3>
                        <p className="text-sm">
                            Connecting qualified tutors with students across Bangladesh.
                            Find the perfect tutor or post your tuition requirements today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
                            <li><Link to="/tuitions" className="hover:text-primary transition">Browse Tuitions</Link></li>
                            <li><Link to="/tutors" className="hover:text-primary transition">Find Tutors</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/register" className="hover:text-primary transition">Register</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition">Login</Link></li>
                            <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📍 Dhaka, Bangladesh</li>
                            <li>📧 info@etuitionbd.com</li>
                            <li>📱 +880 1234-567890</li>
                        </ul>

                        {/* Social Media */}
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-2xl hover:text-primary transition" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-2xl hover:text-primary transition" aria-label="X (Twitter)">
                                <FaXTwitter />
                            </a>
                            <a href="#" className="text-2xl hover:text-primary transition" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="text-2xl hover:text-primary transition" aria-label="GitHub">
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} eTuitionBd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
