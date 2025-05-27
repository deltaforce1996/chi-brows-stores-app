import axios from '@/lib/axiosInstance'

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {number} quantity
 */

/**
 * @typedef {Object} CreateOrderPayload
 * @property {string} customerId
 * @property {string} [employeeId]
 * @property {OrderItem[]} items
 * @property {string} [notes]
 */

/**
 * @typedef {Object} OrderResponse
 * @property {string} id
 * @property {string} status
 * @property {number} total_amount
 * @property {string} [notes]
 * @property {string} created_at
 * @property {string} updated_at
 */

/** @param {CreateOrderPayload} payload @returns {Promise<OrderResponse>} */
export async function createOrder(payload) {
  const res = await axios.post('/orders/register', payload)
  return res.data.data
}

/** @param {string} id @returns {Promise<OrderResponse>} */
export async function getOrderById(id) {
  const res = await axios.get(`/orders/find/${id}`)
  return res.data.data
}

/** @param {string} id @param {string} status @returns {Promise<OrderResponse>} */
export async function updateOrderStatus(id, status) {
  const res = await axios.put(`/orders/update/${id}/status`, { status })
  return res.data.data
}

/**
 * @param {Object} filters
 * @param {number} [page=1]
 * @param {number} [pageSize=10]
 * @returns {Promise<{items: OrderResponse[], pagination: Object}>}
 */
export async function searchOrders(filters = {}, page = 1, pageSize = 10) {
  const res = await axios.get('/orders/search', {
    params: { ...filters, page, pageSize },
  })
  return res.data.data
}