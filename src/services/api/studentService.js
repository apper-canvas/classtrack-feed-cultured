import { getApperClient } from "@/services/apperClient";

class StudentService {
  constructor() {
    this.tableName = 'student_c';
    this.lookupFields = ['class_c.Id', 'class_c.Name'];
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "class_c"}}
        ]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching students:", error)
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "class_c"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error)
      return null
    }
  }

  async getByClass(classId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "class_c"}}
        ],
        where: [{
          "FieldName": "class_c",
          "Operator": "EqualTo",
          "Values": [parseInt(classId)]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching students by class:", error)
      return []
    }
  }

  async create(student) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Prepare data with only updateable fields
      const recordData = {}
      if (student.Name) recordData.Name = student.Name
      if (student.student_id_c) recordData.student_id_c = student.student_id_c
      if (student.email_c) recordData.email_c = student.email_c
      if (student.phone_c) recordData.phone_c = student.phone_c
      if (student.photo_c) recordData.photo_c = student.photo_c
      if (student.date_of_birth_c) recordData.date_of_birth_c = student.date_of_birth_c
      if (student.enrollment_date_c) recordData.enrollment_date_c = student.enrollment_date_c
      if (student.guardian_name_c) recordData.guardian_name_c = student.guardian_name_c
      if (student.guardian_contact_c) recordData.guardian_contact_c = student.guardian_contact_c
      if (student.class_c) recordData.class_c = parseInt(student.class_c)

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
          console.error(`Failed to create ${failed.length} students: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating student:", error)
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
      if (data.student_id_c !== undefined) recordData.student_id_c = data.student_id_c
      if (data.email_c !== undefined) recordData.email_c = data.email_c
      if (data.phone_c !== undefined) recordData.phone_c = data.phone_c
      if (data.photo_c !== undefined) recordData.photo_c = data.photo_c
      if (data.date_of_birth_c !== undefined) recordData.date_of_birth_c = data.date_of_birth_c
      if (data.enrollment_date_c !== undefined) recordData.enrollment_date_c = data.enrollment_date_c
      if (data.guardian_name_c !== undefined) recordData.guardian_name_c = data.guardian_name_c
      if (data.guardian_contact_c !== undefined) recordData.guardian_contact_c = data.guardian_contact_c
      if (data.class_c !== undefined) recordData.class_c = parseInt(data.class_c)

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
          console.error(`Failed to update ${failed.length} students: ${JSON.stringify(failed)}`)
        }
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating student:", error)
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
          console.error(`Failed to delete ${failed.length} students: ${JSON.stringify(failed)}`)
        }
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting student:", error)
      return false
    }
  }

  async search(query) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "guardian_name_c"}},
          {"field": {"Name": "guardian_contact_c"}},
          {"field": {"Name": "class_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
"subGroups": [{
            "conditions": [
              {
                "FieldName": "Name",
                "Operator": "Contains",
                "Values": [query]
              },
              {
                "FieldName": "student_id_c",
                "Operator": "Contains",
                "Values": [query]
              },
              {
                "FieldName": "email_c",
                "Operator": "Contains",
                "Values": [query]
              }
            ],
            "operator": "OR"
          }]
        }]
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error searching students:", error)
      return []
    }
  }
}

export default new StudentService()