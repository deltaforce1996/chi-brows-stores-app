// src/db/entities/order-status.enum.ts
export enum OrderStatus {
  PENDING = 'pending', // Waiting for confirmation/payment
  PROCESSING = 'processing', // Order is being prepared
  SHIPPED = 'shipped', // Order has been shipped
  DELIVERED = 'delivered', // Order has been delivered
  COMPLETED = 'completed', // Order is fully completed (optional alternative to delivered)
  CANCELLED = 'cancelled', // Order was cancelled
  REFUNDED = 'refunded', // Order was refunded
  FAILED = 'failed', // Order failed (e.g., payment issue)
}
