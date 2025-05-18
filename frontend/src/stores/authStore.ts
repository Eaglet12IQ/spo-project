import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { fetchWithTokenCheck } from '../utils/http'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function initializeUserFromToken() {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.user_id || payload.sub
        // Здесь можно добавить дополнительные проверки токена, например, срок действия
      user.value = {
        id: userId,
        username: payload.username || '',
        email: payload.email || '',
      }
      } catch (error) {
        console.error('Ошибка при декодировании токена:', error)
        user.value = null
      }
    } else {
      user.value = null
    }
  }

  function updateAccessToken(newToken: string) {
    localStorage.setItem('access_token', newToken)
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]))
      const userId = payload.user_id || payload.sub
      user.value = {
        id: userId,
        username: payload.username || '',
        email: payload.email || '',
      }
    } catch (error) {
      console.error('Ошибка при декодировании нового токена:', error)
      user.value = null
    }
  }

  async function login(identifier: string, password: string) {
    try {
      const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: identifier, password }),
        credentials: 'include'  // ⬅️ ОБЯЗАТЕЛЬНО
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()

      localStorage.setItem('access_token', data.access_token)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      const userId = payload.user_id || payload.sub // зависит от бэка
      user.value = {
        id: userId,
        username: data.username,
        email: data.email,
      }
      return user.value
    } catch (error) {
      throw error
    }
  }

  async function register(userData: { email: string, password: string, username: string }) {
    try {
      const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password: userData.password,
          re_password: userData.password
        }),
        credentials: 'include'  // ⬅️ ОБЯЗАТЕЛЬНО
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      const userId = payload.user_id || payload.sub // зависит от бэка
      user.value = {
        id: userId,
        username: data.username,
        email: data.email,
      }
      return user.value
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      const token = localStorage.getItem('access_token')

      const response = await fetchWithTokenCheck('http://127.0.0.1:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'  // ⬅️ ОБЯЗАТЕЛЬНО
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Logout failed')
      }

      // Очистка пользователя и токена
      localStorage.removeItem('access_token')
      user.value = null
    } catch (error) {
      throw error
    }
  }

  return { user, isAuthenticated, login, register, logout, initializeUserFromToken, updateAccessToken }
})
