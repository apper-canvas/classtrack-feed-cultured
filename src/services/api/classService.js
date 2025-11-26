import { getApperClient } from "@/services/apperClient";

class ClassService {
  constructor() {
    this.tableName = 'class_c'
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
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "student_count_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching classes:", error)
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
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "student_count_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error)
      return null
    }
  }

  async create(classData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = {}
      if (classData.Name) recordData.Name = classData.Name
      if (classData.academic_year_c) recordData.academic_year_c = classData.academic_year_c
      if (classData.student_count_c !== undefined) recordData.student_count_c = classData.student_count_c

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
          console.error(`Failed to create ${failed.length} classes: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating class:", error)
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
      if (data.academic_year_c !== undefined) recordData.academic_year_c = data.academic_year_c
      if (data.student_count_c !== undefined) recordData.student_count_c = data.student_count_c

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
          console.error(`Failed to update ${failed.length} classes: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating class:", error)
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
          console.error(`Failed to delete ${failed.length} classes: ${JSON.stringify(failed)}`)
        }
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting class:", error)
      return false
    }
  }

  async updateStudentCount(className, count) {
    try {
      const classes = await this.getAll()
      const classRecord = classes.find(c => c.Name === className)
      if (classRecord) {
        return this.update(classRecord.Id, { student_count_c: count })
      }
      return null
    } catch (error) {
      console.error("Error updating student count:", error)
      return null
    }
  }
}

export default new ClassService()