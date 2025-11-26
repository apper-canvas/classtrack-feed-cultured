import { getApperClient } from "@/services/apperClient"

class GradeService {
  constructor() {
    this.tableName = 'grade_c'
this.lookupFields = ['student_id_c.Id', 'student_id_c.Name']
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "total_marks_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "date_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching grades:", error)
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "total_marks_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "date_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error)
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
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "total_marks_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "date_c"}}
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
      console.error("Error fetching grades by student:", error)
      return []
    }
  }

  async getBySubject(subject) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "exam_type_c"}},
          {"field": {"Name": "marks_c"}},
          {"field": {"Name": "total_marks_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "date_c"}}
        ],
        where: [{
          "FieldName": "subject_c",
          "Operator": "EqualTo",
          "Values": [subject]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching grades by subject:", error)
      return []
    }
  }

  async create(grade) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = {}
      if (grade.Name) recordData.Name = grade.Name
      if (grade.student_id_c) recordData.student_id_c = parseInt(grade.student_id_c)
      if (grade.subject_c) recordData.subject_c = grade.subject_c
      if (grade.exam_type_c) recordData.exam_type_c = grade.exam_type_c
      if (grade.marks_c !== undefined) recordData.marks_c = grade.marks_c
      if (grade.total_marks_c !== undefined) recordData.total_marks_c = grade.total_marks_c
      if (grade.percentage_c !== undefined) recordData.percentage_c = grade.percentage_c
      if (grade.date_c) recordData.date_c = grade.date_c

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
          console.error(`Failed to create ${failed.length} grades: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating grade:", error)
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
      if (data.subject_c !== undefined) recordData.subject_c = data.subject_c
      if (data.exam_type_c !== undefined) recordData.exam_type_c = data.exam_type_c
      if (data.marks_c !== undefined) recordData.marks_c = data.marks_c
      if (data.total_marks_c !== undefined) recordData.total_marks_c = data.total_marks_c
      if (data.percentage_c !== undefined) recordData.percentage_c = data.percentage_c
      if (data.date_c !== undefined) recordData.date_c = data.date_c

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
          console.error(`Failed to update ${failed.length} grades: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating grade:", error)
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
          console.error(`Failed to delete ${failed.length} grades: ${JSON.stringify(failed)}`)
        }
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting grade:", error)
      return false
    }
  }

  async getAverageByStudent(studentId) {
    try {
      const studentGrades = await this.getByStudent(studentId)
      if (studentGrades.length === 0) return 0
      
      const total = studentGrades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0)
      return Math.round(total / studentGrades.length)
    } catch (error) {
      console.error("Error calculating student average:", error)
      return 0
    }
  }

  async getClassAverage() {
    try {
      const grades = await this.getAll()
      if (grades.length === 0) return 0
      
      const total = grades.reduce((sum, grade) => sum + (grade.percentage_c || 0), 0)
      return Math.round(total / grades.length)
    } catch (error) {
      console.error("Error calculating class average:", error)
      return 0
    }
  }
}

export default new GradeService()