# 📦 Backend API Overview (NestJS)

API นี้จัดทำโดยใช้ NestJS พร้อมรองรับ JWT Authentication, Routing, DTO Validation และ Exception Handling ครบถ้วน

---

## 🔐 Authentication

### POST `/auth/login`

**Payload:**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response:**

```json
{
  "access_token": "JWT_TOKEN",
  "user": {
    "id": "EMP0001",
    "username": "admin",
    "fullname": "System Admin",
    ...
  }
}
```

**Status Code:** `200 OK`

---

## 👤 Customer

### POST `/customer/register`

**Payload:**

```json
{
  "fullname": "สมชาย ใจดี",
  "nickname": "ชาย",
  "facebook": "fb123",
  "line": "line123",
  "tel": "0812345678",
  "address": "กรุงเทพ",
  "birthday": "1990-01-01"
}
```

**Response:** ข้อมูลลูกค้าที่ถูกบันทึก  
**Status Code:** `201 Created`

---

### GET `/customer/find/:id`

**Response:**

```json
{
  "id": "CUST0001",
  "fullname": "...",
  ...
}
```

**Status Code:** `200 OK`

---

### GET `/customer/search?query=ชาย&page=1&pageSize=10`

**Response:** รายการลูกค้า + pagination  
**Status Code:** `200 OK`

---

## 👨‍💼 Employee

### POST `/employees/register`

เหมือนกับ customer แต่มี `username`, `email`, `password`

**Status Code:** `201 Created`

---

### GET `/employees/find/:id`

**Status Code:** `200 OK`

### GET `/employees/search?q=admin`

**Status Code:** `200 OK`

---

## 📦 Product

### POST `/product/register`

**Payload:**

```json
{
  "name": "ครีมบำรุง",
  "price": 150,
  "description": "ช่วยให้ผิวนุ่ม",
  "image": "url.jpg"
}
```

**Status Code:** `201 Created`

---

### GET `/product/search?q=ครีม`

### GET `/product/find/:id`

**Status Code:** `200 OK`

---

## 🧾 Orders

### POST `/orders/register`

**Payload:**

```json
{
  "customerId": "CUST0001",
  "employeeId": "EMP0001",
  "items": [{ "productId": "P0001", "quantity": 2 }],
  "notes": "ด่วน"
}
```

**Status Code:** `201 Created`

---

### PUT `/orders/update/:id/status`

```json
{ "status": "shipped" }
```

**Status Code:** `200 OK`

---

### GET `/orders/find/:id`

### GET `/orders/search?customerName=สมชาย`

**Status Code:** `200 OK`

---

## ✅ หมายเหตุ

- ทุก endpoint รองรับการตอบกลับในรูปแบบ:

```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

- หาก error จะได้ response:

```json
{
  "success": false,
  "message": "...",
  "timestamp": "..."
}
```

# 📘 ตัวอย่าง Response จาก Backend API (อย่างละ 1 รายการ)

ไฟล์นี้รวบรวม **ตัวอย่างข้อมูลที่ตอบกลับจากแต่ละ endpoint** แบบเจาะจงเพียง 1 รายการ เพื่อใช้ในการพัฒนา frontend หรือตรวจสอบรูปแบบข้อมูลที่ต้องรับจาก backend

---

## 🔐 POST `/auth/login`

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "EMP0001",
    "username": "admin",
    "fullname": "System Admin",
    "tel": "0000000000",
    "email": "admin@example.com",
    "birthday": "1990-01-01",
    "created_at": "2024-05-01T12:00:00Z"
  }
}
```

---

## 👤 GET `/customer/find/:id`

```json
{
  "id": "CUST0001",
  "fullname": "สมชาย ใจดี",
  "nickname": "ชาย",
  "facebook": "fb123",
  "line": "line123",
  "tel": "0812345678",
  "address": "กรุงเทพ",
  "birthday": "1990-01-01",
  "created_at": "2024-04-01T09:00:00Z"
}
```

---

## 👨‍💼 GET `/employees/find/:id`

```json
{
  "id": "EMP0002",
  "username": "jane",
  "fullname": "Jane Smith",
  "tel": "0891234567",
  "email": "jane@example.com",
  "birthday": "1992-07-10",
  "created_at": "2024-04-10T10:00:00Z"
}
```

---

## 📦 GET `/product/find/:id`

```json
{
  "id": "P0001",
  "name": "สบู่สมุนไพร",
  "price": 79.99,
  "description": "สบู่กลิ่นตะไคร้ธรรมชาติ",
  "image": "https://example.com/image.jpg",
  "created_at": "2024-03-15T08:30:00Z"
}
```

---

## 🧾 GET `/orders/find/:id`

```json
{
  "id": "ORD-00001",
  "status": "pending",
  "total_amount": 159.98,
  "notes": "จัดส่งด่วน",
  "created_at": "2024-05-01T13:00:00Z",
  "updated_at": "2024-05-01T13:00:00Z",
  "customer": {
    "id": "CUST0001",
    "fullname": "สมชาย ใจดี"
  },
  "employee": {
    "id": "EMP0001",
    "fullname": "System Admin"
  },
  "items": [
    {
      "product_id": "P0001",
      "quantity": 2,
      "price_per_unit": 79.99,
      "total_price": 159.98
    }
  ]
}
```

---

## ⚠️ หมายเหตุ

- ข้อมูลในตัวอย่างนี้จำลองจากรูปแบบของระบบจริง
- โครงสร้างทั้งหมดจะอยู่ภายใต้ `data` ของ response:

```json
{
  "success": true,
  "message": "ข้อความ",
  "data": { ... }
}
```

หากต้องการตัวอย่าง `error`, `pagination`, หรือ `list` เต็มรูปแบบ สามารถแจ้งเพิ่มเติมได้เลยครับ
