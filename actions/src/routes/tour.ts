// import e, { Router, Response } from 'express'
// import { AuthService, User, Agency, Package as PackageService, Purchase } from "../services"
// import { Package as PackageModel } from "../models/package"
// import jwt from 'jsonwebtoken'
// import moment from 'moment'

// const router = Router()


// router.post('/public-tour', async (req, res) => {
//   console.log("OPA OPA")
//   const headers = req.body.session_variables
//   const body = req.body.input.data
//   const userId = headers['x-hasura-user-id']

//   try {
//     const user = await User.getByID(userId)
//     const packageModel = await PackageService.getByID(body.package_id)

//     const validationError = purchaseValidator(body.travelers, packageModel)

//     if (validationError) {
//       throw validationError
//     }

//     const paymentLimitDate = moment.utc().add(packageModel.payment_limit_day, 'days').toISOString()
//     const price = packageModel.price

//     const response = await Purchase.create({
//       expirationDate: paymentLimitDate,
//       price: price || 0,
//       packageId: body.package_id,
//       personId: user.person?.id || '',
//       travelers: body.travelers
//     })

//     console.log(response)

//     res.status(200).json({
//       purchase_id: response.id
//     })
//   } catch (e) {
//     console.log({ e })
//     return res.status(400).send()
//   }
// })

export { router as PurchaseRouter }