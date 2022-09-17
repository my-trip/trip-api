import { isLogged } from '../../utils/auth'

export const isLoggedMidleware = (to, from) => {
    if (to.meta.requiresAuth && !isLogged()) {
        return {
            path: '/login',
            query: { redirect: to.fullPath },
        }
    }
}