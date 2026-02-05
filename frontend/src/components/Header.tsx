'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

export default function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-3xl font-extrabold text-slate-800">TaskFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-base font-bold">
          <Link href="/" className="text-slate-700 hover:text-indigo-600 transition-colors py-2">
            Home
          </Link>
          <Link href="/#features" className="text-slate-700 hover:text-indigo-600 transition-colors py-2">
            Features
          </Link>
          <Link href="/#about" className="text-slate-700 hover:text-indigo-600 transition-colors py-2">
            About
          </Link>
          <Link href="/#contact" className="text-slate-700 hover:text-indigo-600 transition-colors py-2">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {!isPending && session ? (
            <Link href="/dashboard">
              <Button variant="outline" className="text-base font-semibold py-3 px-4">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-base font-semibold py-3 px-4">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-base font-semibold py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}