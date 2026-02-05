import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Add Todo Form Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-16 h-10 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Empty State Skeleton or Todo Items Skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white animate-pulse">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded bg-gray-200"></div>
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}