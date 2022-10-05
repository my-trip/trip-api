import e, { Router, Response } from 'express'
import { AuthService, User, Agency, Package as PackageService } from "../services"
import jwt from 'jsonwebtoken'
import moment from 'moment'

const router = Router()

router.post('/purchase', async (req, res) => {
  const headers = req.body.session_variables

  const body = req.body.data

  const userId = headers['x-hasura-user-id']

  try {
    const user = await User.getByID(userId)
    const packageModel = await PackageService.getByID(body.package_id)

    if (body.travelers.length > packageModel.allowed_people) {
      throw "Invalid travelers length!"
    }
  
    const paymentLimitDate = moment.utc().add(packageModel.payment_limit_day, 'days').toISOString()
    const price = packageModel.price     

    res.status(200).json({
      purchase_id: "c93b8fa6-bde0-4556-9d9e-a9a87b7c72b1"
    })
  } catch (e) {
    console.log(e)
    return res.status(400).send()
  }
})

export { router as PurchaseRouter }