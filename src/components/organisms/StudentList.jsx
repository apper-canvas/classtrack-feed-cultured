import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StudentCard from "@/components/molecules/StudentCard"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import studentService from "@/services/api/studentService"
import gradeService from "@/services/api/gradeService"
import attendanceService from "@/services/api/attendanceService"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortStudents()
  }, [students, searchTerm, classFilter, sortBy, grades, attendance])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ])
      
      setStudents(studentsData)
      setGrades(gradesData)
      setAttendance(attendanceData)
    } catch (err) {
      setError("Failed to load student data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortStudents = () => {
    let filtered = [...students]

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term) ||
        student.class.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      )
    }

    // Filter by class
    if (classFilter !== "all") {
      filtered = filtered.filter(student => student.class === classFilter)
    }

    // Sort students
filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "studentId":
          return (a.studentId || "").localeCompare(b.studentId || "")
        case "class":
          return (a.class || "").localeCompare(b.class || "")
        case "grade":
          const aGrades = grades.filter(g => g.studentId === String(a.Id || 0))
          const bGrades = grades.filter(g => g.studentId === String(b.Id || 0))
          const aAvg = aGrades.length > 0 ? aGrades.reduce((sum, g) => sum + g.percentage, 0) / aGrades.length : 0
          const bAvg = bGrades.length > 0 ? bGrades.reduce((sum, g) => sum + g.percentage, 0) / bGrades.length : 0
          return bAvg - aAvg
        default:
          return 0
      }
    })

    setFilteredStudents(filtered)
  }

  const handleStudentClick = (student) => {
    navigate(`/students/${student.Id}`)
  }

  const getUniqueClasses = () => {
    const classes = [...new Set(students.map(s => s.class))]
    return classes.sort()
  }

  const getStudentGrades = (studentId) => {
    return grades.filter(g => g.studentId === String(studentId))
  }

  const getStudentAttendance = (studentId) => {
    return attendance.filter(a => a.studentId === String(studentId))
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />
  if (students.length === 0) return (
    <Empty
      icon="Users"
      title="No Students Found"
      description="Start building your class roster by adding your first student."
      actionText="Add Student"
      onAction={() => navigate("/students/add")}
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and view performance metrics
          </p>
        </div>
        <Button
          onClick={() => navigate("/students/add")}
          icon="Plus"
          className="shadow-lg"
        >
          Add Student
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search students..."
          className="w-full md:w-96"
        />
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Classes</option>
            {getUniqueClasses().map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="name">Sort by Name</option>
            <option value="studentId">Sort by ID</option>
            <option value="class">Sort by Class</option>
            <option value="grade">Sort by Grade</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <StudentCard
            key={student.Id}
            student={student}
            grades={getStudentGrades(student.Id)}
            attendance={getStudentAttendance(student.Id)}
            onClick={handleStudentClick}
          />
        ))}
      </div>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <ApperIcon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default StudentList