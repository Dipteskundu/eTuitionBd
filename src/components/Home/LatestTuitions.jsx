import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBookOpen, FaMoneyBillWave } from 'react-icons/fa';

const LatestTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tuitions/latest`);
        if (response.data.success) {
          setTuitions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching latest tuitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="page-container section-padding bg-base-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Latest Tuition Jobs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse the most recent tuition opportunities posted by students and parents.
          Find the perfect match for your expertise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tuitions.map((tuition, index) => (
          <motion.div
            key={tuition._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h3 className="card-title text-xl text-secondary">{tuition.subject}</h3>
                <div className="badge badge-primary badge-outline">{tuition.class}</div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>{tuition.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMoneyBillWave className="text-primary" />
                  <span>{tuition.budget} BDT/month</span>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <Link to={`/tuitions/${tuition._id}`} className="btn btn-primary btn-sm w-full">
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/tuitions" className="btn btn-outline btn-primary px-8">
          Browse All Tuitions
        </Link>
      </div>
    </section>
  );
};

export default LatestTuitions;
