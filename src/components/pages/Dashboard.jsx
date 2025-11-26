import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StatCard from "@/components/molecules/StatCard"
import StudentCard from "@/components/molecules/StudentCard"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import gradeService from "@/services/api/gradeService"
import attendanceService from "@/services/api/attendanceService"
import assignmentService from "@/services/api/assignmentService"

const Dashboard = () => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ])
      
      setStudents(studentsData)
      setGrades(gradesData)
      setAttendance(attendanceData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalStudents = students.length
  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length)
    : 0
  
  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
    : 0
  
  const pendingAssignments = assignments.filter(a => a.status === "pending").length

  // Get recent activities
  const getRecentActivities = () => {
    const activities = []
    
    // Recent grade entries (last 5)
    const recentGrades = grades.slice(-5).reverse()
    recentGrades.forEach(grade => {
      const student = students.find(s => s.Id === parseInt(grade.studentId))
      if (student) {
        activities.push({
          type: "grade",
          message: `${student.name} received ${grade.marks}/${grade.totalMarks} in ${grade.subject}`,
          time: grade.date,
          icon: "Trophy",
          color: grade.percentage >= 80 ? "success" : grade.percentage >= 60 ? "warning" : "error"
        })
      }
    })

    return activities.slice(0, 8)
  }

  // Get top performers
  const getTopPerformers = () => {
    const studentPerformance = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === String(student.Id))
      const avgGrade = studentGrades.length > 0 
        ? Math.round(studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length)
        : 0
      
      const studentAttendance = attendance.filter(a => a.studentId === String(student.Id))
      const attendanceRate = studentAttendance.length > 0
        ? Math.round((studentAttendance.filter(a => a.status === "present").length / studentAttendance.length) * 100)
        : 0

      return {
        ...student,
        avgGrade,
        attendanceRate,
        grades: studentGrades,
        attendance: studentAttendance
      }
    })

    return studentPerformance
      .sort((a, b) => b.avgGrade - a.avgGrade)
      .slice(0, 4)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (students.length === 0) {
    return (
      <Empty
        icon="LayoutDashboard"
        title="Welcome to ClassTrack"
        description="Start by adding your first student to begin managing your classroom."
        actionText="Add Student"
        onAction={() => navigate("/students/add")}
      />
    )
  }

  const recentActivities = getRecentActivities()
  const topPerformers = getTopPerformers()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your classroom.</p>
        </div>
        <Button
          onClick={() => navigate("/students")}
          icon="Users"
          variant="outline"
        >
          View All Students
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+2 this week"
        />
        <StatCard
          title="Average Grade"
          value={`${averageGrade}%`}
          icon="Trophy"
          color="success"
          trend="up"
          trendValue="+5% from last month"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon="Calendar"
          color="secondary"
          trend={attendanceRate >= 90 ? "up" : "down"}
          trendValue={attendanceRate >= 90 ? "Excellent" : "Needs attention"}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon="FileText"
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Top Performers</h2>
            <Button
              onClick={() => navigate("/students")}
              variant="ghost"
              icon="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topPerformers.map(student => (
              <StudentCard
                key={student.Id}
                student={student}
                grades={student.grades}
                attendance={student.attendance}
                onClick={() => navigate(`/students/${student.Id}`)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <ApperIcon name="Activity" size={20} className="text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.color === "success" ? "bg-success/10" :
                        activity.color === "warning" ? "bg-warning/10" :
                        activity.color === "error" ? "bg-error/10" :
                        "bg-gray-100"
                      }`}>
                        <ApperIcon 
                          name={activity.icon} 
                          size={16} 
                          className={
                            activity.color === "success" ? "text-success" :
                            activity.color === "warning" ? "text-warning" :
                            activity.color === "error" ? "text-error" :
                            "text-gray-500"
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Clock" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/attendance")}
                  variant="outline"
                  className="w-full justify-start"
                  icon="Calendar"
                >
                  Mark Today's Attendance
                </Button>
                <Button
                  onClick={() => navigate("/grades")}
                  variant="outline"
                  className="w-full justify-start"
                  icon="Trophy"
                >
                  Enter Grades
                </Button>
                <Button
                  onClick={() => navigate("/assignments")}
                  variant="outline"
                  className="w-full justify-start"
                  icon="FileText"
                >
                  Manage Assignments
                </Button>
                <Button
                  onClick={() => navigate("/students")}
                  variant="outline"
                  className="w-full justify-start"
                  icon="Plus"
                >
                  Add New Student
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard