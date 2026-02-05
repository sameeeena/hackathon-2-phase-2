import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useTodos() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.get("/todos/");
      return response.data;
    },
  });

  const createTodo = useMutation({
    mutationFn: async (newTodo: { title: string, description?: string }) => {
      const response = await api.post("/todos/", newTodo);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodo = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await api.patch(`/todos/${id}`, { completed });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, title, description }: { id: number; title?: string; description?: string }) => {
      const response = await api.patch(`/todos/${id}`, { title, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    todos,
    isLoading,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  };
}
