<template>
  <v-container fluid class="pa-0">
    <!-- Header Section -->
    <PageHeader
      title="ข้อมูลลูกค้า"
      subtitle="จัดการข้อมูลและประวัติการใช้บริการ"
      icon="mdi-account-circle"
    />

    <v-container class="mt-n6">
      <div v-if="user">
        <!-- Customer Information Section -->
        <div class="customer-section mb-3">
          <div class="section-header">
            <v-icon size="18" color="white" class="mr-2">mdi-account</v-icon>
            <h2 class="text-subtitle-1 font-weight-bold text-white">
              ข้อมูลผู้ใช้
            </h2>
          </div>

          <v-card class="customer-content" elevation="4">
            <v-card-text class="pa-2">
              <v-row>
                <v-col cols="12" lg="9">
                  <v-row dense>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">ชื่อ-สกุล</div>
                      <div class="info-value">{{ user.fullname }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">ชื่อเล่น</div>
                      <div class="info-value">{{ user.nickname }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">Facebook</div>
                      <div class="info-value">{{ user.facebook }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">Line</div>
                      <div class="info-value">{{ user.line }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">ที่อยู่</div>
                      <div class="info-value">{{ user.address }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">เบอร์โทร</div>
                      <div class="info-value">{{ user.tel }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">วันเกิด</div>
                      <div class="info-value">{{ user.birthday }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" class="info-item py-1">
                      <div class="info-label">วันที่ลงทะเบียน</div>
                      <div class="info-value">
                        {{ formatDate(user.created_at) }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col
                  cols="12"
                  lg="3"
                  class="d-flex justify-center align-center"
                >
                  <div class="customer-avatar">
                    <v-icon size="48" color="grey-lighten-1"
                      >mdi-account-circle</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Service History Section -->
        <div class="history-section mb-4">
          <div class="section-header">
            <v-icon size="20" color="white" class="mr-2">mdi-history</v-icon>
            <h2 class="text-h6 font-weight-bold text-white">
              ประวัติการใช้บริการ
            </h2>
            <v-spacer></v-spacer>
            <v-chip color="white" variant="tonal" size="small">
              {{ orders.length }} รายการ
            </v-chip>
          </div>

          <v-card class="history-content" elevation="8">
            <v-card-text class="pa-6">
              <div v-if="orders.length">
                <v-expansion-panels
                  v-model="expandedOrders"
                  multiple
                  class="mb-4"
                >
                  <v-expansion-panel
                    v-for="(order, index) in orders"
                    :key="order.id"
                    class="order-expansion-panel mb-3"
                    elevation="2"
                  >
                    <v-expansion-panel-title class="pa-4">
                      <v-row no-gutters align="center">
                        <v-col cols="2" md="1" class="d-flex justify-center">
                          <div class="order-number">{{ index + 1 }}</div>
                        </v-col>
                        <v-col cols="6" md="4" v-if="order.uploads?.[0]?.url">
                          <v-img
                            :src="order.uploads[0].url"
                            width="60"
                            height="60"
                            cover
                            class="rounded-lg elevation-3 service-thumbnail"
                          />
                        </v-col>
                        <v-col cols="6" md="4" v-else>
                          <div class="no-image-placeholder">
                            <v-icon color="grey-lighten-1" size="40"
                              >mdi-image-off</v-icon
                            >
                          </div>
                        </v-col>
                        <v-col cols="12" md="6" class="pl-4">
                          <div class="service-summary">
                            <h4 class="text-subtitle-1 font-weight-bold mb-1">
                              {{
                                order.items[0]?.product?.name || "ไม่ระบุบริการ"
                              }}
                            </h4>
                            <div class="d-flex align-center gap-2 mb-1">
                              <v-chip
                                :color="getStatusChipColor(order.status)"
                                size="x-small"
                                variant="tonal"
                              >
                                {{ order.status }}
                              </v-chip>
                              <span class="text-body-2 text-grey-darken-1">
                                {{ formatDate(order.created_at) }}
                              </span>
                            </div>
                            <div class="text-h6 font-weight-bold text-primary">
                              ฿{{ order.total_amount }}
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="1" class="d-flex justify-end align-center">
                          <span class="text-caption text-grey-darken-1 me-2">
                            #{{ order.id }}
                          </span>
                          <v-btn
                            icon
                            variant="text"
                            color="error"
                            @click.stop="openConfirmDialog(order.id)"
                            density="compact"
                          >
                            <v-icon>mdi-trash-can-outline</v-icon>
                          </v-btn>
                        </v-col>

                        <!-- Dialog ยืนยันการลบ -->
                        <v-dialog
                          v-model="confirmDialog"
                          max-width="700"
                          rounded="xl"
                        >
                          <v-card rounded="xl" class="pa-3">
                            <v-card-title class="text-h6"
                              >ยืนยันการลบข้อมูล</v-card-title
                            >
                            <v-card-text
                              >คุณยืนยันว่าต้องการลบออร์เดอร์นี้ใช่หรือไม่?</v-card-text
                            >
                            <v-card-actions>
                              <v-spacer />
                              <v-btn
                                variant="elevated"
                                color="primary"
                                @click="confirmDialog = false"
                                >ยกเลิก</v-btn
                              >
                              <v-btn
                                color="error"
                                variant="elevated"
                                @click="confirmDelete"
                                >ตกลง</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-row>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pa-4 bg-grey-lighten-5">
                      <v-row>
                        <v-col cols="12" md="8">
                          <div class="service-details-expanded">
                            <div class="detail-row-expanded">
                              <v-icon size="18" color="primary" class="mr-2"
                                >mdi-medical-bag</v-icon
                              >
                              <div>
                                <div class="detail-label-expanded">
                                  รูปแบบการให้บริการ
                                </div>
                                <div class="detail-value-expanded">
                                  {{ order.items[0]?.product?.name || "-" }}
                                </div>
                              </div>
                            </div>

                            <div class="detail-row-expanded">
                              <v-icon size="18" color="orange" class="mr-2"
                                >mdi-alert-circle</v-icon
                              >
                              <div>
                                <div class="detail-label-expanded">
                                  โรคประจำตัว/หมายเหตุ
                                </div>
                                <div class="detail-value-expanded">
                                  {{ order.notes || "-" }}
                                </div>
                              </div>
                            </div>

                            <div class="detail-row-expanded">
                              <v-icon size="18" color="success" class="mr-2"
                                >mdi-account-tie</v-icon
                              >
                              <div>
                                <div class="detail-label-expanded">
                                  ผู้ให้บริการ
                                </div>
                                <div class="detail-value-expanded">
                                  {{ order.employee?.fullname || "-" }}
                                </div>
                              </div>
                            </div>

                            <div class="detail-row-expanded">
                              <v-icon size="18" color="info" class="mr-2"
                                >mdi-calendar-clock</v-icon
                              >
                              <div>
                                <div class="detail-label-expanded">
                                  วันที่และเวลา
                                </div>
                                <div class="detail-value-expanded">
                                  {{ formatDate(order.created_at) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="12" md="4" v-if="order.uploads?.[0]?.url">
                          <div class="text-center">
                            <v-img
                              :src="order.uploads[0].url"
                              max-width="250"
                              max-height="250"
                              cover
                              class="mx-auto rounded-xl elevation-4 featured-image"
                            />
                            <v-btn
                              size="small"
                              variant="tonal"
                              prepend-icon="mdi-magnify"
                              class="mt-3"
                              @click="viewFullImage(order.uploads[0].url)"
                            >
                              ดูรูปขนาดใหญ่
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
{{ totalItems }}
                <PaginationToolbar
                  v-model="page"
                  :total-items="totalItems"
                  :page-size="pageSize"
                  @change="fetchOrdersByCustomer(customerId)"
                />
              </div>

              <div v-else class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2" class="mb-4"
                  >mdi-package-variant</v-icon
                >
                <h3 class="text-h6 text-grey-darken-1 mb-2">
                  ยังไม่มีประวัติการใช้บริการ
                </h3>
                <p class="text-body-2 text-grey-darken-1">
                  เริ่มต้นเพิ่มบริการแรกของลูกค้าท่านนี้
                </p>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Add Service Button -->
        <div class="text-center mb-4">
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="showForm = true"
            class="add-service-btn"
            elevation="4"
          >
            เพิ่มบริการใหม่
          </v-btn>
        </div>

        <div v-if="showForm" class="form-section">
          <div class="section-header">
            <v-icon size="20" color="white" class="mr-2">mdi-plus-box</v-icon>
            <h2 class="text-h6 font-weight-bold text-white">
              เพิ่มรายละเอียดการบริการ
            </h2>
            <v-spacer></v-spacer>
            <v-btn icon variant="text" @click="cancelForm" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <v-card class="form-content" elevation="8">
            <v-card-text class="pa-6">
              <v-form ref="serviceForm">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.serviceType"
                      :items="productOptions"
                      item-title="title"
                      item-value="value"
                      label="รูปแบบการให้บริการ *"
                      variant="outlined"
                      prepend-inner-icon="mdi-medical-bag"
                      :rules="[rules.required]"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="formData.employee"
                      :items="employeeOptions"
                      item-title="title"
                      item-value="value"
                      label="ชื่อผู้ให้บริการ *"
                      variant="outlined"
                      prepend-inner-icon="mdi-account-tie"
                      :rules="[rules.required]"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.condition"
                      label="โรคประจำตัว / หมายเหตุ"
                      variant="outlined"
                      prepend-inner-icon="mdi-alert-circle"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.price"
                      label="ราคา *"
                      type="number"
                      variant="outlined"
                      prepend-inner-icon="mdi-currency-usd"
                      suffix="บาท"
                      :rules="[rules.required, rules.positiveNumber]"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="formData.datetime"
                      label="วันที่ - เวลา *"
                      type="datetime-local"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar-clock"
                      :rules="[rules.required]"
                      class="mb-4"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="formData.image"
                      label="เพิ่มรูปภาพ"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                      variant="outlined"
                      show-size
                      accept="image/*"
                      class="mb-4"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                variant="elevated"
                @click="cancelForm"
                class="mr-4"
              >
                ยกเลิก
              </v-btn>
              <v-btn
                color="primary"
                variant="elevated"
                prepend-icon="mdi-content-save"
                @click="submitForm"
                :loading="loading"
              >
                บันทึกข้อมูล
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <v-icon size="80" color="error" class="mb-4">mdi-account-alert</v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">ไม่พบข้อมูลผู้ใช้</h2>
        <p class="text-body-1 text-grey-darken-1">
          กรุณาตรวจสอบรหัสลูกค้าและลองใหม่อีกครั้ง
        </p>
      </div>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
  searchOrders,
  createOrder,
  uploadOrderImage,
  updateOrderStatus,
} from "@/services/orderService";
import { searchEmployees } from "@/services/employeeService";
import { searchProducts } from "@/services/productService";
import { showSuccess, showErr } from "@/lib/snackbar.js";
import PageHeader from "@/components/PageHeader.vue";
import PaginationToolbar from "@/components/table/PaginationToolbar.vue";

const route = useRoute();
const user = ref(null);
const orders = ref([]);
const showForm = ref(false);
const loading = ref(false);
const expandedOrders = ref([]);
const confirmDialog = ref(false);
const orderToDeleteId = ref(null);
const employeeOptions = ref([]);
const productOptions = ref([]);

// ✅ Pagination State
const page = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);

// ✅ customerId needs to be a ref
const customerId = ref(null); // Declare customerId as a ref

// ✅ Add ref for v-form
const serviceForm = ref(null);

// ✅ Validation Rules
const rules = {
  required: (value) => !!value || "จำเป็นต้องกรอกข้อมูลนี้",
  positiveNumber: (value) => value > 0 || "ราคาต้องมากกว่า 0",
};

const formData = ref({
  serviceType: "",
  condition: "",
  employee: "",
  price: "",
  datetime: "",
  image: null,
});

// ✅ แก้ไข watch block ให้เรียกใช้ fetchOrdersByCustomer และตรวจสอบ customerId.value
watch([page, customerId], async () => {
  if (customerId.value) {
    // ตรวจสอบให้แน่ใจว่า customerId มีค่าแล้ว
    await fetchOrdersByCustomer(customerId.value);
  }
});

function openConfirmDialog(orderId) {
  orderToDeleteId.value = orderId;
  confirmDialog.value = true;
}
// ✅ สร้าง function ใหม่สำหรับ fetch data เพื่อให้ watch เรียกใช้ได้ง่ายขึ้น
async function fetchOrdersByCustomer(id) {
  try {
    const res = await searchOrders(
      { customerId: id, status:'completed' },
      page.value,
      pageSize.value
    );
    orders.value = res.items || [];
    totalItems.value = res.pagination?.totalItems || res.items.length || 0;
    // ตั้งค่า user เฉพาะเมื่อ orders มีข้อมูลและ user ยังไม่มีค่า
    if (!user.value && orders.value.length > 0) {
      user.value = orders.value[0]?.customer || null;
    }
  } catch (err) {
    console.error("❌ ไม่สามารถโหลดประวัติบริการของลูกค้า:", err);
    // หากเกิดข้อผิดพลาด ให้ตั้งค่า user เป็น null และ orders เป็น array ว่าง
    if (!user.value) {
      // ตรวจสอบว่า user ยังไม่ถูกตั้งค่า หากมีข้อมูลในออเดอร์ก่อนหน้าแล้ว user จะไม่ถูกเปลี่ยนเป็น null
      user.value = null;
    }
    orders.value = [];
    totalItems.value = 0;
  }
}

onMounted(async () => {
  customerId.value = route.params.id; // Correct way to assign value to a ref

  if (customerId.value) {
    await fetchOrdersByCustomer(customerId.value);
  }

  // Load employee data
  try {
    const res = await searchEmployees({}, 1, 100);
    employeeOptions.value = res.items.map((emp) => ({
      title: emp.fullname,
      value: emp.id,
    }));
  } catch (err) {
    console.error("❌ โหลดพนักงานไม่สำเร็จ:", err);
  }

  // Load product data
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

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? "ไม่พบวันที่"
    : d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function cancelForm() {
  showForm.value = false;
  formData.value = {
    serviceType: "",
    condition: "",
    employee: "",
    price: "",
    datetime: "",
    image: null,
  };
  // ✅ Reset validation state when form is cancelled
  if (serviceForm.value) {
    serviceForm.value.resetValidation();
  }
}

function getStatusChipColor(status) {
  const statusColors = {
    รอดำเนินการ: "warning",
    กำลังดำเนินการ: "info",
    เสร็จสิ้น: "success",
    ยกเลิก: "error",
  };
  return statusColors[status] || "grey";
}

function viewFullImage(imageUrl) {
  // เปิดรูปภาพในหน้าต่างใหม่
  window.open(imageUrl, "_blank");
}

// async function cancelOrder(orderId) {
//   try {
//     await updateOrderStatus(orderId, "cancelled");
//     showSuccess("ลบข้อมูลสำเร็จ");

//     if (customerId.value) {
//       await fetchOrdersByCustomer(customerId.value);
//     }
//   } catch (err) {
//     showErr("ลบข้อมูลล้มเหลว");
//     console.error("❌ Cancel Order Failed:", err);
//   }
// }

async function confirmDelete() {
  if (!orderToDeleteId.value) return;

  try {
    await updateOrderStatus(orderToDeleteId.value, "cancelled");
    confirmDialog.value = false;
    showSuccess("ลบข้อมูลสำเร็จ");
    if (customerId.value) {
      await fetchOrdersByCustomer(customerId.value);
    }
  } catch (err) {
    console.error("❌ ล้มเหลวในการยกเลิก:", err);
    showErr("ลบข้อมูลล้มเหลว");
  } finally {
    orderToDeleteId.value = null;
  }
}

async function submitForm() {
  // ✅ Validate the form before proceeding
  const { valid } = await serviceForm.value.validate();
  if (!valid) {
    // alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและถูกต้อง");
    return;
  }

  loading.value = true;
  try {
    const customerIdVal = customerId.value; // ใช้ customerId.value ที่เป็น ref

    const rawDate = formData.value.datetime;
    if (!rawDate || isNaN(new Date(rawDate).getTime())) {
      alert("⏰ กรุณาระบุวันที่และเวลาให้ถูกต้อง");
      loading.value = false;
      return;
    }

    const payload = {
      customerId: customerIdVal,
      employeeId: formData.value.employee,
      items: [
        {
          productId: formData.value.serviceType,
          quantity: 1,
        },
      ],
      notes: formData.value.condition || "",
      price: Number(formData.value.price),
      date: new Date(rawDate).toISOString(),
    };

    const response = await createOrder(payload);
    console.log("Order created:", response.id);
    const orderId = response?.id;

    if (orderId) {
      // 📤 Upload image ถ้ามี
      if (formData.value.image) {
        await uploadOrderImage(orderId, formData.value.image);
      }

      // alert("บันทึกข้อมูลเรียบร้อยแล้ว ✅");
      showSuccess("บันทึกข้อมูลและรูปภาพสำเร็จ");

      cancelForm();
      await fetchOrdersByCustomer(customerIdVal);
    } else {
      // alert("บันทึกไม่สำเร็จ ❌");
      cancelForm();
      await fetchOrdersByCustomer(customerIdVal);
      showSuccess("บันทึกข้อมูลสำเร็จ");
    }
  } catch (err) {
    console.error("❌ SubmitForm Error:", err);
    // alert("เกิดข้อผิดพลาดในการบันทึก ❌");
    showErr("บันทึกข้อมูลล้มเหลว");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.customer-section,
.history-section,
.form-section {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.customer-content,
.history-content,
.form-content {
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

.info-item {
  margin-bottom: 0.25rem;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.15rem;
}

.info-value {
  font-size: 0.9rem;
  color: #111827;
  font-weight: 600;
}

.customer-avatar {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-expansion-panel {
  border-radius: 12px !important;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.order-expansion-panel .v-expansion-panel-title {
  min-height: 80px !important;
  padding: 16px !important;
}

.order-number {
  background: #d66b63;
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.service-thumbnail {
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.service-thumbnail:hover {
  border-color: #d66b63;
  transform: scale(1.05);
}

.no-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.service-summary h4 {
  line-height: 1.2;
}

.service-details-expanded {
  gap: 1rem;
  display: flex;
  flex-direction: column;
}

.detail-row-expanded {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-label-expanded {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-value-expanded {
  color: #111827;
  font-weight: 600;
  font-size: 0.95rem;
}

.featured-image {
  border: 3px solid #d66b63;
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(214, 107, 99, 0.3) !important;
}

.add-service-btn {
  border-radius: 28px;
  padding: 0 2rem;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.add-service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(214, 107, 99, 0.3) !important;
}

.rounded-lg {
  border-radius: 12px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0 3rem 0;
  }

  .card-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-label {
    min-width: auto;
    margin-bottom: 0.25rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
