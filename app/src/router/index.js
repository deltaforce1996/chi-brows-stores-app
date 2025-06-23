import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import authMiddleware from '../middlewares/auth'

// Views
import CustomerInfomation from '../views/CustomerInfomation.vue'
import FillinCustomer from '../views/FillinCustomer.vue'
import PrefillCustomer from '../views/PrefillCustomer.vue'

import Login from '../views/Login.vue'
import RegisterStep1 from '../views/RegisterStep1.vue'
import RegisterStep2 from '../views/RegisterStep2.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: CustomerInfomation
      },
      {
        path: 'FillinCustomer',
        name: 'FillinCustomer',
        component: FillinCustomer
      },
            {
        path: 'PrefillCustomer/:id',
        name: 'PrefillCustomer',
        component: PrefillCustomer
      },
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'RegisterStep1',
        component: RegisterStep1
      },
      {
        path: 'register2',
        name: 'RegisterStep2',
        component: RegisterStep2
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(authMiddleware)

export default router
