import studentsData from "@/services/mockData/students.json"

class StudentService {
  constructor() {
    this.students = [...studentsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.students]
  }

  async getById(id) {
    await this.delay(200)
    const student = this.students.find(s => s.Id === parseInt(id))
    return student ? { ...student } : null
  }

  async getByClass(className) {
    await this.delay(250)
    return this.students.filter(s => s.class === className).map(s => ({ ...s }))
  }

  async create(student) {
    await this.delay(300)
    const maxId = Math.max(...this.students.map(s => s.Id), 0)
    const newStudent = {
      ...student,
      Id: maxId + 1,
      studentId: `ST${String(maxId + 1).padStart(3, '0')}`
    }
    this.students.push(newStudent)
    return { ...newStudent }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) return null
    
    this.students[index] = { ...this.students[index], ...data }
    return { ...this.students[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.students.findIndex(s => s.Id === parseInt(id))
    if (index === -1) return false
    
    this.students.splice(index, 1)
    return true
  }

  async search(query) {
    await this.delay(200)
    const searchTerm = query.toLowerCase()
    return this.students.filter(student =>
      student.name.toLowerCase().includes(searchTerm) ||
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    ).map(s => ({ ...s }))
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new StudentService()