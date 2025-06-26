import axios from '@/lib/axiosInstance'

/**
 * @typedef {Object} EmployeePayload
 * @property {string} username
 * @property {string} password
 * @property {string} fullname
 * @property {string} tel
 * @property {string} email
 * @property {string} birthday
 */

/**
 * @typedef {Object} EmployeeResponse
 * @property {string} id
 * @property {string} username
 * @property {string} fullname
 * @property {string} tel
 * @property {string} email
 * @property {string} birthday
 * @property {string} created_at
 */

/** @param {EmployeePayload} payload @returns {Promise<EmployeeResponse>} */
export async function registerEmployee(payload) {
  const res = await axios.post('/employees/register', payload)
  return res.data.data
}

/** @param {string} id @returns {Promise<EmployeeResponse>} */
export async function getEmployeeById(id) {
  const res = await axios.get(`/employees/find/${id}`)
  return res.data.data
}

/** @param {string} id @returns {Promise<EmployeeResponse>} */
export async function getEmployeeMe() {
  const res = await axios.get(`/employees/me`)
  return res.data.data
}

/**
 * @param {string} q
 * @param {number} [page=1]
 * @param {number} [pageSize=10]
 * @returns {Promise<{items: EmployeeResponse[], pagination: Object}>}
 */
export async function searchEmployees(q, page = 1, pageSize = 10) {
  const res = await axios.get('/employees/search', {
    params: { q, page, pageSize },
  })
  return res.data.data
}