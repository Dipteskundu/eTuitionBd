import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { User, Phone, Mail, ArrowLeft, MapPin, Shield, GraduationCap } from 'lucide-react';
import useToast from '../../../hooks/useToast';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const StudentProfileDetails = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { error } = useToast();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await axiosSecure.get(`/users/${email}`);
                setStudent(res.data);
            } catch (err) {
                console.error(err);
                error('Failed to fetch student details');
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchStudent();
        }
    }, [email, axiosSecure]);

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    if (!student) return <div className="p-10 text-center text-error">Student not found.</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2 mb-4">
                <ArrowLeft size={18} /> Back to Tuitions
            </button>

            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Profile Image */}
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {student.photoURL ? (
                                    <img src={student.photoURL} alt={student.name} />
                                ) : (
                                    <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-4xl font-bold">
                                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h2 className="card-title text-3xl justify-center md:justify-start">
                                    {student.name}
                                    <div className="badge badge-secondary">{student.role ? student.role.toUpperCase() : 'STUDENT'}</div>
                                </h2>
                                <p className="text-gray-500">Student Profile</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Mail className="text-primary" size={20} />
                                    <span className="font-medium">{student.email}</span>
                                </div>
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <Phone className="text-primary" size={20} />
                                    <span className="font-medium">{student.phone || 'No phone number provided'}</span>
                                </div>
                                {/* Add more fields if available in user object */}
                                {student.location && (
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <GraduationCap className="text-primary" size={20} />
                                        <span className="font-medium">{student.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert alert-info shadow-sm">
                <div>
                    <span className="font-bold">Admin Note:</span> verified email address via Firebase Authentication.
                </div>
            </div>
        </div>
    );
};

export default StudentProfileDetails;
