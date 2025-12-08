import { useEffect, useState } from 'react';
import { getUsers } from '../../api/userApi';

const AllTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getUsers();
        setTutors(data);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
        setError('Failed to load tutors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);



  return (
    <div className="page-container section-padding">
      <h1 className="text-3xl font-bold mb-8 text-primary">All Tutors</h1>

      {loading && <div className="text-center py-20">Loading Tutors...</div>}

      {error && <div className="text-center py-10 text-red-500 font-bold">{error}</div>}

      {!loading && !error && tutors.length === 0 ? (
        <p className="text-gray-600">No tutors found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
              <figure className="px-5 pt-8">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={tutor.photoURL || 'https://via.placeholder.com/150'}
                      alt={tutor.name}
                      className="object-cover"
                    />
                  </div>
                </div>
              </figure>
              <div className="card-body items-center text-center p-6">
                <h2 className="card-title text-2xl font-bold">{tutor.name}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tutor.location || 'Location not specified'}
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="badge badge-secondary badge-outline">{tutor.tutorProfile?.experience || 'N/A'} Exp.</div>
                  <div className="badge badge-accent badge-outline">{tutor.tutorProfile?.qualifications?.split(',')[0] || 'Tutor'}</div>
                </div>

                <p className="text-sm text-base-content/70 line-clamp-3 mb-4 h-15">
                  "{tutor.tutorProfile?.bio || 'No bio available for this tutor.'}"
                </p>

                <div className="w-full text-left">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Teaches</p>
                  <div className="flex flex-wrap gap-2">
                    {tutor.tutorProfile?.subjects?.slice(0, 4).map((sub, idx) => (
                      <span key={idx} className="badge badge-ghost badge-sm bg-base-200">{sub}</span>
                    ))}
                    {(tutor.tutorProfile?.subjects?.length || 0) > 4 && (
                      <span className="badge badge-ghost badge-sm text-xs">+{tutor.tutorProfile.subjects.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="card-actions w-full mt-6">
                  <button className="btn btn-primary w-full shadow-lg shadow-primary/30">View Full Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTutors;
