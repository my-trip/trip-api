import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { isLoggedMidleware } from './midleware/auth'
import authenticated from './authenticated'

const routes = [
  ...authenticated,
  {
    path: '',
    redirect: '404',
    name: 'Unauthenticated',
    component: import('./Authenticated'),
    children: [
      {
				path: '/tour/:id',
				name: 'Tour',
				component: () => import('@/views/pages/authenticated/tour/TravelerTour'),
			},
      {
				path: '/tour/list',
				name: 'TourList',
				component: () => import('@/views/pages/Test'),
			},
      {
				path: '/purchase',
				name: 'Purchase',
				component: () => import('@/views/pages/authenticated/purchase/TravelerPurchase'),
			},
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },  
})

router.beforeEach(isLoggedMidleware)

export default router
