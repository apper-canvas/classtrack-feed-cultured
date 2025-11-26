import { getApperClient } from "@/services/apperClient"
import { format } from "date-fns"

class AttendanceService {
  constructor() {
    this.tableName = 'attendance_c'
    this.lookupFields = ['student_id_c']
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching attendance:", error)
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error)
      return null
    }
  }

  async getByStudent(studentId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "student_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(studentId)]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching attendance by student:", error)
      return []
    }
  }

  async getByDate(date) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const dateStr = format(new Date(date), "yyyy-MM-dd")
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "EqualTo",
          "Values": [dateStr]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching attendance by date:", error)
      return []
    }
  }

  async create(record) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = {}
      if (record.Name) recordData.Name = record.Name
      if (record.student_id_c) recordData.student_id_c = parseInt(record.student_id_c)
      if (record.date_c) recordData.date_c = record.date_c
      if (record.status_c) recordData.status_c = record.status_c
      if (record.notes_c) recordData.notes_c = record.notes_c

      const params = {
        records: [recordData]
      }

      const response = await apperClient.createRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} attendance records: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating attendance record:", error)
      return null
    }
  }

  async update(id, data) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = { Id: parseInt(id) }
      if (data.Name !== undefined) recordData.Name = data.Name
      if (data.student_id_c !== undefined) recordData.student_id_c = parseInt(data.student_id_c)
      if (data.date_c !== undefined) recordData.date_c = data.date_c
      if (data.status_c !== undefined) recordData.status_c = data.status_c
      if (data.notes_c !== undefined) recordData.notes_c = data.notes_c

      const params = {
        records: [recordData]
      }

      const response = await apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} attendance records: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating attendance record:", error)
      return null
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} attendance records: ${JSON.stringify(failed)}`)
        }
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting attendance record:", error)
      return false
    }
  }

  async markAttendance(studentId, date, status, notes = "") {
    try {
      const dateStr = format(new Date(date), "yyyy-MM-dd")
      
      // Check if attendance already exists for this date and student
      const existing = await this.getByDate(dateStr)
      const existingRecord = existing.find(a => 
        a.student_id_c?.Id === parseInt(studentId) || a.student_id_c === parseInt(studentId)
      )
      
      if (existingRecord) {
        // Update existing record
        return this.update(existingRecord.Id, { status_c: status, notes_c: notes })
      } else {
        // Create new record
        return this.create({ 
          student_id_c: parseInt(studentId), 
          date_c: dateStr, 
          status_c: status, 
          notes_c: notes 
        })
      }
    } catch (error) {
      console.error("Error marking attendance:", error)
      return null
    }
  }

  async getAttendanceRate(studentId) {
    try {
      const records = await this.getByStudent(studentId)
      if (records.length === 0) return 0
      
      const presentCount = records.filter(r => r.status_c === "present").length
      return Math.round((presentCount / records.length) * 100)
    } catch (error) {
      console.error("Error calculating attendance rate:", error)
      return 0
    }
  }

  async getClassAttendanceRate() {
    try {
      const attendance = await this.getAll()
      if (attendance.length === 0) return 0
      
      const presentCount = attendance.filter(r => r.status_c === "present").length
      return Math.round((presentCount / attendance.length) * 100)
    } catch (error) {
      console.error("Error calculating class attendance rate:", error)
      return 0
    }
  }
}

export default new AttendanceService()

export default new AttendanceService()