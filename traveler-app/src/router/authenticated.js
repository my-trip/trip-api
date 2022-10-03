import { h, resolveComponent } from 'vue'

export default [
	{
		path: '',
		name: 'Dash',
		component: import('./Authenticated'),
		meta: { requiresAuth: true },
		redirect: '/dashboard',
		children: [
			{
				path: '/tour/list',
				name: 'TourList',
				component: () => import('@/views/pages/Test'),
			},
			{
				path: '/tour/:id',
				name: 'Tour',
				component: () => import('@/views/pages/authenticated/tour/TravelerTour'),
			},
			{
				path: '/package/:id/purchase',
				name: 'Purchase',
				component: () => import('@/views/pages/authenticated/purchase/Purchase'),
			},
		]
	}
]