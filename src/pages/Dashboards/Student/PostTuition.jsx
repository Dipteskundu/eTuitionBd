import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';

const PostTuition = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    location: '',
    budget: '',
    schedule: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tuitions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Tuition posted successfully! Waiting for admin approval.');
        navigate('/dashboard/student/my-tuitions');
      }
    } catch (error) {
      console.error('Error posting tuition:', error);
      toast.error(error.response?.data?.message || 'Failed to post tuition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container section-padding">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">Post New Tuition</h1>
        <p className="text-gray-600 text-center mb-8">
          Fill out the form below to find the perfect tutor for your needs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-semibold">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. Mathematics"
                className="input input-bordered w-full"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Class/Grade</label>
              <input
                type="text"
                name="class"
                placeholder="e.g. Class 10"
                className="input input-bordered w-full"
                value={formData.class}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-semibold">Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Dhanmondi, Dhaka"
                className="input input-bordered w-full"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label font-semibold">Budget (BDT/Month)</label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 5000"
                className="input input-bordered w-full"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label font-semibold">Schedule</label>
            <input
              type="text"
              name="schedule"
              placeholder="e.g. 3 days/week, 5:00 PM"
              className="input input-bordered w-full"
              value={formData.schedule}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold">Description & Requirements</label>
            <textarea
              name="description"
              placeholder="Describe your requirements, preferred tutor gender, etc."
              className="textarea textarea-bordered h-32 w-full"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full text-lg"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Post Tuition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTuition;
