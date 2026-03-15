import '../styles/globals.css';
import '../styles/pages.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </>
  );
}
