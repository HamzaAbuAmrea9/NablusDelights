// File: src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import { loginUser } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, user } = useAuth(); // Get user from context
  const router = useRouter();

  // --- Redirect Logic ---
  useEffect(() => {
    // If a user is already logged in, redirect them to the homepage
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  // --- End of Redirect Logic ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { token } = await loginUser({ username, password });
      login(token);
      router.push('/');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  // If the user exists, show a loading/redirecting message
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p className="text-center text-lg text-gray-500">Already logged in. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Sign in to your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}