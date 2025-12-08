import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaChartLine, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const ReportsAnalytics = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments/transactions/admin/all`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.data.success) {
          setTransactions(response.data.data);
          setTotalEarnings(response.data.totalEarnings);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="page-container section-padding">
      <h1 className="text-3xl font-bold mb-8 text-primary">Reports & Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-figure text-primary-content">
              <FaMoneyBillWave size={32} />
            </div>
            <div className="stat-title text-primary-content/80">Total Platform Earnings</div>
            <div className="stat-value text-4xl">{totalEarnings.toLocaleString()} BDT</div>
            <div className="stat-desc text-primary-content/70">Lifetime revenue</div>
          </div>
        </div>

        <div className="stats shadow bg-secondary text-secondary-content">
          <div className="stat">
            <div className="stat-figure text-secondary-content">
              <FaChartLine size={32} />
            </div>
            <div className="stat-title text-secondary-content/80">Total Transactions</div>
            <div className="stat-value text-4xl">{transactions.length}</div>
            <div className="stat-desc text-secondary-content/70">Successful payments</div>
          </div>
        </div>

        <div className="stats shadow bg-accent text-accent-content">
          <div className="stat">
            <div className="stat-figure text-accent-content">
              <FaCalendarAlt size={32} />
            </div>
            <div className="stat-title text-accent-content/80">Latest Transaction</div>
            <div className="stat-value text-xl">
              {transactions.length > 0
                ? new Date(transactions[0].createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
            <div className="stat-desc text-accent-content/70">Date of last payment</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-base-100 shadow-xl rounded-xl border border-base-200 overflow-hidden">
        <div className="p-6 border-b border-base-200">
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Student</th>
                <th>Tutor</th>
                <th>Tuition</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="hover">
                  <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="font-mono text-xs">{txn.transactionId || txn.stripePaymentId?.slice(-8)}</td>
                  <td>
                    <div className="font-semibold">{txn.student?.name}</div>
                    <div className="text-xs text-gray-500">{txn.student?.email}</div>
                  </td>
                  <td>
                    <div className="font-semibold">{txn.tutor?.name}</div>
                    <div className="text-xs text-gray-500">{txn.tutor?.email}</div>
                  </td>
                  <td>
                    <div className="font-semibold">{txn.tuition?.subject}</div>
                    <div className="text-xs text-gray-500">{txn.tuition?.class}</div>
                  </td>
                  <td className="font-bold text-success">+{txn.amount} BDT</td>
                  <td>
                    <span className="badge badge-success badge-outline capitalize">
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
