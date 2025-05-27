import axios from '@/lib/axiosInstance'

/**
 * @typedef {Object} LoginPayload
 * @property {string} username - ชื่อผู้ใช้
 * @property {string} password - รหัสผ่าน
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access_token
 * @property {{ id: string, username: string, fullname: string, tel: string, email: string, birthday: string, created_at: string }} user
 */

/**
 * เข้าสู่ระบบด้วย username และ password
 * @param {LoginPayload} payload
 * @returns {Promise<AuthResponse>}
 */
export async function login(payload) {
  const res = await axios.post('/auth/login', payload)
  const { access_token, user } = res.data
  localStorage.setItem('access_token', access_token)
  return { access_token, user }
}

/**
 * ออกจากระบบ
 */
export function logout() {
  localStorage.removeItem('access_token')
}