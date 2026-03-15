import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/request', label: 'Request' },
  { href: '/payment', label: 'Payment' },
  { href: '/admin/login', label: 'Admin Login' },
  { href: '/admin', label: 'Admin Dashboard' }
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          FormBoost
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
