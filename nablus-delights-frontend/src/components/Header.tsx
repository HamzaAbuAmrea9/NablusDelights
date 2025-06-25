// File: src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors">
          Nablus Delights
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative text-gray-600 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <nav>
            {user ? (
              <ul className="flex items-center space-x-4 sm:space-x-6">
                {user.role === 'Admin' && (
                  <li>
                    <Link href="/admin" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <span className="text-gray-700 hidden sm:inline">Welcome, {user.unique_name}!</span>
                </li>
                <li>
                  <button onClick={logout} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold">
                    Logout
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="flex items-center space-x-4 sm:space-x-6">
                <li>
                  <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold">
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}