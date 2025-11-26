import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  icon = "Users",
  title = "No Data Available", 
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent to-yellow-500 rounded-full flex items-center justify-center shadow-md">
          <ApperIcon name="Plus" size={16} className="text-white" />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Plus" size={20} />
            <span>{actionText}</span>
          </div>
        </button>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-md">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Zap" size={16} />
            <span>Quick Setup</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Shield" size={16} />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={16} />
            <span>Real-time</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty