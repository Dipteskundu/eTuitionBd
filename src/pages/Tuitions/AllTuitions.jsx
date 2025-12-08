import { useState, useEffect } from 'react';
import { getTuitions } from '../../api/tuitionApi';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBookOpen, FaMoneyBillWave, FaFilter } from 'react-icons/fa';
import Loading from '../../components/Shared/Loading';

const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    class: '',
    location: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        order: filters.order,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.class && { class: filters.class }),
        ...(filters.location && { location: filters.location })
      };

      const response = await getTuitions(params);

      if (response.success) {
        setTuitions(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching tuitions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions();
  }, [pagination.page, debouncedSearch, filters.subject, filters.class, filters.location, filters.sortBy, filters.order]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo(0, 0);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      subject: '',
      class: '',
      location: '',
      sortBy: 'createdAt',
      order: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="page-container section-padding bg-base-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">Browse Tuitions</h1>

        {/* Search Bar */}
        <div className="form-control w-full md:w-auto">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search subject or location..."
              className="input input-bordered w-full md:w-80"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <button className="btn btn-square btn-primary">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FaFilter /> Filters
              </h3>
              <button onClick={clearFilters} className="text-sm text-error hover:underline">Clear All</button>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Sort By</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="createdAt">Date Posted</option>
                  <option value="budget">Budget</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Order</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="order"
                  value={filters.order}
                  onChange={handleFilterChange}
                >
                  <option value="desc">High to Low / Newest</option>
                  <option value="asc">Low to High / Oldest</option>
                </select>
              </div>

              <div className="divider"></div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Class/Grade</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="class"
                  value={filters.class}
                  onChange={handleFilterChange}
                >
                  <option value="">All Classes</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="HSC">HSC</option>
                  <option value="O Level">O Level</option>
                  <option value="A Level">A Level</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Math</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Accounting">Accounting</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">All Locations</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tuitions Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : tuitions.length === 0 ? (
            <div className="text-center py-20 bg-base-100 rounded-xl shadow border border-base-200">
              <h3 className="text-xl font-bold text-gray-500">No tuitions found matching your criteria.</h3>
              <button onClick={clearFilters} className="btn btn-link">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tuitions.map((tuition) => (
                <div key={tuition._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-200">
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="badge badge-primary badge-outline">{tuition.class}</div>
                      <div className="text-sm text-gray-500">{new Date(tuition.createdAt).toLocaleDateString()}</div>
                    </div>
                    <h2 className="card-title text-2xl mb-2">{tuition.subject}</h2>

                    <div className="space-y-2 mb-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{tuition.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-secondary" />
                        <span className="font-bold">{tuition.budget} BDT/month</span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-auto">
                      <Link to={`/tuitions/${tuition._id}`} className="btn btn-primary w-full">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && tuitions.length > 0 && (
            <div className="flex justify-center mt-10">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  «
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`join-item btn ${pagination.page === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTuitions;
