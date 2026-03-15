import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';

const initialForm = {
  fullName: '',
  email: '',
  formLink: '',
  plan: 'Starter',
  notes: ''
};

export default function RequestPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Unable to create order. Check backend connection.');
      }

      const data = await response.json();
      const orderId = data?._id || data?.order?._id || '';

      if (typeof window !== 'undefined') {
        localStorage.setItem('formboost_order_id', orderId);
      }

      toast.success('Request submitted. Continue to payment.');
      router.push(orderId ? `/payment?orderId=${orderId}` : '/payment');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="FormBoost | Request">
      <h1>Submit Request</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="fullName" value={form.fullName} onChange={updateField} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={updateField} required />
        </label>

        <label>
          Google Form link
          <input type="url" name="formLink" value={form.formLink} onChange={updateField} required />
        </label>

        <label>
          Plan
          <select name="plan" value={form.plan} onChange={updateField}>
            <option>Starter</option>
            <option>Growth</option>
            <option>Scale</option>
          </select>
        </label>

        <label>
          Notes
          <textarea name="notes" value={form.notes} onChange={updateField} rows={4} />
        </label>

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Submitting...' : 'Submit & Continue'}
        </button>
      </form>
    </Layout>
  );
}
