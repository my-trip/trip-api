import { checkSecret, unless } from '../middlewares'
import { json, Router } from 'express'
import { AuthRouter } from './auth'
import { SignUpRouter } from './signup'
import { PurchaseRouter } from './purchase'
import { PlaceRouter } from './place'
import { TourRouter } from './tour'

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
router.use(PlaceRouter)
router.use(TourRouter)

export { router as AppRouter }