'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AuthError } from '@/lib/api';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const [localTodo, setLocalTodo] = useState(todo);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleComplete = async () => {
    try {
      const updatedTodo = await api.patch(`/todos/${todo.id}`, {
        completed: !localTodo.completed,
      });

      setLocalTodo(updatedTodo.data);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error('Error updating todo:', error);

      if (error instanceof AuthError) {
        alert('Authentication error. Please log in again.');
        window.location.href = '/login';
      } else if (error.status) {
        alert(`Failed to update task. Error: ${error.message} (Status: ${error.status})`);
      } else {
        alert(`Failed to update task. Network error: ${error.message}`);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setEditTitle(localTodo.title);
      setIsEditing(false);
      return;
    }

    try {
      const updatedTodo = await api.patch(`/todos/${todo.id}`, {
        title: editTitle.trim(),
      });

      setLocalTodo(updatedTodo.data);
      setIsEditing(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error('Error updating todo:', error);

      if (error instanceof AuthError) {
        alert('Authentication error. Please log in again.');
        window.location.href = '/login';
      } else if (error.status) {
        alert(`Failed to update task. Error: ${error.message} (Status: ${error.status})`);
      } else {
        alert(`Failed to update task. Network error: ${error.message}`);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/todos/${todo.id}`);
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error('Error deleting todo:', error);

      if (error instanceof AuthError) {
        alert('Authentication error. Please log in again.');
        window.location.href = '/login';
      } else if (error.status) {
        alert(`Failed to delete task. Error: ${error.message} (Status: ${error.status})`);
      } else {
        alert(`Failed to delete task. Network error: ${error.message}`);
      }
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${localTodo.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={localTodo.completed}
          onChange={handleToggleComplete}
          disabled={isPending}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    setEditTitle(localTodo.title);
                    setIsEditing(false);
                  }
                }}
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim()}
                  className={`text-sm px-3 py-1 rounded ${
                    !editTitle.trim()
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditTitle(localTodo.title);
                    setIsEditing(false);
                  }}
                  className="text-sm px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                className={`break-words ${
                  localTodo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {localTodo.title}
              </h3>
              {localTodo.description && (
                <p className="text-gray-600 text-sm mt-1">{localTodo.description}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditTitle(localTodo.title);
              }}
              disabled={isPending}
              className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
              title="Edit"
            >
              ✏️
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}