import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useLoginStore } from 'modules/login/store/login-store'
import LoginPage from 'modules/login/LoginPage.vue'
import BookingPage from 'modules/booking/BookingPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    meta: {
      anonymous: true,
    },
    component: LoginPage,
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingPage,
  },
  {
    path: '/',
    redirect: '/booking',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const store = useLoginStore()

  if (!to.meta.anonymous && !store.loggedIn) {
    return '/login'
  }
  
  else if (to.name === 'login' && store.loggedIn) {
    return '/booking'
  }
})

export default router