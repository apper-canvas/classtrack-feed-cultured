import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ children, variant = "default", size = "md", className, ...props }) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white",
    secondary: "bg-gradient-to-r from-secondary to-cyan-600 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    info: "bg-gradient-to-r from-info to-blue-600 text-white",
    present: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    absent: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    late: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    pending: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    submitted: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    graded: "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
  }

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge