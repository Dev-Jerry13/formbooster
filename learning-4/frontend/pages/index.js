import Link from 'next/link';
import Layout from '../components/Layout';

const plans = [
  { name: 'Starter', price: '$9', features: ['100 responses', '24h delivery'] },
  { name: 'Growth', price: '$29', features: ['500 responses', 'Priority queue'] },
  { name: 'Scale', price: '$79', features: ['2000 responses', 'Dedicated support'] }
];

export default function Home() {
  return (
    <Layout title="FormBoost | Home">
      <section className="hero">
        <h1>FormBoost</h1>
        <p>Google Form response delivery service through a simple 2-step flow.</p>
        <Link href="/request" className="btn btn-primary">
          Start Request
        </Link>
      </section>

      <section>
        <h2>Pricing Plans</h2>
        <div className="grid">
          {plans.map((plan) => (
            <article key={plan.name} className="card">
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link href="/request" className="btn btn-secondary">
                Choose {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
