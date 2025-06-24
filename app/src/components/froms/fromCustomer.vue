<template>
  <v-container fluid class="pa-4">
    <v-form ref="formRef" @submit.prevent="submitForm">
      <!-- ข้อมูลส่วนตัว -->
      <div class="customer-section mb-4">
        <div class="section-header">
          <v-icon size="18" color="white" class="mr-2">mdi-account-circle</v-icon>
          <h2 class="text-subtitle-1 font-weight-bold text-white">ข้อมูลส่วนตัว</h2>
        </div>
        <v-card class="customer-content" elevation="4">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">ชื่อ-สกุล</label>
                    <v-text-field 
                      v-model="form.fullName" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      density="comfortable"
                      class="modern-input"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">ชื่อเล่น</label>
                    <v-text-field 
                      v-model="form.nickname" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      density="comfortable"
                      class="modern-input"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">Facebook</label>
                    <v-text-field 
                      v-model="form.facebook" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-facebook"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">Line</label>
                    <v-text-field 
                      v-model="form.line" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-chat"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="input-group">
                    <label class="input-label">ที่อยู่</label>
                    <v-textarea 
                      v-model="form.address" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      rows="3"
                      class="modern-input"
                      prepend-inner-icon="mdi-map-marker"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">เบอร์โทร</label>
                    <v-text-field 
                      v-model="form.phone" 
                      :rules="[requiredRule]" 
                      variant="outlined" 
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-phone"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">วันเกิด</label>
                    <v-text-field
                      v-model="form.birthday"
                      type="date"
                      :rules="[requiredRule]"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar"
                      class="modern-input"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- รายละเอียดการบริการ -->
        <div class="customer-section mb-4">
          <div class="section-header">
            <v-icon size="18" color="white" class="mr-2">mdi-medical-bag</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold text-white">รายละเอียดการบริการ</h2>
          </div>
          <v-card class="customer-content" elevation="4">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <div class="input-group">
                    <label class="input-label">รูปแบบการให้บริการ</label>
                    <v-select
                      :items="productOptions"
                      item-title="title"
                      item-value="value"
                      v-model="form.serviceType"
                      placeholder="กรุณาเลือกบริการ"
                      :rules="[requiredRule]"
                      variant="outlined"
                      density="comfortable"
                      clearable
                      class="modern-input"
                      prepend-inner-icon="mdi-cog"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">โรคประจำตัว</label>
                    <v-text-field
                      v-model="form.medicalCondition"
                      :rules="[requiredRule]"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-heart-pulse"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">ราคา</label>
                    <v-text-field
                      v-model="form.price"
                      type="number"
                      :rules="[requiredRule]"
                      variant="outlined"
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-currency-usd"
                      suffix="บาท"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">ชื่อผู้ให้บริการ</label>
                    <v-select
                      :items="employeeOptions"
                      item-title="title"
                      item-value="value"
                      v-model="form.provider"
                      placeholder="กรุณาเลือกผู้ให้บริการ"
                      :rules="[requiredRule]"
                      variant="outlined"
                      clearable
                      density="comfortable"
                      class="modern-input"
                      prepend-inner-icon="mdi-account-tie"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="input-group">
                    <label class="input-label">วันที่ - เวลา</label>
                    <v-text-field
                      v-model="form.datetime"
                      type="date"
                      :rules="[requiredRule]"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-calendar-clock"
                      class="modern-input"
                      hide-details="auto"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- อัปโหลดรูปภาพ -->
        <div class="customer-section mb-4">
          <div class="section-header">
            <v-icon size="18" color="white" class="mr-2">mdi-image-plus</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold text-white">เพิ่มรูปภาพ</h2>
            <v-spacer></v-spacer>
            <v-chip color="white" variant="tonal" size="small">ไม่บังคับ</v-chip>
          </div>
          <v-card class="customer-content" elevation="4">
            <v-card-text>
              <div class="upload-zone">
                <v-file-input
                  v-model="form.image"
                  accept="image/*"
                  label="เลือกรูปภาพ"
                  prepend-icon=""
                  prepend-inner-icon="mdi-cloud-upload"
                  show-size
                  clearable
                  variant="outlined"
                  density="comfortable"
                  class="modern-file-input"
                  hide-details="auto"
                />
                <div class="upload-hint">
                  <v-icon color="grey-lighten-1" size="48">mdi-image-outline</v-icon>
                  <p class="upload-text">รองรับไฟล์ JPG, PNG, GIF (ขนาดไม่เกิน 5MB)</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- ปุ่มบันทึก -->
        <div class="text-center mt-4">
          <v-btn 
            class="submit-btn" 
            type="submit" 
            size="large"
            elevation="2"
            color="primary"
          >
            <v-icon left>mdi-content-save</v-icon>
            บันทึกข้อมูล
          </v-btn>
        </div>
      </v-form>
    </v-container>
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
/* Section Styling - Matching PrefillCustomer theme */
.customer-section {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.customer-content {
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-top: none;
}

.section-header {
  background: #d66b63;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

/* Input Groups */
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* Modern Input Styling */
.modern-input :deep(.v-field) {
  border-radius: 8px;
}

.modern-input :deep(.v-field__prepend-inner) {
  color: #d66b63;
  opacity: 0.8;
}

/* Upload Zone */
.upload-zone {
  text-align: center;
  padding: 1rem;
}

.upload-hint {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: #f8f9fa;
  border: 2px dashed #e5e7eb;
}

.upload-text {
  color: #6c757d;
  font-size: 0.85rem;
  margin: 0.5rem 0 0 0;
}

.modern-file-input :deep(.v-field) {
  background: white;
  border-radius: 8px;
}

/* Submit Button */
.submit-btn {
  background-color: #d66b63;
  color: white;
  border-radius: 8px;
  min-width: 180px;
  height: 44px;
  text-transform: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
}

.submit-btn:hover {
  background-color: #c55a51;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(214, 107, 99, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .input-group {
    margin-bottom: 0.75rem;
  }
}
</style>
