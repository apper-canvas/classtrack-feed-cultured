import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import AttendanceCalendar from "@/components/molecules/AttendanceCalendar"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import attendanceService from "@/services/api/attendanceService"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { toast } from "react-toastify"

const Attendance = () => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClass, setSelectedClass] = useState("all")
  const [view, setView] = useState("daily") // daily, monthly, calendar

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudents(studentsData)
      setAttendance(attendanceData)
    } catch (err) {
      setError("Failed to load attendance data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (studentId, date, status) => {
    try {
      const record = await attendanceService.markAttendance(studentId, date, status)
      
      // Update local state
      setAttendance(prev => {
        const filtered = prev.filter(a => 
          !(a.studentId === String(studentId) && a.date === format(new Date(date), "yyyy-MM-dd"))
        )
        return [...filtered, record]
      })
      
      toast.success("Attendance marked successfully!")
    } catch (err) {
      toast.error("Failed to mark attendance")
      console.error("Error marking attendance:", err)
    }
  }

  const getStudentAttendance = (studentId, date = null) => {
    if (date) {
      const dateStr = format(new Date(date), "yyyy-MM-dd")
      return attendance.find(a => a.studentId === String(studentId) && a.date === dateStr)
    }
    return attendance.filter(a => a.studentId === String(studentId))
  }

  const getAttendanceRate = (studentId) => {
    const records = getStudentAttendance(studentId)
    if (records.length === 0) return 0
    
    const presentCount = records.filter(r => r.status === "present").length
    return Math.round((presentCount / records.length) * 100)
  }

  const getFilteredStudents = () => {
    if (selectedClass === "all") return students
    return students.filter(s => s.class === selectedClass)
  }

  const getUniqueClasses = () => {
    return [...new Set(students.map(s => s.class))].sort()
  }

  const getTodaysAttendance = () => {
    const today = format(selectedDate, "yyyy-MM-dd")
    return attendance.filter(a => a.date === today)
  }

  const getDailyStats = () => {
    const todaysAttendance = getTodaysAttendance()
    const filteredStudents = getFilteredStudents()
    
    const present = todaysAttendance.filter(a => a.status === "present").length
    const absent = todaysAttendance.filter(a => a.status === "absent").length
    const late = todaysAttendance.filter(a => a.status === "late").length
    const notMarked = filteredStudents.length - todaysAttendance.length
    
    return { present, absent, late, notMarked, total: filteredStudents.length }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (students.length === 0) {
    return (
      <Empty
        icon="Calendar"
        title="No Students Found"
        description="Add students to start tracking attendance."
        actionText="Add Student"
      />
    )
  }

  const filteredStudents = getFilteredStudents()
  const dailyStats = getDailyStats()

  const renderDailyView = () => (
    <div className="space-y-6">
      {/* Daily Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">{dailyStats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-error mb-1">{dailyStats.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-1">{dailyStats.late}</div>
            <div className="text-sm text-gray-600">Late</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-500 mb-1">{dailyStats.notMarked}</div>
            <div className="text-sm text-gray-600">Not Marked</div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Attendance for {format(selectedDate, "EEEE, MMMM dd, yyyy")}
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  // Mark all as present
                  filteredStudents.forEach(student => {
                    if (!getStudentAttendance(student.Id, selectedDate)) {
                      markAttendance(student.Id, selectedDate, "present")
                    }
                  })
                }}
                variant="success"
                size="sm"
              >
                Mark All Present
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map(student => {
              const record = getStudentAttendance(student.Id, selectedDate)
              
              return (
                <div key={student.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.studentId} - {student.class}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-800">{getAttendanceRate(student.Id)}%</div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>

                    {record && (
                      <Badge variant={record.status}>
                        {record.status}
                      </Badge>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => markAttendance(student.Id, selectedDate, "present")}
                        variant={record?.status === "present" ? "success" : "outline"}
                        size="sm"
                      >
                        <ApperIcon name="Check" size={16} />
                      </Button>
                      <Button
                        onClick={() => markAttendance(student.Id, selectedDate, "late")}
                        variant={record?.status === "late" ? "warning" : "outline"}
                        size="sm"
                      >
                        <ApperIcon name="Clock" size={16} />
                      </Button>
                      <Button
                        onClick={() => markAttendance(student.Id, selectedDate, "absent")}
                        variant={record?.status === "absent" ? "error" : "outline"}
                        size="sm"
                      >
                        <ApperIcon name="X" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const monthAttendance = attendance.filter(a => {
      const date = new Date(a.date)
      return date >= monthStart && date <= monthEnd
    })

    const monthlyStats = {
      totalDays: monthAttendance.length,
      present: monthAttendance.filter(a => a.status === "present").length,
      absent: monthAttendance.filter(a => a.status === "absent").length,
      late: monthAttendance.filter(a => a.status === "late").length
    }

    const rate = monthlyStats.totalDays > 0 
      ? Math.round((monthlyStats.present / monthlyStats.totalDays) * 100)
      : 0

    return (
      <div className="space-y-6">
        {/* Monthly Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{rate}%</div>
              <div className="text-sm text-gray-600">Monthly Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">{monthlyStats.present}</div>
              <div className="text-sm text-gray-600">Present Days</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-error mb-1">{monthlyStats.absent}</div>
              <div className="text-sm text-gray-600">Absent Days</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-warning mb-1">{monthlyStats.late}</div>
              <div className="text-sm text-gray-600">Late Days</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">{monthlyStats.totalDays}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Monthly Summary */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">
              Monthly Summary - {format(selectedDate, "MMMM yyyy")}
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map(student => {
                const studentRecords = monthAttendance.filter(a => a.studentId === String(student.Id))
                const studentRate = studentRecords.length > 0
                  ? Math.round((studentRecords.filter(r => r.status === "present").length / studentRecords.length) * 100)
                  : 0

                return (
                  <div key={student.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.class}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{studentRate}%</div>
                        <div className="text-xs text-gray-600">Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-success">
                          {studentRecords.filter(r => r.status === "present").length}
                        </div>
                        <div className="text-xs text-gray-600">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-error">
                          {studentRecords.filter(r => r.status === "absent").length}
                        </div>
                        <div className="text-xs text-gray-600">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-warning">
                          {studentRecords.filter(r => r.status === "late").length}
                        </div>
                        <div className="text-xs text-gray-600">Late</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttendanceCalendar
        selectedDate={selectedDate}
        attendance={attendance}
        onDateClick={setSelectedDate}
      />
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Legend</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-success"></div>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-warning"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-error"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <span className="text-sm text-gray-600">No Record</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Attendance
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage student attendance
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Classes</option>
            {getUniqueClasses().map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setView("daily")}
            variant={view === "daily" ? "primary" : "outline"}
            size="sm"
          >
            Daily
          </Button>
          <Button
            onClick={() => setView("monthly")}
            variant={view === "monthly" ? "primary" : "outline"}
            size="sm"
          >
            Monthly
          </Button>
          <Button
            onClick={() => setView("calendar")}
            variant={view === "calendar" ? "primary" : "outline"}
            size="sm"
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* View Content */}
      {view === "daily" && renderDailyView()}
      {view === "monthly" && renderMonthlyView()}
      {view === "calendar" && renderCalendarView()}
    </div>
  )
}

export default Attendance