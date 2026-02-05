'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthError } from '@/lib/api';

export default function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await api.post('/todos/', { title: title.trim() });

      // Reset form
      setTitle('');

      // Refresh the page to update the list
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error('Error adding todo:', error);

      // Handle different types of errors
      if (error instanceof AuthError) {
        alert('Authentication error. Please log in again.');
        // Optionally redirect to login
        window.location.href = '/login';
      } else if (error.status) {
        // API error with status code
        alert(`Failed to add task. Error: ${error.message} (Status: ${error.status})`);
      } else {
        // Network or other error
        alert(`Failed to add task. Network error: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
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
        {isPending ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}