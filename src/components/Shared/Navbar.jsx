import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Theme State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'mytheme');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const localTheme = localStorage.getItem('theme');
        document.querySelector('html').setAttribute('data-theme', localTheme);
    }, [theme]);

    const handleToggle = () => {
        setTheme(theme === 'mytheme' ? 'dark' : 'mytheme');
    };

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navLinks = (
        <>
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition'}>
                Home
            </NavLink>
            <NavLink to="/tuitions" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition'}>
                Tuitions
            </NavLink>
            <NavLink to="/tutors" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition'}>
                Tutors
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition'}>
                About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary transition'}>
                Contact
            </NavLink>
        </>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="page-container">
                <div className="navbar px-0">
                    {/* Logo */}
                    <div className="navbar-start">
                        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                            <span className="text-3xl">📚</span>
                            <span>eTuitionBd</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-4 text-base">
                            {navLinks}
                        </ul>
                    </div>

                    {/* Auth Section */}
                    <div className="navbar-end gap-2">
                        {/* Theme Toggle */}
                        <button onClick={handleToggle} className="btn btn-ghost btn-circle">
                            {theme === 'mytheme' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>
                        {user ? (
                            <>
                                <Link to={`/dashboard/${user.role}`} className="btn btn-primary btn-sm">
                                    Dashboard
                                </Link>
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img src={user.photoURL || 'https://via.placeholder.com/150'} alt={user.name} />
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                        <li><span className="font-semibold">{user.name}</span></li>
                                        <li><span className="text-xs text-gray-500">{user.email}</span></li>
                                        <li><Link to={`/dashboard/${user.role}/profile`}>Profile Settings</Link></li>
                                        <li><button onClick={handleLogout} className="text-red-600">Logout</button></li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="btn btn-ghost lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden pb-4">
                        <ul className="menu menu-vertical gap-2">
                            {navLinks}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
