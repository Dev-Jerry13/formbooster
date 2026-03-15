import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({ title = 'FormBoost', children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Google Form response delivery service" />
      </Head>
      <Navbar />
      <main className="container page">{children}</main>
    </>
  );
}
