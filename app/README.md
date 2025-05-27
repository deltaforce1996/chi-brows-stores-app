# 📦 Frontend Service Package (Vue 3 + Axios + JSDoc)

ชุดโค้ดนี้คือ service พร้อมใช้งานสำหรับเรียกใช้งาน API ฝั่ง backend โดยใช้ JavaScript + Axios และ JSDoc เพื่อให้ได้ autocomplete และคำอธิบาย parameter อัตโนมัติใน VS Code

---

## 📁 โครงสร้างไฟล์

```
src/
├── lib/
│   └── axiosInstance.js         // ตั้งค่า axios พร้อมแนบ Bearer Token
├── models/
│   └── *.js                     // Payload / Response model (JSDoc)
├── services/
│   └── *.js                     // Auth, Customer, Employee, Product, Order
```

---

## ⚙️ วิธีตั้งค่า

1. นำโฟลเดอร์ทั้งหมดวางไว้ในโปรเจกต์ของคุณภายใต้ `src/`

2. เพิ่มไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

3. ตรวจสอบ alias `@` ใน `vite.config.js`:

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src')
  }
}
```

---

## 🔐 ตัวอย่างใช้งาน: การเข้าสู่ระบบ

```js
import { login } from '@/services/authService'

const user = await login({ username: 'admin', password: '123456' })
console.log('เข้าสู่ระบบสำเร็จ:', user)
```

---

## 👤 ลูกค้า: ลงทะเบียน & ค้นหา

```js
import { registerCustomer, searchCustomers } from '@/services/customerService'

// ลงทะเบียน
await registerCustomer({
  fullname: 'สมชาย ใจดี',
  tel: '0812345678',
  line: 'line123',
  facebook: 'fb123',
  nickname: 'ชาย',
  address: 'กรุงเทพ',
  birthday: '1990-01-01'
})

// ค้นหา
const result = await searchCustomers('สมชาย')
console.log(result.items)
```

---

## 🧾 คำสั่งซื้อ

```js
import { createOrder } from '@/services/orderService'

await createOrder({
  customerId: 'CUST0001',
  items: [
    { productId: 'P0001', quantity: 2 }
  ],
  notes: 'จัดส่งด่วน'
})
```

---

## 📚 จุดเด่นของ JSDoc

- แสดงชื่อ prop และชนิดข้อมูลเมื่อเขียนโค้ด
- รองรับ autocomplete และคำอธิบายใน VS Code
- ไม่ต้องใช้ TypeScript ก็ได้ประสบการณ์แบบเดียวกัน

---

## ✅ พร้อมใช้งานทันที!

สามารถใช้กับ Vue 3 + Vite ได้ทันที ทั้งสำหรับ dev เดี่ยวหรือทีมงานขนาดใหญ่