import axios from 'axios'
import router from '../router'
import { useUserStore } from '../stores/user'

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/auth/login')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance