import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const RevenueHistory = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments/my-transactions`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="page-container section-padding">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-primary">Revenue History</h1>
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-figure text-primary-content">
              <FaMoneyCheckAlt size={32} />
            </div>
            <div className="stat-title text-primary-content/80">Total Earnings</div>
            <div className="stat-value">{totalRevenue} BDT</div>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500">No transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border border-base-200">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Tuition</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id} className="hover">
                  <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="font-mono text-xs">{txn.transactionId}</td>
                  <td>
                    <div className="font-bold">{txn.application?.tuition?.subject}</div>
                    <div className="text-xs opacity-50">{txn.application?.tuition?.class}</div>
                  </td>
                  <td className="font-bold text-success">+{txn.amount} BDT</td>
                  <td>
                    <span className="badge badge-success badge-outline">Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevenueHistory;
