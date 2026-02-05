'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DebugAddTodoForm() {
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const [debugInfo, setDebugInfo] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setDebugInfo('Starting to add todo...');

    try {
      setDebugInfo('Making API call to POST /todos/ ...');

      const response = await api.post('/todos/', { title: title.trim() });

      setDebugInfo(`API Response: Status ${response.status}, Data: ${JSON.stringify(response.data)}`);

      // Reset form
      setTitle('');

      // Refresh the page to update the list
      startTransition(() => {
        router.refresh();
      });

      setDebugInfo('Successfully added todo and refreshed!');
    } catch (error: any) {
      console.error('Error adding todo:', error);
      setDebugInfo(`Error: ${error.message || 'Unknown error'}. Response: ${JSON.stringify(error.response?.data || 'No response data')}`);
      alert(`Failed to add task. Error: ${error.message || 'Check console for details'}`);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task (with debug)..."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isPending || !title.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPending ? 'Adding...' : 'Debug Add'}
        </button>
      </form>

      {debugInfo && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-3 rounded text-sm">
          <strong>Debug Info:</strong> {debugInfo}
        </div>
      )}
    </div>
  );
}