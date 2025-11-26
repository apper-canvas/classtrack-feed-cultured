import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "from-blue-500 to-blue-600",
    secondary: "from-teal-500 to-teal-600", 
    success: "from-green-500 to-green-600",
    warning: "from-amber-500 to-amber-600",
    error: "from-red-500 to-red-600"
  }

  return (
    <Card className="hover:transform hover:scale-105 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className="flex items-center mt-2 space-x-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  size={16}
                  className={trend === "up" ? "text-success" : "text-error"}
                />
                <span className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-error"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard