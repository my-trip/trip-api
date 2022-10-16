import { h, resolveComponent } from 'vue'

export default [
	{
		path: '',
		name: 'Dash',
		component: import('./Authenticated'),
		meta: { requiresAuth: true },
		redirect: '/tour/list',
		children: [
			{
				path: '/package/:id/purchase',
				name: 'Purchase',
				component: () => import('@/views/pages/authenticated/purchase/Purchase'),
			},
		]
	}
]