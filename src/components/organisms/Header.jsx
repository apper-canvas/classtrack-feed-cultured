import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import classService from "@/services/api/classService"

const Header = ({ onAddStudent, onMobileMenuToggle }) => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("all")

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const data = await classService.getAll()
      setClasses(data)
    } catch (error) {
      console.error("Failed to load classes:", error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={24} className="text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ClassTrack
              </h1>
              <p className="text-sm text-gray-600">Student Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
<option key={cls.Id} value={cls.Name}>
                  {cls.Name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            onClick={onAddStudent}
            icon="Plus"
            className="shadow-lg"
          >
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">Teacher</p>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header