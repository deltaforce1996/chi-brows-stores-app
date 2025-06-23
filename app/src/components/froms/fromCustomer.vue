<template>
  <v-row justify="center">
    <v-col cols="12" class="pa-2">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- ข้อมูลส่วนตัว -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-red font-weight-bold">ข้อมูลส่วนตัว</v-card-title>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="ชื่อ-สกุล" v-model="form.fullName" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="ชื่อเล่น" v-model="form.nickname" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Facebook" v-model="form.facebook" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="Line" v-model="form.line" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="ที่อยู่" v-model="form.address" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="เบอร์โทร" v-model="form.phone" :rules="[requiredRule]" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="วันเกิด"
                v-model="form.birthday"
                type="date"
                :rules="[requiredRule]"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- รายละเอียดการบริการ -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-red font-weight-bold">รายละเอียดการบริการ</v-card-title>
          <v-row>
            <v-col cols="12">
              <v-select
                label="รูปแบบการให้บริการ"
                :items="productOptions"
                item-title="title"
                item-value="value"
                v-model="form.serviceType"
                placeholder="กรุณาระบุคะ"
                :rules="[requiredRule]"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="โรคประจำตัว"
                v-model="form.medicalCondition"
                :rules="[requiredRule]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.price"
                label="ราคา"
                type="number"
                :rules="[requiredRule]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                label="ชื่อผู้ให้บริการ"
                :items="employeeOptions"
                item-title="title"
                item-value="value"
                v-model="form.provider"
                placeholder="กรุณาระบุคะ"
                :rules="[requiredRule]"
                variant="outlined"
                clearable
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="วันที่ - เวลา"
                v-model="form.datetime"
                type="date"
                :rules="[requiredRule]"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- อัปโหลดรูปภาพ (ไม่บังคับ) -->
<v-card class="pa-6 mb-6" outlined>
  <v-card-title class="text-red font-weight-bold">เพิ่มรูปภาพ</v-card-title>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-file-input
        v-model="form.image"
        accept="image/*"
        label="เลือกรูปภาพ"
        prepend-icon="mdi-cloud-upload"
        show-size
        clearable
        variant="outlined"
      />
    </v-col>
  </v-row>
</v-card>

        <!-- ปุ่มถัดไป -->
        <v-card-actions class="justify-center">
          <v-btn class="next-button" type="submit" variant="outlined">ถัดไป</v-btn>
        </v-card-actions>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { searchProducts } from "@/services/productService";
import { searchEmployees } from "@/services/employeeService";

// Emit to parent
const emit = defineEmits(["submit"]);

// Form data
const form = ref({
  fullName: "",
  nickname: "",
  facebook: "",
  line: "",
  address: "",
  phone: "",
  birthday: "",
  serviceType: null,
  price: "",
  medicalCondition: "",
  provider: null,
  datetime: "",
  image: null,
});

// Validation setup
const formRef = ref();
const requiredRule = (v) => !!v || "จำเป็นต้องกรอกข้อมูล";

// Options
const productOptions = ref([]);
const employeeOptions = ref([]);

onMounted(async () => {
  try {
    const res = await searchEmployees({}, 1, 100);
    employeeOptions.value = res.items.map((emp) => ({
      title: emp.fullname,
      value: emp.id,
    }));
  } catch (err) {
    console.error("❌ โหลดพนักงานไม่สำเร็จ:", err);
  }

  try {
    const res = await searchProducts("");
    productOptions.value = res.map((prod) => ({
      title: prod.name,
      value: prod.id,
    }));
  } catch (err) {
    console.error("❌ โหลดบริการไม่สำเร็จ:", err);
  }
});

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    console.warn("❌ ฟอร์มไม่ครบ");
    return;
  }

  console.log("📤 ส่งข้อมูล:", form.value);
  emit("submit", form.value);
}

// Handle file upload
// function onFileChange(e) {
//   const file = e.target.files[0];
//   if (file) {
//     form.value.image = file;
//     console.log("📸 รูปที่เลือก:", file.name);
//   }
// }
</script>

<style scoped>
.next-button {
  background-color: #d66b63;
  color: white;
  border-radius: 8px;
  min-width: 100px;
  height: 40px;
  text-transform: none;
  font-weight: bold;
  font-size: 14px;
}

.upload-area {
  border: 2px dashed red;
  border-radius: 12px;
  padding: 40px 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
  background-color: white;
}

.upload-area:hover {
  border-color: darkred;
}

.upload-label {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: black;
}
</style>
