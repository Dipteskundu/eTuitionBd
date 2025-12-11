import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const { user, register: registerUser, googleLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role) {
            navigate(`/dashboard/${user.role}`);
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await registerUser(
                formData.name,
                formData.email,
                formData.password,
                formData.role,
                formData.phone,
                'https://via.placeholder.com/150'
            );
            toast.success('Registered successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            await googleLogin();
            toast.success('Registered with Google!');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Google registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 section-padding">
            <div className="card w-full max-w-lg shadow-2xl bg-white">
                <form onSubmit={handleRegister} className="card-body">
                    <h2 className="text-3xl font-bold text-center text-primary mb-4">Register</h2>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Full Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            className="input input-bordered"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            className="input input-bordered"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="input input-bordered"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+880 1234-567890"
                            className="input input-bordered"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Register as</span>
                        </label>
                        <select
                            name="role"
                            className="select select-bordered"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Register'}
                        </button>
                    </div>

                    <div className="divider">OR</div>

                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        className="btn btn-outline gap-2"
                    >
                        <FcGoogle size={24} />
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
