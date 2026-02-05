import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
      secondary: "bg-slate-100 text-slate-800 shadow-xs hover:bg-slate-200",
      outline: "border border-blue-500/50 bg-transparent text-blue-600 hover:bg-blue-50",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
      success: "bg-green-600 text-white shadow-sm hover:bg-green-700",
      glass: "bg-white/30 backdrop-blur-md border border-white/20 text-slate-800 hover:bg-white/50 transition-all",
    }

    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }