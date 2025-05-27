import axios from '@/lib/axiosInstance'

/**
 * @typedef {Object} ProductPayload
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} image
 */

/**
 * @typedef {Object} ProductResponse
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} image
 * @property {string} created_at
 */

/** @param {ProductPayload} payload @returns {Promise<ProductResponse>} */
export async function registerProduct(payload) {
  const res = await axios.post('/product/register', payload)
  return res.data.data
}

/** @param {string} id @returns {Promise<ProductResponse>} */
export async function findProductById(id) {
  const res = await axios.get(`/product/find/${id}`)
  return res.data.data
}

/** @param {string} query @returns {Promise<ProductResponse[]>} */
export async function searchProducts(query) {
  const res = await axios.get('/product/search', {
    params: { q: query },
  })
  return res.data.data
}