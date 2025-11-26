import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const GradeEntry = ({ student, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: "",
    marks: "",
    totalMarks: "100",
    examType: "Assignment",
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Biology"]
  const examTypes = ["Assignment", "Quiz", "Mid-term", "Final", "Project", "Presentation"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject || !formData.marks || !formData.totalMarks) return

    setLoading(true)
    try {
      await onSave({
        ...formData,
        studentId: student.Id.toString(),
        marks: parseInt(formData.marks),
        totalMarks: parseInt(formData.totalMarks),
        percentage: Math.round((parseInt(formData.marks) / parseInt(formData.totalMarks)) * 100)
      })
    } finally {
      setLoading(false)
    }
  }

  const percentage = formData.marks && formData.totalMarks 
    ? Math.round((parseInt(formData.marks) / parseInt(formData.totalMarks)) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <img
            src={student.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
            alt={student.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.studentId} - {student.class}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </Select>

            <Select
              label="Exam Type"
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
            >
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Marks Obtained"
              required
              min="0"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            />

            <Input
              type="number"
              label="Total Marks"
              required
              min="1"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Percentage</label>
              <div className="flex items-center h-10 px-4 bg-gray-50 border border-gray-300 rounded-lg">
                <span className="text-lg font-semibold text-gray-800">{percentage}%</span>
              </div>
            </div>
          </div>

          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.subject || !formData.marks || !formData.totalMarks}
            >
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Grade
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default GradeEntry