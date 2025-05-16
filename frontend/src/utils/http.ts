import { useAuthStore } from '../stores/authStore'

export async function fetchWithTokenCheck(input: RequestInfo, init?: RequestInit) {
  const authStore = useAuthStore()

  const response = await fetch(input, init)

  // Check for the "New-Access-Token" header
  const newAccessToken = response.headers.get('New-Access-Token')
  if (newAccessToken) {
    // Update the access token in localStorage and authStore
    localStorage.setItem('access_token', newAccessToken)
    console.log(newAccessToken)
    authStore.updateAccessToken(newAccessToken)
  }

  return response
}
