<template>
  <v-container fluid class="pa-0">
    <!-- Header Section -->
    <PageHeader
      title="รายชื่อลูกค้า"
      subtitle="ค้นหาและจัดการข้อมูลลูกค้าทั้งหมด"
      icon="mdi-account-group"
    />

    <v-container class="mt-n6">
      <!-- Search Section -->
      <div class="search-section mb-4">
        <div class="section-header">
          <v-icon size="20" color="white" class="mr-2">mdi-magnify</v-icon>
          <h2 class="text-h6 font-weight-bold text-white">ค้นหาลูกค้า</h2>
        </div>

        <v-card class="search-content" elevation="8">
          <v-card-text class="pa-6">
            <v-text-field
              label="ค้นหาจากชื่อ, เบอร์, ไลน์, Facebook"
              v-model="searchText"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              :loading="loading"
              clearable
              class="mb-4"
              @keyup.enter="submitSearch"
            />

            <div class="text-right">
              <v-btn
                color="primary"
                @click="submitSearch"
                :loading="loading"
                prepend-icon="mdi-magnify"
                class="search-btn"
              >
                ค้นหา
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Results Section -->
      <div class="results-section mb-4">
        <div class="section-header">
          <v-icon size="20" color="white" class="mr-2">mdi-account-multiple</v-icon>
          <h2 class="text-h6 font-weight-bold text-white">ผลการค้นหา</h2>
          <v-spacer></v-spacer>
          <v-chip color="white" variant="tonal" size="small">
            {{ customers.length }} รายการ
          </v-chip>
        </div>

        <v-card class="results-content" elevation="8">
          <v-card-text class="pa-6">
            <div v-if="customers.length">
              <v-expansion-panels
                v-model="expandedCustomers"
                multiple
                class="mb-4"
              >
                <v-expansion-panel
                  v-for="(customer, index) in customers"
                  :key="customer.id"
                  class="customer-expansion-panel mb-3"
                  elevation="2"
                >
                  <v-expansion-panel-title class="pa-4">
                    <v-row no-gutters align="center">
                      <v-col cols="2" md="1" class="d-flex justify-center">
                        <div class="customer-number">{{ index + 1 }}</div>
                      </v-col>
                      <v-col cols="2" md="1" class="d-flex justify-center">
                        <div class="customer-avatar-small">
                          <v-icon color="grey-lighten-1" size="24"
                            >mdi-account</v-icon
                          >
                        </div>
                      </v-col>
                      <v-col cols="8" md="8" class="pl-4">
                        <div class="customer-summary">
                          <h4 class="text-subtitle-1 font-weight-bold mb-1">
                            {{ customer.fullname || "ไม่ระบุชื่อ" }}
                          </h4>
                          <div class="d-flex align-center gap-2 mb-1">
                            <v-icon size="14" color="primary">mdi-phone</v-icon>
                            <span class="text-body-2 text-grey-darken-1">
                              {{ customer.tel || "-" }}
                            </span>
                          </div>
                          <div class="d-flex align-center gap-2">
                            <v-icon size="14" color="info">mdi-facebook</v-icon>
                            <span class="text-body-2 text-grey-darken-1">
                              {{ customer.facebook || "-" }}
                            </span>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="2" class="d-flex justify-end">
                        <v-btn
                          color="primary"
                          size="small"
                          prepend-icon="mdi-eye"
                          @click.stop="viewDetails(customer)"
                          class="view-btn"
                        >
                          ดูรายละเอียด
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text class="pa-4 bg-grey-lighten-5">
                    <v-row>
                      <v-col cols="12" md="8">
                        <div class="customer-details-expanded">
                          <div class="detail-row-expanded">
                            <v-icon size="18" color="primary" class="mr-2"
                              >mdi-account</v-icon
                            >
                            <div>
                              <div class="detail-label-expanded">
                                ชื่อ-นามสกุล
                              </div>
                              <div class="detail-value-expanded">
                                {{ customer.fullname || "-" }}
                              </div>
                            </div>
                          </div>

                          <div class="detail-row-expanded">
                            <v-icon size="18" color="success" class="mr-2"
                              >mdi-phone</v-icon
                            >
                            <div>
                              <div class="detail-label-expanded">
                                เบอร์โทรศัพท์
                              </div>
                              <div class="detail-value-expanded">
                                {{ customer.tel || "-" }}
                              </div>
                            </div>
                          </div>

                          <div class="detail-row-expanded">
                            <v-icon size="18" color="info" class="mr-2"
                              >mdi-facebook</v-icon
                            >
                            <div>
                              <div class="detail-label-expanded">Facebook</div>
                              <div class="detail-value-expanded">
                                {{ customer.facebook || "-" }}
                              </div>
                            </div>
                          </div>

                          <div class="detail-row-expanded" v-if="customer.line">
                            <v-icon size="18" color="success" class="mr-2"
                              >mdi-message-text</v-icon
                            >
                            <div>
                              <div class="detail-label-expanded">Line ID</div>
                              <div class="detail-value-expanded">
                                {{ customer.line }}
                              </div>
                            </div>
                          </div>

                          <div
                            class="detail-row-expanded"
                            v-if="customer.address"
                          >
                            <v-icon size="18" color="orange" class="mr-2"
                              >mdi-map-marker</v-icon
                            >
                            <div>
                              <div class="detail-label-expanded">ที่อยู่</div>
                              <div class="detail-value-expanded">
                                {{ customer.address }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        class="d-flex flex-column align-center"
                      >
                        <div class="customer-avatar-large mb-4">
                          <v-icon size="60" color="grey-lighten-1"
                            >mdi-account-circle</v-icon
                          >
                        </div>
                        <v-btn
                          color="primary"
                          prepend-icon="mdi-eye-outline"
                          @click="viewDetails(customer)"
                          class="view-details-btn"
                        >
                          ดูข้อมูลเต็ม
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <PaginationToolbar
                v-model="page"
                :total-items="totalItems"
                :page-size="pageSize"
                @change="fetchCustomers(searchText)"
              />
            </div>

            <div v-else class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2" class="mb-4"
                >mdi-account-search</v-icon
              >
              <h3 class="text-h6 text-grey-darken-1 mb-2">ไม่พบข้อมูลลูกค้า</h3>
              <p class="text-body-2 text-grey-darken-1">
                ลองค้นหาด้วยคำอื่น หรือเพิ่มลูกค้าใหม่
              </p>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { searchCustomers } from "@/services/customerService";
import PageHeader from "@/components/PageHeader.vue";
import PaginationToolbar from "@/components/table/PaginationToolbar.vue";

const router = useRouter();

// ✅ State หลัก
const searchText = ref("");
const customers = ref([]);
const expandedCustomers = ref([]);
const loading = ref(false);

// ✅ Pagination State
const page = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);

