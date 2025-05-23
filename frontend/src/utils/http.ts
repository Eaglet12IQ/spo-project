import { useAuthStore } from '../stores/authStore'

export async function fetchWithTokenCheck(input: RequestInfo, init?: RequestInit) {
  const authStore = useAuthStore()

  const response = await fetch(input, init)

  const newAccessToken = response.headers.get('New-Access-Token')
  if (newAccessToken) {
    localStorage.setItem('access_token', newAccessToken)
    console.log(newAccessToken)
    authStore.updateAccessToken(newAccessToken)
  }

  return response
}
