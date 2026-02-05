import React, { useState } from "react"
import { CheckCircle2, Circle, Trash2, MoreHorizontal, Clock, Check, X, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TodoItemProps {
  todo: {
    id: number
    title: string
    description?: string
    completed: boolean
    created_at?: string
  }
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, title: string, description?: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle, editDescription)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || "")
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    onDelete(todo.id)
  }

  return (
    <div className={cn(
      "group relative flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
      isDeleting && "opacity-50 animate-fade-out"
    )}>
      <button
        onClick={() => onToggle(todo.id)}
        className="mt-0.5 shrink-0 transition-transform duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-full"
        disabled={isEditing || isDeleting}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed ? (
          <div className="bg-emerald-500 rounded-full p-1.5 hover:bg-emerald-600 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500/50 hover:border-blue-400 transition-colors flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-transparent" />
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-9 font-medium text-base bg-slate-50 border-slate-200 text-slate-800"
              placeholder="Task title"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="h-8 text-sm text-slate-600 bg-slate-50 border-slate-200"
              placeholder="Description (optional)"
            />
          </div>
        ) : (
          <>
            <h3 className={cn(
              "text-base font-medium leading-tight transition-all break-words",
              todo.completed
                ? "text-slate-500 line-through decoration-slate-500"
                : "text-slate-800"
            )}>
              {todo.title}
            </h3>

            {todo.description && (
              <p className={cn(
                "text-sm text-slate-600 leading-relaxed",
                todo.completed && "opacity-70"
              )}>
                {todo.description}
              </p>
            )}
          </>
        )}

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Today</span>
          </div>
          {todo.completed && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
              onClick={handleSave}
              aria-label="Save changes"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100"
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
              aria-label="Edit task"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-100"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}