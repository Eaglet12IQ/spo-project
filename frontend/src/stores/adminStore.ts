import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchWithTokenCheck } from '../utils/http'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const collectors = ref([])
  const token = localStorage.getItem('access_token')
  

  async function fetchUsers() {
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      users.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchCollectors() {
    try {
      const response = await fetchWithTokenCheck('http://localhost:8000/api/admin/collectors', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch collectors')
      }
      collectors.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  return { users, collectors, fetchUsers, fetchCollectors }
})
