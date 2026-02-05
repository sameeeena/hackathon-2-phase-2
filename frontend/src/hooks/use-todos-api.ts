import { useState, useEffect } from 'react';
import { withAuthHandling } from '@/lib/auth-utils';
import api from '@/lib/api';
import { Todo } from '@/types/todo'; // assuming you have a Todo type

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const createTodo = async (todoData: Partial<Todo>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await withAuthHandling(async () => {
        const response = await api.post<Todo>('/todos', todoData);
        return response.data;
      });

      setTodos(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
      console.error('Error creating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, todoData: Partial<Todo>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await withAuthHandling(async () => {
        const response = await api.patch<Todo>(`/todos/${id}`, todoData);
        return response.data;
      });

      setTodos(prev => prev.map(todo => todo.id === id ? result : todo));
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      console.error('Error updating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await withAuthHandling(async () => {
        await api.delete(`/todos/${id}`);
      });

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
      console.error('Error deleting todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};