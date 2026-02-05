"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { useTodos } from "@/hooks/use-todos";
import { Button } from "@/components/ui/button";
import { TodoForm } from "@/components/features/todo-form";
import { TodoItem } from "@/components/features/todo-item";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const { todos, isLoading: isTodosLoading, error, createTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/");
    }
  }, [session, isSessionLoading, router]);

  const handleAddTodo = (title: string) => {
    createTodo.mutate({ title });
  };

  const handleToggleTodo = (id: number) => {
    const todo = Array.isArray(todos) ? todos.find(t => t.id === id) : undefined;
    if (todo) {
      toggleTodo.mutate({ id, completed: !todo.completed });
    }
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo.mutate(id);
  };

  const handleUpdateTodo = (id: number, title: string, description?: string) => {
    updateTodo.mutate({ id, title, description });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (!isLoaded || isSessionLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-slate-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate task statistics only if todos is an array
  let totalTasks = 0;
  let completedTasks = 0;
  let pendingTasks = 0;

  if (Array.isArray(todos)) {
    totalTasks = todos.length;
    completedTasks = todos.filter(todo => todo.completed).length;
    pendingTasks = totalTasks - completedTasks;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex-grow container mx-auto p-4 max-w-4xl py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-6 rounded-2xl bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-sm border border-slate-200 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>
            <p className="text-sm text-slate-600 mt-1">
              {totalTasks} total, {pendingTasks} pending, {completedTasks} completed
            </p>
          </div>
          <div className="flex gap-3">
            <div className="hidden sm:flex items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Pending: {pendingTasks}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Done: {completedTasks}</span>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-500 text-slate-600 hover:bg-slate-50 hover:text-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-6 animate-in p-6 rounded-2xl bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-sm border border-slate-200 shadow-xl">
          <TodoForm onAdd={handleAddTodo} />
        </div>

        {isTodosLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-slate-700">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50/50 backdrop-blur-sm rounded-2xl border border-red-200 shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading tasks</h2>
            <p className="text-red-500">{error instanceof Error ? error.message : 'Failed to load tasks'}</p>
            <p className="text-red-400/70 text-sm mt-2">Please check your connection and authentication</p>
          </div>
        ) : !Array.isArray(todos) ? (
          <div className="text-center py-12 bg-red-50/50 backdrop-blur-sm rounded-2xl border border-red-200 shadow-lg">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error loading tasks</h2>
            <p className="text-red-500">Data is invalid (expected array).</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <div className="text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No tasks yet</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Add your first task using the form above to get started organizing your work!
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-in">
            <div className="flex justify-between items-center mb-3 p-4 rounded-xl bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-sm border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">
                Your Tasks ({totalTasks})
              </h2>
              <div className="text-sm text-slate-600">
                {pendingTasks > 0 ? `${pendingTasks} pending` : 'All done!'}
              </div>
            </div>
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}