import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Students from "@/components/pages/Students";
import Attendance from "@/components/pages/Attendance";
import SearchBar from "@/components/molecules/SearchBar";
import StudentCard from "@/components/molecules/StudentCard";

const StudentList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterClass, setFilterClass] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all required data
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load students, grades, and attendance in parallel
        const [studentsData, gradesData, attendanceData] = await Promise.all([
          studentService.getAll(),
          gradeService.getAll(),
          attendanceService.getAll()
        ]);

        setStudents(studentsData || []);
        setGrades(gradesData || []);
        setAttendance(attendanceData || []);
      } catch (err) {
        console.error("Error loading student data:", err?.message || err);
        setError(err?.message || "Failed to load student data");
        toast.error("Failed to load student data");
        setStudents([]);
        setGrades([]);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Transform database fields to UI-expected format
  const transformStudent = (student) => ({
    ...student,
    name: student.Name || '',
    studentId: student.student_id_c || '',
    email: student.email_c || '',
    phone: student.phone_c || '',
    photo: student.photo_c || null,
    class: student.class_c?.Name || ''
  });

  // Get transformed students
  const transformedStudents = students.map(transformStudent);

  const handleStudentClick = (student) => {
    navigate(`/students/${student.Id}`);
  };
const getStudentGrades = (studentId) => {
    return grades.filter(g => g.student_c === studentId || g.studentId === String(studentId));
  };

  const getStudentAttendance = (studentId) => {
    return attendance.filter(a => a.student_c === studentId || a.studentId === String(studentId));
  };

  const getUniqueClasses = () => {
    const classes = transformedStudents
      .map(student => student.class)
      .filter(cls => cls && cls.trim())
      .filter((cls, index, arr) => arr.indexOf(cls) === index);
    return classes.sort();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <Loading />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <ErrorView 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Show empty state
  if (!students.length) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <Empty 
          message="No students found"
          description="There are no students in the system yet."
        />
      </div>
    );
  }

  const filteredStudents = getFilteredAndSortedStudents()
  const totalStudents = transformedStudents.length
  const activeStudents = transformedStudents.length // Assuming all are active for now
  const recentEnrollments = transformedStudents.filter(s => {
    if (!s.enrollment_date_c) return false
    const enrollmentDate = new Date(s.enrollment_date_c)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return enrollmentDate >= thirtyDaysAgo
  }).length

  const getFilteredAndSortedStudents = () => {
    let filtered = [...transformedStudents]

    // Apply class filter
    if (filterClass) {
      filtered = filtered.filter(student => 
        (student.class || '').toLowerCase().includes(filterClass.toLowerCase())
      )
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(student =>
        (student.name || '').toLowerCase().includes(term) ||
        (student.studentId || '').toLowerCase().includes(term) ||
        (student.class || '').toLowerCase().includes(term) ||
        (student.email || '').toLowerCase().includes(term)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "")
        case "studentId":
          return (a.studentId || "").localeCompare(b.studentId || "")
        case "class":
          return (a.class || "").localeCompare(b.class || "")
        case "grade":
          const aGrades = grades.filter(g => g.student_c === a.Id || g.studentId === String(a.Id || 0))
          const bGrades = grades.filter(g => g.student_c === b.Id || g.studentId === String(b.Id || 0))
          const aAvg = aGrades.length > 0 ? aGrades.reduce((sum, g) => sum + (parseFloat(g.score || g.grade || 0)), 0) / aGrades.length : 0
          const bAvg = bGrades.length > 0 ? bGrades.reduce((sum, g) => sum + (parseFloat(g.score || g.grade || 0)), 0) / bGrades.length : 0
          return bAvg - aAvg
        case "attendance":
          const aAttendance = attendance.filter(a => a.student_c === a.Id || a.studentId === String(a.Id || 0))
          const bAttendance = attendance.filter(a => a.student_c === b.Id || a.studentId === String(b.Id || 0))
          const aRate = aAttendance.length > 0 ? aAttendance.filter(att => att.status === 'present').length / aAttendance.length : 0
          const bRate = bAttendance.length > 0 ? bAttendance.filter(att => att.status === 'present').length / bAttendance.length : 0
          return bRate - aRate
        default:
          return 0
      }
    })

    return filtered
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and track student information</p>
        </div>
        <Button 
          onClick={() => navigate('/students/new')}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="Users" className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-semibold text-gray-900">{activeStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ApperIcon name="UserCheck" className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{recentEnrollments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-semibold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>

{/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search students..."
              className="w-full md:w-96"
            />
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="">All Classes</option>
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
                <option value="attendance">Sort by Attendance</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
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
      </div>
    </div>
  );
}

export default StudentList