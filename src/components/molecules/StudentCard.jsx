import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StudentCard = ({ student, onClick, grades = [], attendance = [] }) => {
  // Calculate average grade
  const avgGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length)
    : 0

  // Calculate attendance rate
  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
    : 0

  return (
    <Card 
      className="cursor-pointer hover:transform hover:scale-105 transition-all duration-200"
      onClick={() => onClick(student)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {student.name}
              </h3>
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Hash" size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">{student.studentId}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ApperIcon name="GraduationCap" size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600">{student.class}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Trophy" size={14} className="text-amber-500" />
                <span className="text-sm font-medium text-gray-700">{avgGrade}%</span>
              </div>
              
              <Badge 
                variant={attendanceRate >= 90 ? "success" : attendanceRate >= 80 ? "warning" : "error"}
                size="sm"
              >
                {attendanceRate}% Attendance
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentCard