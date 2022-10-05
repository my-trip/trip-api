import { checkSecret, unless } from '../middlewares'
import { json, Router } from 'express'
import { AuthRouter } from './auth'
import { SignUpRouter } from './signup'
import { PurchaseRouter } from './purchase'

const router = Router()

router.use(json({ limit: '256mb' }))

router.use(
  unless(
    [
      '/.well_known/jwks.json',
    ],
    checkSecret
  )
)

router.use(AuthRouter)
router.use(SignUpRouter)
router.use(PurchaseRouter)

export { router as AppRouter }