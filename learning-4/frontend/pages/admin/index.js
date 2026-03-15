import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';

const statuses = ['Pending', 'Approved', 'Rejected', 'Confirmed'];

export default function AdminDashboardPage() {
  const [token, setToken] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('formboost_admin_token') : '';
    if (!stored) {
      toast.error('Please login first');
      router.replace('/admin/login');
      return;
    }
    setToken(stored);
  }, [router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load orders');
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : data?.orders || []);
      } catch (error) {
        toast.error(error.message || 'Could not fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status } : order)));
      toast.success(`Order marked ${status}`);
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  return (
    <Layout title="FormBoost | Admin Dashboard">
      <h1>Admin Dashboard</h1>
      <div className="card">
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.fullName || 'N/A'}</td>
                    <td>{order.email || 'N/A'}</td>
                    <td>{order.plan || 'N/A'}</td>
                    <td>
                      <select
                        value={order.status || 'Pending'}
                        onChange={(event) => updateStatus(order._id, event.target.value)}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
