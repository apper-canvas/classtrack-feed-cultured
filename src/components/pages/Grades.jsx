import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeEntry from "@/components/molecules/GradeEntry";

const Grades = () => {
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [showGradeEntry, setShowGradeEntry] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Biology"]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ])
      
      setStudents(studentsData)
      setGrades(gradesData)
    } catch (err) {
      setError("Failed to load grades data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGrade = async (gradeData) => {
    try {
      const newGrade = await gradeService.create(gradeData)
      setGrades([...grades, newGrade])
      setShowGradeEntry(false)
      setSelectedStudent(null)
      toast.success("Grade saved successfully!")
    } catch (err) {
      toast.error("Failed to save grade")
      console.error("Error saving grade:", err)
    }
  }

  const getStudentGrades = (studentId) => {
return grades.filter(g => {
      const gradeStudentId = g.student_id_c?.Id || g.student_id_c;
      return String(gradeStudentId) === String(studentId);
    });
  }

  const getStudentAverage = (studentId) => {
    const studentGrades = getStudentGrades(studentId)
    if (studentGrades.length === 0) return 0
    
return Math.round(studentGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / studentGrades.length)
  }

  const getFilteredStudents = () => {
    let filtered = [...students]
    
    if (selectedClass !== "all") {
filtered = filtered.filter(s => (s.class_c?.Name || s.class_c) === selectedClass)
    }
    
    // Sort by average grade (highest first)
    filtered.sort((a, b) => getStudentAverage(b.Id) - getStudentAverage(a.Id))
    
    return filtered
  }

  const getUniqueClasses = () => {
return [...new Set(students.map(s => s.class_c?.Name || s.class_c))].sort()
  }

  const getSubjectGrades = () => {
    if (selectedSubject === "all") return grades
return grades.filter(g => g.subject_c === selectedSubject)
  }

  const getClassAverage = () => {
    const filteredGrades = getSubjectGrades()
    if (filteredGrades.length === 0) return 0
return Math.round(filteredGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0) / filteredGrades.length)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  if (students.length === 0) {
    return (
      <Empty
        icon="Trophy"
        title="No Students Found"
        description="Add students to start managing grades."
        actionText="Add Student"
      />
    )
  }

  if (showGradeEntry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              setShowGradeEntry(false)
              setSelectedStudent(null)
            }}
            variant="ghost"
            icon="ArrowLeft"
          >
            Back to Grades
          </Button>
        </div>
        
        <GradeEntry
          student={selectedStudent}
          onSave={handleSaveGrade}
          onCancel={() => {
            setShowGradeEntry(false)
            setSelectedStudent(null)
          }}
        />
      </div>
    )
  }

  const filteredStudents = getFilteredStudents()
  const classAverage = getClassAverage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-gray-600 mt-1">
            Manage student grades and track academic performance
          </p>
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-4">
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
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{classAverage}%</div>
            <div className="text-sm text-gray-600">Class Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Students Grade Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Student Grades</h3>
            <div className="text-sm text-gray-600">
              {filteredStudents.length} students
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map(student => {
                const studentGrades = getStudentGrades(student.Id)
                const average = getStudentAverage(student.Id)
                
                return (
                  <div key={student.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{student.studentId}</span>
                          <span>•</span>
                          <span>{student.class}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{average}%</div>
                        <div className="text-xs text-gray-600">Average</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{studentGrades.length}</div>
                        <div className="text-xs text-gray-600">Grades</div>
                      </div>

                      <Badge 
                        variant={
                          average >= 90 ? "success" : 
                          average >= 80 ? "primary" : 
                          average >= 70 ? "warning" : "error"
                        }
                      >
                        {average >= 90 ? "A" : average >= 80 ? "B" : average >= 70 ? "C" : average >= 60 ? "D" : "F"}
                      </Badge>

                      <Button
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowGradeEntry(true)
                        }}
                        size="sm"
                        icon="Plus"
                      >
                        Add Grade
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Empty
              icon="Trophy"
              title="No Students Found"
              description="No students match the current filters."
            />
          )}
        </CardContent>
      </Card>

      {/* Recent Grades */}
      {grades.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Recent Grades</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
{grades.slice(-10).reverse().map(grade => {
                const studentId = grade.student_id_c?.Id || grade.student_id_c;
                const student = students.find(s => s.Id === parseInt(studentId))
                if (!student) return null
                
                return (
<div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student?.photo_c || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                        alt={student?.Name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{student?.Name}</div>
                        <div className="text-sm text-gray-600">{grade.subject_c}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{grade.marks_c}/{grade.total_marks_c}</div>
                      <div className="text-sm text-gray-600">{grade.percentage_c}%</div>
                    </div>
                    
                    <Badge 
                      variant={
                        grade.percentage_c >= 90 ? "success" : 
                        grade.percentage_c >= 80 ? "primary" : 
                        grade.percentage_c >= 70 ? "warning" : "error"
                      }
                      size="sm"
                    >
                      {grade.percentage_c >= 90 ? "A" : grade.percentage_c >= 80 ? "B" : grade.percentage_c >= 70 ? "C" : grade.percentage_c >= 60 ? "D" : "F"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Grades