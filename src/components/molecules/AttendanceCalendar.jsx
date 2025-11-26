import React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"

const AttendanceCalendar = ({ 
  selectedDate = new Date(), 
  attendance = [], 
  onDateClick,
  showHeader = true 
}) => {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return attendance.find(a => a.date === dateStr)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-success"
      case "absent": return "bg-error"
      case "late": return "bg-warning"
      default: return "bg-gray-200"
    }
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">
            {format(selectedDate, "MMMM yyyy")}
          </h3>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const attendanceRecord = getAttendanceForDate(day)
            const isWeekendDay = isWeekend(day)
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateClick && onDateClick(day)}
                className={`
                  relative p-2 text-sm rounded-lg transition-all duration-200 hover:bg-gray-50
                  ${isWeekendDay ? "text-gray-400" : "text-gray-700"}
                  ${onDateClick ? "cursor-pointer hover:scale-105" : ""}
                `}
                disabled={isWeekendDay && !attendanceRecord}
              >
                <span className="relative z-10">{format(day, "d")}</span>
                
                {attendanceRecord && (
                  <div className={`
                    absolute inset-0 rounded-lg opacity-20 ${getStatusColor(attendanceRecord.status)}
                  `} />
                )}
                
                {attendanceRecord && (
                  <div className={`
                    absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(attendanceRecord.status)}
                  `} />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-xs text-gray-600">Present</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-xs text-gray-600">Late</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <span className="text-xs text-gray-600">Absent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceCalendar