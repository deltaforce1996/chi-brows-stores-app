import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0812345678' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0823456789' },
      { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '0834567890' },
      { id: 4, name: 'John Doe', email: 'john@example.com', phone: '0812345678' },
      { id: 5, name: 'Jane Smith', email: 'jane@example.com', phone: '0823456789' },
      { id: 6, name: 'Alice Johnson', email: 'alice@example.com', phone: '0834567890' }
    ],
    filterText: ''
  }),
  getters: {
    filteredCustomers(state) {
      return state.customers.filter(c =>
        c.name.toLowerCase().includes(state.filterText.toLowerCase())
      )
    }
  },
  actions: {
    setFilterText(text) {
      this.filterText = text
    }
  }
})
