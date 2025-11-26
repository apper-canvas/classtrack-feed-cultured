import attendanceData from "@/services/mockData/attendance.json"
import { format } from "date-fns"

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData]
  }

  async getAll() {
    await this.delay(250)
    return [...this.attendance]
  }

  async getById(id) {
    await this.delay(200)
    const record = this.attendance.find(a => a.Id === parseInt(id))
    return record ? { ...record } : null
  }

  async getByStudent(studentId) {
    await this.delay(250)
    return this.attendance.filter(a => a.studentId === String(studentId)).map(a => ({ ...a }))
  }

  async getByDate(date) {
    await this.delay(250)
    const dateStr = format(new Date(date), "yyyy-MM-dd")
    return this.attendance.filter(a => a.date === dateStr).map(a => ({ ...a }))
  }

  async create(record) {
    await this.delay(300)
    const maxId = Math.max(...this.attendance.map(a => a.Id), 0)
    const newRecord = {
      ...record,
      Id: maxId + 1,
      date: format(new Date(record.date), "yyyy-MM-dd")
    }
    this.attendance.push(newRecord)
    return { ...newRecord }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return null
    
    const updatedRecord = { ...this.attendance[index], ...data }
    if (updatedRecord.date) {
      updatedRecord.date = format(new Date(updatedRecord.date), "yyyy-MM-dd")
    }
    
    this.attendance[index] = updatedRecord
    return { ...updatedRecord }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.attendance.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return false
    
    this.attendance.splice(index, 1)
    return true
  }

  async markAttendance(studentId, date, status, notes = "") {
    await this.delay(300)
    const dateStr = format(new Date(date), "yyyy-MM-dd")
    
    // Check if attendance already exists for this date and student
    const existing = this.attendance.find(a => 
      a.studentId === String(studentId) && a.date === dateStr
    )
    
    if (existing) {
      // Update existing record
      return this.update(existing.Id, { status, notes })
    } else {
      // Create new record
      return this.create({ studentId: String(studentId), date: dateStr, status, notes })
    }
  }

  async getAttendanceRate(studentId) {
    await this.delay(200)
    const records = this.attendance.filter(a => a.studentId === String(studentId))
    if (records.length === 0) return 0
    
    const presentCount = records.filter(r => r.status === "present").length
    return Math.round((presentCount / records.length) * 100)
  }

  async getClassAttendanceRate() {
    await this.delay(200)
    if (this.attendance.length === 0) return 0
    
    const presentCount = this.attendance.filter(r => r.status === "present").length
    return Math.round((presentCount / this.attendance.length) * 100)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new AttendanceService()