import gradesData from "@/services/mockData/grades.json"

class GradeService {
  constructor() {
    this.grades = [...gradesData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.grades]
  }

  async getById(id) {
    await this.delay(200)
    const grade = this.grades.find(g => g.Id === parseInt(id))
    return grade ? { ...grade } : null
  }

  async getByStudent(studentId) {
    await this.delay(250)
    return this.grades.filter(g => g.studentId === String(studentId)).map(g => ({ ...g }))
  }

  async getBySubject(subject) {
    await this.delay(250)
    return this.grades.filter(g => g.subject === subject).map(g => ({ ...g }))
  }

  async create(grade) {
    await this.delay(300)
    const maxId = Math.max(...this.grades.map(g => g.Id), 0)
    const newGrade = {
      ...grade,
      Id: maxId + 1,
      percentage: Math.round((grade.marks / grade.totalMarks) * 100)
    }
    this.grades.push(newGrade)
    return { ...newGrade }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.grades.findIndex(g => g.Id === parseInt(id))
    if (index === -1) return null
    
    const updatedGrade = { ...this.grades[index], ...data }
    if (updatedGrade.marks && updatedGrade.totalMarks) {
      updatedGrade.percentage = Math.round((updatedGrade.marks / updatedGrade.totalMarks) * 100)
    }
    
    this.grades[index] = updatedGrade
    return { ...updatedGrade }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.grades.findIndex(g => g.Id === parseInt(id))
    if (index === -1) return false
    
    this.grades.splice(index, 1)
    return true
  }

  async getAverageByStudent(studentId) {
    await this.delay(200)
    const studentGrades = this.grades.filter(g => g.studentId === String(studentId))
    if (studentGrades.length === 0) return 0
    
    const total = studentGrades.reduce((sum, grade) => sum + grade.percentage, 0)
    return Math.round(total / studentGrades.length)
  }

  async getClassAverage() {
    await this.delay(200)
    if (this.grades.length === 0) return 0
    
    const total = this.grades.reduce((sum, grade) => sum + grade.percentage, 0)
    return Math.round(total / this.grades.length)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new GradeService()