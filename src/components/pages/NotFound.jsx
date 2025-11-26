import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl font-bold text-white">404</span>
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-accent to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <ApperIcon name="AlertTriangle" size={24} className="text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
            icon="Home"
          >
            Go to Dashboard
          </Button>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate("/students")}
              variant="outline"
              className="flex-1"
              icon="Users"
            >
              Students
            </Button>
            <Button
              onClick={() => navigate("/grades")}
              variant="outline"
              className="flex-1"
              icon="Trophy"
            >
              Grades
            </Button>
            <Button
              onClick={() => navigate("/attendance")}
              variant="outline"
              className="flex-1"
              icon="Calendar"
            >
              Attendance
            </Button>
          </div>

          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="w-full"
            icon="ArrowLeft"
          >
            Go Back
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <ApperIcon name="GraduationCap" size={16} />
              <span>ClassTrack</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={16} />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Zap" size={16} />
              <span>Fast</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound