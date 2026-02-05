'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

export default function LoginDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if ('error' in result && result.error) {
        setError('An error occurred during login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="flex-grow flex items-center py-16">
        <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome Back</h1>
            <p className="text-lg text-slate-600">Sign in to access your dashboard and manage your tasks</p>
          </div>

          <Card className="w-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
            </div>

            <CardContent className="px-8 py-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 block mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/80 border-slate-300 text-slate-900 py-4 px-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="text-sm font-medium text-slate-700 block mb-2">Password</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/80 border-slate-300 text-slate-900 py-4 px-4 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-indigo-600 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-slate-600 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}