// ✅ โหลดข้อมูลลูกค้าพร้อม Pagination
async function fetchCustomers(query = "") {
  loading.value = true;
  try {
    const res = await searchCustomers(query, page.value, pageSize.value);
    customers.value = res.items;
    totalItems.value = res.pagination?.totalItems || res.items.length || 0; // ✅ ใช้ค่าจาก pagination
  } catch (err) {
    console.error("❌ โหลดข้อมูลลูกค้าไม่สำเร็จ:", err);
    customers.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
}

// ✅ เรียกเมื่อกดปุ่มค้นหา หรือ Enter
function submitSearch() {
  page.value = 1; // รีเซ็ตกลับหน้า 1 เมื่อค้นหาใหม่
  fetchCustomers(searchText.value);
}

// ✅ ไปหน้ารายละเอียดลูกค้า
function viewDetails(customer) {
  router.push(`/PrefillCustomer/${customer.id}`);
}

watch(page, () => {
  fetchCustomers(searchText.value)
})

// ✅ โหลดข้อมูลครั้งแรก
onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped>


.search-section,
.results-section {
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.search-content,
.results-content {
  border-radius: 0 0 16px 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-top: none;
}

.section-header {
  background: #d66b63;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

.search-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  padding: 0 2rem;
}

.customer-expansion-panel {
  border-radius: 12px !important;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.customer-expansion-panel .v-expansion-panel-title {
  min-height: 80px !important;
  padding: 16px !important;
}

.customer-number {
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

.customer-avatar-small {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-avatar-large {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-summary h4 {
  line-height: 1.2;
}

.customer-details-expanded {
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

.view-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
}

.view-details-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
  padding: 0 2rem;
}

.view-btn:hover,
.view-details-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(214, 107, 99, 0.3) !important;
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

  .section-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .customer-expansion-panel .v-expansion-panel-title {
    min-height: auto !important;
  }

  .view-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
