import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { format, isAfter, isBefore } from "date-fns";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

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
      filtered = filtered.filter(a => a.status_c === selectedStatus)
    }

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter(a => a.subject_c === selectedSubject)
    }
    // Filter by class (based on student's class)
    if (selectedClass !== "all") {
const classStudentIds = students
        .filter(s => (s.class_c?.Name || s.class_c) === selectedClass)
        .map(s => String(s.Id))
      filtered = filtered.filter(a => {
        const studentIdValue = a.student_id_c?.Id || a.student_id_c;
        return classStudentIds.includes(String(studentIdValue));
      });
    }

    // Sort assignments
// Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.due_date_c) - new Date(b.due_date_c)
        case "title":
          return a.title_c.localeCompare(b.title_c)
        case "subject":
          return a.subject_c.localeCompare(b.subject_c)
        case "status":
          return a.status_c.localeCompare(b.status_c)
        default:
          return 0
      }
    });

    return filtered
  }

  const getUniqueClasses = () => {
return [...new Set(students.map(s => s.class_c?.Name || s.class_c))].sort()
  }

  const getAssignmentStats = () => {
    const filtered = getFilteredAssignments()
    
    return {
total: filtered.length,
      pending: filtered.filter(a => a.status_c === "pending").length,
      submitted: filtered.filter(a => a.status_c === "submitted").length,
      graded: filtered.filter(a => a.status_c === "graded").length,
      overdue: filtered.filter(a => 
        a.status_c === "pending" && isBefore(new Date(a.due_date_c), new Date())
      ).length
    }
  }

const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student ? student.Name : "Unknown Student"
  }

const getStudentClass = (studentId) => {
    const student = students.find(s => s.Id === parseInt(studentId))
    return student ? (student.class_c?.Name || student.class_c) : ""
  }

const isOverdue = (assignment) => {
    return assignment.status_c === "pending" && isBefore(new Date(assignment.due_date_c), new Date())
  }

  const getStatusVariant = (assignment) => {
    if (isOverdue(assignment)) return "error"
    
switch (assignment.status_c) {
      case "pending": return "warning"
      case "submitted": return "info"
      case "graded": return "success"
      default: return "default"
    }
  }

const getStatusLabel = (assignment) => {
    if (isOverdue(assignment)) return "Overdue"
    return assignment.status_c?.charAt(0).toUpperCase() + assignment.status_c?.slice(1) || "Unknown"
  }

// Get unique subjects for filter
  const getUniqueSubjects = () => {
    return [...new Set(assignments.map(a => a.subject_c))].sort()
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
                      <h4 className="font-medium text-gray-800">{assignment.title_c}</h4>
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
                        <span>{getStudentName(assignment.student_id_c?.Id || assignment.student_id_c)}</span>
                      </div>
<div className="flex items-center space-x-1">
                        <ApperIcon name="GraduationCap" size={14} />
                        <span>{getStudentClass(assignment.student_id_c?.Id || assignment.student_id_c)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Book" size={14} />
                        <span>{assignment.subject_c}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span>Due: {format(new Date(assignment.due_date_c), "MMM dd, yyyy")}</span>
                      </div>
{assignment.submission_date_c && (
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="CheckCircle" size={14} />
                          <span>Submitted: {format(new Date(assignment.submission_date_c), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                    </div>
                  </div>

<div className="flex items-center space-x-4">
                    {assignment.status_c === "graded" && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">
                          {assignment.score_c}/{assignment.max_score_c}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((assignment.score_c / assignment.max_score_c) * 100)}%
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
{assignment.status_c === "submitted" && (
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
        a.status_c === "pending" && 
        isAfter(new Date(a.due_date_c), new Date()) &&
        isBefore(new Date(a.due_date_c), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      ).length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments
.filter(a => 
                  a.status_c === "pending" && 
                  isAfter(new Date(a.due_date_c), new Date()) &&
                  isBefore(new Date(a.due_date_c), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                )
.sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c))
                .map(assignment => (
                  <div key={assignment.Id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Clock" size={16} className="text-warning" />
                      <div>
                        <p className="font-medium text-gray-800">{assignment.title_c}</p>
                        <p className="text-sm text-gray-600">
                          {getStudentName(assignment.student_id_c?.Id || assignment.student_id_c)} - {assignment.subject_c}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-warning">
                        Due {format(new Date(assignment.due_date_c), "MMM dd")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.ceil((new Date(assignment.due_date_c) - new Date()) / (1000 * 60 * 60 * 24))} days left
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