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
 * @property {number} [price]
 * @property {string} [date]
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

/**
 * สร้างออร์เดอร์ใหม่
 * @param {CreateOrderPayload} payload
 * @returns {Promise<OrderResponse>}
 */
export async function createOrder(payload) {
  const res = await axios.post('/orders/register', payload)
  return res.data.data
}

export async function createOrderWithCustomer(payload) {
  const res = await axios.post('/orders/register-with-customer', payload)
  return res.data.data
}

/**
 * ดึงออร์เดอร์ตามรหัส
 * @param {string} id
 * @returns {Promise<OrderResponse>}
 */
export async function getOrderById(id) {
  const res = await axios.get(`/orders/find/${id}`)
  return res.data.data
}

/**
 * อัปเดตสถานะออร์เดอร์
 * @param {string} id
 * @param {string} status
 * @returns {Promise<OrderResponse>}
 */
export async function updateOrderStatus(id, status) {
  const res = await axios.put(`/orders/update/${id}/status`, { status })
  return res.data.data
}

/**
 * ค้นหาออร์เดอร์
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

/**
 * 📤 อัปโหลดรูปภาพแนบกับออร์เดอร์
 * @param {string} orderId - รหัสออร์เดอร์ เช่น "ORD-00001"
 * @param {File} file - ไฟล์ภาพ
 * @returns {Promise<any>}
 */
export async function uploadOrderImage(orderId, file) {
  // บาง editor อาจไม่รู้จัก FormData → ใส่ comment ช่วยให้ linting รู้จัก
  /** @type {FormData} */
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await axios.post(`/upload/order/${orderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(`📦 อัปโหลดภาพสำเร็จ: /upload/order/${orderId}`)
    return res.data
  } catch (error) {
    console.error(`❌ Upload failed for order ${orderId}:`, error)
    throw error
  }
}
