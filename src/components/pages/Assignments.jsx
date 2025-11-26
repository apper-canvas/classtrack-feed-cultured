import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import assignmentService from "@/services/api/assignmentService"
import { format, isAfter, isBefore } from "date-fns"

const Assignments = () => {
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Biology"]
  const statuses = ["pending", "submitted", "graded"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll()
      ])
      
      setStudents(studentsData)
      setAssignments(assignmentsData)
    } catch (err) {
      setError("Failed to load assignments data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAssignments = () => {
    let filtered = [...assignments]

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(a => a.status === selectedStatus)
    }

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(a => a.subject === selectedSubject)
    }

    // Filter by class (based on student's class)
    if (selectedClass !== "all") {
      const classStudentIds = students
        .filter(s => s.class === selectedClass)
        .map(s => String(s.Id))
      filtered = filtered.filter(a => classStudentIds.includes(a.studentId))
    }

    // Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "title":
          return a.title.localeCompare(b.title)
        case "subject":
          return a.subject.localeCompare(b.subject)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }

  const getUniqueClasses = () => {
    return [...new Set(students.map(s => s.class))].sort()
  }

  const getAssignmentStats = () => {
    const filtered = getFilteredAssignments()
    
    return {
      total: filtered.length,
      pending: filtered.filter(a => a.status === "pending").length,
      submitted: filtered.filter(a => a.status === "submitted").length,
      graded: filtered.filter(a => a.status === "graded").length,
      overdue: filtered.filter(a => 
        a.status === "pending" && isBefore(new Date(a.dueDate), new Date())
      ).length
    }
  }

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student ? student.name : "Unknown Student"
  }

  const getStudentClass = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student ? student.class : ""
  }

  const isOverdue = (assignment) => {
    return assignment.status === "pending" && isBefore(new Date(assignment.dueDate), new Date())
  }

  const getStatusVariant = (assignment) => {
    if (isOverdue(assignment)) return "error"
    
    switch (assignment.status) {
      case "pending": return "warning"
      case "submitted": return "info"
      case "graded": return "success"
      default: return "default"
    }
  }

  const getStatusLabel = (assignment) => {
    if (isOverdue(assignment)) return "Overdue"
    return assignment.status
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (assignments.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No Assignments Found"
        description="Start by creating assignments for your students."
        actionText="Create Assignment"
      />
    )
  }

  const filteredAssignments = getFilteredAssignments()
  const stats = getAssignmentStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Assignments
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage student assignments and submissions
          </p>
        </div>
        <Button
          icon="Plus"
          className="shadow-lg"
        >
          Create Assignment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-info mb-1">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">{stats.graded}</div>
            <div className="text-sm text-gray-600">Graded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-error mb-1">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>

          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </Select>

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

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="min-w-[150px]"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="title">Sort by Title</option>
          <option value="subject">Sort by Subject</option>
          <option value="status">Sort by Status</option>
        </Select>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Assignment List</h3>
            <div className="text-sm text-gray-600">
              {filteredAssignments.length} assignments
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length > 0 ? (
            <div className="space-y-4">
              {filteredAssignments.map(assignment => (
                <div key={assignment.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                      <Badge variant={getStatusVariant(assignment)}>
                        {getStatusLabel(assignment)}
                      </Badge>
                      {isOverdue(assignment) && (
                        <ApperIcon name="AlertTriangle" size={16} className="text-error" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="User" size={14} />
                        <span>{getStudentName(assignment.studentId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="GraduationCap" size={14} />
                        <span>{getStudentClass(assignment.studentId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Book" size={14} />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span>Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}</span>
                      </div>
                      {assignment.submissionDate && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="CheckCircle" size={14} />
                          <span>Submitted: {format(new Date(assignment.submissionDate), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {assignment.status === "graded" && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {assignment.score}/{assignment.maxScore}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((assignment.score / assignment.maxScore) * 100)}%
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      {assignment.status === "submitted" && (
                        <Button
                          size="sm"
                          icon="Trophy"
                          variant="success"
                        >
                          Grade
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        icon="Eye"
                        variant="outline"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon="FileText"
              title="No Assignments Found"
              description="No assignments match the current filters."
            />
          )}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      {assignments.filter(a => 
        a.status === "pending" && 
        isAfter(new Date(a.dueDate), new Date()) &&
        isBefore(new Date(a.dueDate), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      ).length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments
                .filter(a => 
                  a.status === "pending" && 
                  isAfter(new Date(a.dueDate), new Date()) &&
                  isBefore(new Date(a.dueDate), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                )
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map(assignment => (
                  <div key={assignment.Id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Clock" size={16} className="text-warning" />
                      <div>
                        <p className="font-medium text-gray-800">{assignment.title}</p>
                        <p className="text-sm text-gray-600">
                          {getStudentName(assignment.studentId)} - {assignment.subject}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-warning">
                        Due {format(new Date(assignment.dueDate), "MMM dd")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Assignments