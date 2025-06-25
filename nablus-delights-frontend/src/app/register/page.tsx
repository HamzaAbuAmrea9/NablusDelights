// File: src/app/register/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import { registerUser } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { user } = useAuth(); // Get user from context
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | string[] | null>(null);
  const [success, setSuccess] = useState('');

  // --- Redirect Logic ---
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  // --- End of Redirect Logic ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    try {
      const response = await registerUser({ username, email, password });

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.values(errorData.errors).flat() as string[];
          setError(errorMessages);
        } else if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

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
        <h1 className="text-2xl font-bold text-center text-gray-800">Create an Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" name="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
              {Array.isArray(error) ? (
                <ul className="list-disc list-inside text-left">
                  {error.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}
          
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}