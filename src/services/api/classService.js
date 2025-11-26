import classesData from "@/services/mockData/classes.json"

class ClassService {
  constructor() {
    this.classes = [...classesData]
  }

  async getAll() {
    await this.delay(200)
    return [...this.classes]
  }

  async getById(id) {
    await this.delay(200)
    const classRecord = this.classes.find(c => c.Id === parseInt(id))
    return classRecord ? { ...classRecord } : null
  }

  async create(classData) {
    await this.delay(300)
    const maxId = Math.max(...this.classes.map(c => c.Id), 0)
    const newClass = {
      ...classData,
      Id: maxId + 1,
      studentCount: 0
    }
    this.classes.push(newClass)
    return { ...newClass }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.classes.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return null
    
    this.classes[index] = { ...this.classes[index], ...data }
    return { ...this.classes[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.classes.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return false
    
    this.classes.splice(index, 1)
    return true
  }

  async updateStudentCount(className, count) {
    await this.delay(200)
    const classRecord = this.classes.find(c => c.name === className)
    if (classRecord) {
      classRecord.studentCount = count
      return { ...classRecord }
    }
    return null
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new ClassService()