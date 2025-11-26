import assignmentsData from "@/services/mockData/assignments.json"
import { format } from "date-fns"

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.assignments]
  }

  async getById(id) {
    await this.delay(200)
    const assignment = this.assignments.find(a => a.Id === parseInt(id))
    return assignment ? { ...assignment } : null
  }

  async getByStudent(studentId) {
    await this.delay(250)
    return this.assignments.filter(a => a.studentId === String(studentId)).map(a => ({ ...a }))
  }

  async getBySubject(subject) {
    await this.delay(250)
    return this.assignments.filter(a => a.subject === subject).map(a => ({ ...a }))
  }

  async getByStatus(status) {
    await this.delay(250)
    return this.assignments.filter(a => a.status === status).map(a => ({ ...a }))
  }

  async create(assignment) {
    await this.delay(300)
    const maxId = Math.max(...this.assignments.map(a => a.Id), 0)
    const newAssignment = {
      ...assignment,
      Id: maxId + 1,
      dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd"),
      submissionDate: assignment.submissionDate ? format(new Date(assignment.submissionDate), "yyyy-MM-dd") : ""
    }
    this.assignments.push(newAssignment)
    return { ...newAssignment }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return null
    
    const updatedAssignment = { ...this.assignments[index], ...data }
    
    if (updatedAssignment.dueDate) {
      updatedAssignment.dueDate = format(new Date(updatedAssignment.dueDate), "yyyy-MM-dd")
    }
    if (updatedAssignment.submissionDate) {
      updatedAssignment.submissionDate = format(new Date(updatedAssignment.submissionDate), "yyyy-MM-dd")
    }
    
    this.assignments[index] = updatedAssignment
    return { ...updatedAssignment }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.assignments.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return false
    
    this.assignments.splice(index, 1)
    return true
  }

  async submitAssignment(id, submissionDate = new Date()) {
    await this.delay(300)
    const dateStr = format(new Date(submissionDate), "yyyy-MM-dd")
    return this.update(id, { 
      submissionDate: dateStr,
      status: "submitted" 
    })
  }

  async gradeAssignment(id, score) {
    await this.delay(300)
    return this.update(id, { 
      score: score,
      status: "graded" 
    })
  }

  async getPendingCount() {
    await this.delay(200)
    return this.assignments.filter(a => a.status === "pending").length
  }

  async getStudentProgress(studentId) {
    await this.delay(200)
    const studentAssignments = this.assignments.filter(a => a.studentId === String(studentId))
    if (studentAssignments.length === 0) return { total: 0, completed: 0, pending: 0, graded: 0 }
    
    return {
      total: studentAssignments.length,
      completed: studentAssignments.filter(a => a.status === "submitted" || a.status === "graded").length,
      pending: studentAssignments.filter(a => a.status === "pending").length,
      graded: studentAssignments.filter(a => a.status === "graded").length
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new AssignmentService()