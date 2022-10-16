


import { isLogged } from './utils/auth'

const nav = isLogged() ? [
  {
    component: 'CNavItem',
    name: 'Minhas Reservas',
    to: '/login',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
  },
] : [
  {
    component: 'CNavItem',
    name: 'Login',
    to: '/login',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
  },
]

export default nav