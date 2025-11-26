import { getApperClient } from "@/services/apperClient";
import { format } from "date-fns";
class AssignmentService {
  constructor() {
    this.tableName = 'assignment_c'
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "score_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments:", error)
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "score_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error)
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "score_c"}}
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
      console.error("Error fetching assignments by student:", error)
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "score_c"}}
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
      console.error("Error fetching assignments by subject:", error)
      return []
    }
  }

  async getByStatus(status) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "score_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching assignments by status:", error)
      return []
    }
  }

  async create(assignment) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = {}
      if (assignment.Name) recordData.Name = assignment.Name
      if (assignment.student_id_c) recordData.student_id_c = parseInt(assignment.student_id_c)
      if (assignment.title_c) recordData.title_c = assignment.title_c
      if (assignment.subject_c) recordData.subject_c = assignment.subject_c
      if (assignment.due_date_c) recordData.due_date_c = assignment.due_date_c
      if (assignment.submission_date_c) recordData.submission_date_c = assignment.submission_date_c
      if (assignment.status_c) recordData.status_c = assignment.status_c
      if (assignment.max_score_c !== undefined) recordData.max_score_c = assignment.max_score_c
      if (assignment.score_c !== undefined) recordData.score_c = assignment.score_c

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
          console.error(`Failed to create ${failed.length} assignments: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating assignment:", error)
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
      if (data.title_c !== undefined) recordData.title_c = data.title_c
      if (data.subject_c !== undefined) recordData.subject_c = data.subject_c
      if (data.due_date_c !== undefined) recordData.due_date_c = data.due_date_c
      if (data.submission_date_c !== undefined) recordData.submission_date_c = data.submission_date_c
      if (data.status_c !== undefined) recordData.status_c = data.status_c
      if (data.max_score_c !== undefined) recordData.max_score_c = data.max_score_c
      if (data.score_c !== undefined) recordData.score_c = data.score_c

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
          console.error(`Failed to update ${failed.length} assignments: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating assignment:", error)
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
          console.error(`Failed to delete ${failed.length} assignments: ${JSON.stringify(failed)}`)
        }
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting assignment:", error)
      return false
    }
  }

  async submitAssignment(id, submissionDate = new Date()) {
    const dateStr = format(new Date(submissionDate), "yyyy-MM-dd")
    return this.update(id, { 
      submission_date_c: dateStr,
      status_c: "submitted" 
    })
  }

  async gradeAssignment(id, score) {
    return this.update(id, { 
      score_c: score,
      status_c: "graded" 
    })
  }

  async getPendingCount() {
    try {
      const assignments = await this.getByStatus("pending")
      return assignments.length
    } catch (error) {
      console.error("Error getting pending count:", error)
      return 0
    }
  }

  async getStudentProgress(studentId) {
    try {
      const studentAssignments = await this.getByStudent(studentId)
      if (studentAssignments.length === 0) return { total: 0, completed: 0, pending: 0, graded: 0 }
      
      return {
        total: studentAssignments.length,
        completed: studentAssignments.filter(a => a.status_c === "submitted" || a.status_c === "graded").length,
        pending: studentAssignments.filter(a => a.status_c === "pending").length,
        graded: studentAssignments.filter(a => a.status_c === "graded").length
      }
    } catch (error) {
      console.error("Error getting student progress:", error)
      return { total: 0, completed: 0, pending: 0, graded: 0 }
    }
  }
}
export default new AssignmentService()