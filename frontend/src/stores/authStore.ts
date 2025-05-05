import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Mock user data
  const mockUser: User = {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Passionate stamp collector since 2005. Specializing in vintage European stamps.',
    location: 'New York, USA',
    memberSince: '2021-05-15',
    collectionCount: 7,
    stampCount: 342,
    following: 28,
    followers: 47
  }

  function login(email: string, password: string) {
    // Mock login - in a real app, this would call an API
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        user.value = mockUser
        resolve(mockUser)
      }, 800)
    })
  }

  function register(userData: { email: string, password: string, username: string }) {
    // Mock registration
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        user.value = { ...mockUser, email: userData.email, username: userData.username }
        resolve(user.value)
      }, 800)
    })
  }

  function logout() {
    // Mock logout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        user.value = null
        resolve()
      }, 300)
    })
  }

  return { user, isAuthenticated, login, register, logout }
})