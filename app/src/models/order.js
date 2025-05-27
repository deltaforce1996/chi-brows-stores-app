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