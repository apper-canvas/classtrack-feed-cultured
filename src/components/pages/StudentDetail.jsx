import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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
import { format } from "date-fns"

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudent(id),
        attendanceService.getByStudent(id),
        assignmentService.getByStudent(id)
      ])
      
      if (!studentData) {
        setError("Student not found")
        return
      }
      
      setStudent(studentData)
      setGrades(gradesData)
      setAttendance(attendanceData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError("Failed to load student data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />
  if (!student) return <ErrorView message="Student not found" />

  // Calculate statistics
  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length)
    : 0
  
  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
    : 0

  const completedAssignments = assignments.filter(a => a.status === "submitted" || a.status === "graded").length
  const totalAssignments = assignments.length

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "grades", label: "Grades", icon: "Trophy" },
    { id: "attendance", label: "Attendance", icon: "Calendar" },
    { id: "assignments", label: "Assignments", icon: "FileText" }
  ]

  const renderProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Student ID</label>
              <p className="text-gray-800 font-medium">{student.studentId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Class</label>
              <p className="text-gray-800 font-medium">{student.class}</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-800 font-medium">{student.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <p className="text-gray-800 font-medium">{student.phone}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-800 font-medium">
                {format(new Date(student.dateOfBirth), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
              <p className="text-gray-800 font-medium">
                {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-800">Guardian Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Guardian Name</label>
            <p className="text-gray-800 font-medium">{student.guardianName}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Guardian Contact</label>
            <p className="text-gray-800 font-medium">{student.guardianContact}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGrades = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{averageGrade}%</div>
            <div className="text-sm text-gray-600">Overall Average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{grades.length}</div>
            <div className="text-sm text-gray-600">Total Grades</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {grades.filter(g => g.percentage >= 90).length}
            </div>
            <div className="text-sm text-gray-600">A Grades</div>
          </CardContent>
        </Card>
      </div>

      {grades.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Grade History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map(grade => (
                <div key={grade.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-800">{grade.subject}</h4>
                      <Badge variant={grade.percentage >= 90 ? "success" : grade.percentage >= 80 ? "primary" : grade.percentage >= 70 ? "warning" : "error"}>
                        {grade.examType}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(grade.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {grade.marks}/{grade.totalMarks}
                    </div>
                    <div className="text-sm text-gray-600">{grade.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Empty
          icon="Trophy"
          title="No Grades Available"
          description="No grades have been recorded for this student yet."
        />
      )}
    </div>
  )

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {attendance.filter(a => a.status === "present").length}
            </div>
            <div className="text-sm text-gray-600">Present Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-error mb-2">
              {attendance.filter(a => a.status === "absent").length}
            </div>
            <div className="text-sm text-gray-600">Absent Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {attendance.filter(a => a.status === "late").length}
            </div>
            <div className="text-sm text-gray-600">Late Days</div>
          </CardContent>
        </Card>
      </div>

      {attendance.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Attendance History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendance.slice(-20).reverse().map(record => (
                <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-800">
                      {format(new Date(record.date), "EEEE, MMM dd, yyyy")}
                    </span>
                  </div>
                  <Badge variant={record.status}>
                    {record.status}
                  </Badge>
                  {record.notes && (
                    <span className="text-sm text-gray-600 italic">{record.notes}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Empty
          icon="Calendar"
          title="No Attendance Records"
          description="No attendance has been recorded for this student yet."
        />
      )}
    </div>
  )

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{totalAssignments}</div>
            <div className="text-sm text-gray-600">Total Assignments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{completedAssignments}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {assignments.filter(a => a.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
      </div>

      {assignments.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Assignment History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map(assignment => (
                <div key={assignment.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                      <Badge variant={assignment.status}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{assignment.subject}</span>
                      <span>Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}</span>
                      {assignment.submissionDate && (
                        <span>Submitted: {format(new Date(assignment.submissionDate), "MMM dd, yyyy")}</span>
                      )}
                    </div>
                  </div>
                  {assignment.status === "graded" && (
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">
                        {assignment.score}/{assignment.maxScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((assignment.score / assignment.maxScore) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Empty
          icon="FileText"
          title="No Assignments"
          description="No assignments have been recorded for this student yet."
        />
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/students")}
            variant="ghost"
            icon="ArrowLeft"
          >
            Back to Students
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <img
              src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Hash" size={16} />
                  <span>{student.studentId}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ApperIcon name="GraduationCap" size={16} />
                  <span>{student.class}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Mail" size={16} />
                  <span>{student.email}</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{averageGrade}%</div>
                  <div className="text-sm text-gray-600">Avg Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{attendanceRate}%</div>
                  <div className="text-sm text-gray-600">Attendance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{completedAssignments}/{totalAssignments}</div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/students/${student.Id}/edit`)}
              icon="Edit"
              variant="outline"
            >
              Edit Student
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && renderProfile()}
        {activeTab === "grades" && renderGrades()}
        {activeTab === "attendance" && renderAttendance()}
        {activeTab === "assignments" && renderAssignments()}
      </div>
    </div>
  )
}

export default StudentDetail