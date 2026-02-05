'use client';

import { useState } from 'react';
import { withAuthHandling } from '@/lib/auth-utils';
import api from '@/lib/api';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

const TodoComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await withAuthHandling(async () => {
        const response = await api.get<{ data: Todo[] }>('/todos');
        return response.data;
      });

      setTodos(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await withAuthHandling(async () => {
        const response = await api.post<Todo>('/todos', { title: newTodo });
        return response.data;
      });

      setTodos([...todos, result]);
      setNewTodo('');
    } catch (err: any) {
      setError(err.message || 'Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <form onSubmit={addTodo} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Add
        </button>
      </form>

      <button
        onClick={fetchTodos}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
        disabled={loading}
      >
        Refresh Todos
      </button>

      {loading && <p>Loading...</p>}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="border-b pb-2">
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponent;