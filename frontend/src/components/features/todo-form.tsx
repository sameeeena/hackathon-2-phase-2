import React, { useState } from "react"
import { Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TodoFormProps {
  onAdd: (title: string, description?: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAdd(title)
      setTitle("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500"
    >
      <div className="text-blue-600 flex-shrink-0">
        <Zap className="w-5 h-5 fill-blue-600/20" />
      </div>
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent text-base h-8 px-2 text-slate-800 placeholder:text-slate-400"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-lg px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Adding...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </div>
        )}
      </Button>
    </form>
  )
}