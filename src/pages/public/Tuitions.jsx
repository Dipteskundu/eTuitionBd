import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { MapPin, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tuitions = () => {
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTuitions = async () => {
            try {
                const res = await axiosInstance.get('/tuitions');
                // The API returns { data: [...], total, page, ... } or just array based on implementation.
                // Checking server implementation: res.send({ data: result, total... })
                setTuitions(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch tuitions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTuitions();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[400px]"><span className="loading loading-bars loading-lg text-primary"></span></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">Available Tuitions</h1>

            {tuitions.length === 0 ? (
                <div className="text-center text-gray-500 text-xl py-10">No tuitions available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tuitions.map((tuition) => (
                        <div key={tuition._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200">
                            <div className="card-body">
                                <h2 className="card-title text-2xl text-secondary">
                                    {tuition.subject}
                                    <div className="badge badge-primary badge-outline text-xs">{tuition.class}</div>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{tuition.description || "No description provided."}</p>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{tuition.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <DollarSign size={16} className="text-primary" />
                                        <span className="font-bold">{tuition.salary} BDT/Month</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{tuition.daysPerWeek} Days/Week</span>
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-6">
                                    <Link to={`/tuitions/${tuition._id}`} className="btn btn-primary btn-sm w-full">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tuitions;
