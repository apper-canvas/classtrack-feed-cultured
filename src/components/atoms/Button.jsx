import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-secondary to-cyan-600 text-white hover:from-cyan-700 hover:to-cyan-800 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 hover:text-white bg-white",
    ghost: "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={16} 
          className="mr-2 animate-spin" 
        />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon 
          name={icon} 
          size={16} 
          className="mr-2" 
        />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon 
          name={icon} 
          size={16} 
          className="ml-2" 
        />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button