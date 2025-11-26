import React from "react"
import ApperIcon from "@/components/ApperIcon"

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="AlertTriangle" size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
            <ApperIcon name="X" size={16} className="text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="RefreshCw" size={20} />
                <span>Try Again</span>
              </div>
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-200 border border-gray-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <ApperIcon name="RotateCcw" size={20} />
              <span>Reload Page</span>
            </div>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView