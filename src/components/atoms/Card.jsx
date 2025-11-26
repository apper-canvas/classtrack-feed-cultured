import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

const CardHeader = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = "CardHeader"

const CardContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-4 border-t border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter }