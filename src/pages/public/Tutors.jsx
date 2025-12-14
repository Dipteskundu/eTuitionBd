import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { MapPin, Star, BadgeCheck, Book, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tutors = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const res = await axiosInstance.get('/tutors');
                setTutors(res.data || []);
            } catch (error) {
                console.error("Failed to fetch tutors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]"><span className="loading loading-spinner loading-lg text-secondary"></span></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-secondary">Find Your Tutor</h1>

            {tutors.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-10">No tutors currently available.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tutors.map((tutor) => (
                        <div key={tutor._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all border border-base-200 group">
                            <figure className="px-4 pt-4 relative">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                        {tutor.photoURL ? (
                                            <img src={tutor.photoURL} alt={tutor.displayName} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                                                <User size={48} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {tutor.verified && (
                                    <div className="absolute top-6 right-6 tooltip" data-tip="Verified Tutor">
                                        <BadgeCheck className="text-blue-500 fill-white" size={24} />
                                    </div>
                                )}
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-xl font-bold">{tutor.displayName}</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin size={14} /> {tutor.location}
                                </p>

                                <div className="flex flex-wrap gap-1 justify-center mt-2">
                                    {tutor.expertise && tutor.expertise.map((exp, idx) => (
                                        <span key={idx} className="badge badge-secondary badge-outline badge-sm">{exp}</span>
                                    ))}
                                </div>

                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{tutor.bio || "No bio available."}</p>

                                <div className="card-actions mt-4 w-full">
                                    <Link to={`/tutors/${tutor._id}`} className="btn btn-outline btn-secondary btn-sm w-full">View Profile</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tutors;
