import axios from "@/lib/axiosInstance";

/**
 * @typedef {Object} CustomerPayload
 * @property {string} tel
 * @property {string} line
 * @property {string} facebook
 * @property {string} fullname
 * @property {string} nickname
 * @property {string} address
 * @property {string} birthday
 */

/**
 * @typedef {Object} CustomerResponse
 * @property {string} id
 * @property {string} tel
 * @property {string} line
 * @property {string} facebook
 * @property {string} fullname
 * @property {string} nickname
 * @property {string} address
 * @property {string} birthday
 * @property {string} created_at
 */

/** @param {CustomerPayload} payload @returns {Promise<CustomerResponse>} */
export async function registerCustomer(payload) {
  const res = await axios.post("/customer/register", payload);
  return res.data.data;
}

/** @param {string} id @returns {Promise<CustomerResponse>} */
export async function findCustomerById(id) {
  const res = await axios.get(`/customer/find/${id}`);
  return res.data.data;
}

/**
 * @param {number} [page=1]
 * @param {number} [pageSize=10]
 * @returns {Promise<{items: CustomerResponse[], pagination: Object}>}
 */
export async function searchCustomers(q, page = 1, pageSize = 10) {
  const res = await axios.get("/customer/search", {
    params: { q, page, pageSize },
  });
  return res.data.data;
}

// exmaple;
// const result = await searchCustomers("alif", 0, 1);
// const result = await searchCustomers("087625465", 0, 1);
// const result = await searchCustomers("alif_line", 0, 1);
