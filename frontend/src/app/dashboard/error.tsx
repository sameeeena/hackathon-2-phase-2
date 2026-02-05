'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h2 className="font-bold text-lg">Something went wrong!</h2>
        <p className="mt-2">We couldn't load your dashboard. Please try again.</p>
        <button
          onClick={() => reset()}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}