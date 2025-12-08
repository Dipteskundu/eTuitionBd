import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaChalkboardTeacher } from 'react-icons/fa';

const LatestTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/tutors/latest`);
        if (response.data.success) {
          setTutors(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching latest tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <section className="page-container section-padding bg-base-200/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Top Rated Tutors</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with highly qualified and verified tutors ready to help you excel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutors.map((tutor, index) => (
          <motion.div
            key={tutor._id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
          >
            <figure className="px-10 pt-10">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={tutor.photoURL || "https://via.placeholder.com/150"} alt={tutor.name} />
                </div>
              </div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-lg">{tutor.name}</h3>
              <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                <span className="text-gray-400 ml-1">(5.0)</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {tutor.bio || "Experienced tutor passionate about teaching."}
              </p>
              <div className="card-actions mt-4">
                <Link to={`/tutors/${tutor._id}`} className="btn btn-sm btn-outline btn-primary">
                  View Profile
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/tutors" className="btn btn-primary px-8">
          Find More Tutors
        </Link>
      </div>
    </section>
  );
};

export default LatestTutors;
