import { json, Router } from 'express'

const router = Router()

router.use(json({ limit: '256mb' }))

export { router as AppRouter }