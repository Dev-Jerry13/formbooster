import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const orderId = useMemo(() => {
    if (router.query.orderId) {
      return router.query.orderId;
    }

    if (typeof window !== 'undefined') {
      return localStorage.getItem('formboost_order_id') || '';
    }

    return '';
  }, [router.query.orderId]);

  const verifyPayment = async () => {
    if (!orderId) {
      toast.error('No order ID found. Create an order first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed.');
      }

      toast.success('Payment verified successfully');
    } catch (error) {
      toast.error(error.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="FormBoost | Payment">
      <h1>Payment</h1>
      <div className="card">
        <p>This is a development mock payment flow.</p>
        <p>
          <strong>Order ID:</strong> {orderId || 'Not set'}
        </p>
        <button className="btn btn-primary" onClick={verifyPayment} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Payment'}
        </button>
      </div>
    </Layout>
  );
}
