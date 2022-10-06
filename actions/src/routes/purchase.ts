import e, { Router, Response } from 'express'
import { AuthService, User, Agency, Package as PackageService } from "../services"
import { Package as PackageModel } from "../models/package"
import jwt from 'jsonwebtoken'
import moment from 'moment'

const router = Router()


interface ValidationProps {
  travelers?: any[],
  packageData: PackageModel
}

const allowedValidation = (validationProps: ValidationProps): string | undefined => {
  if (validationProps.travelers && validationProps.travelers.length > validationProps.packageData.allowed_people) return 'Invalit travelers length'
}
const availableValidation = (validationProps: ValidationProps): string | undefined => {
  if (!validationProps.packageData.is_available) return 'Package not available'
}

const packageIsInSallesDate = (validationProps: ValidationProps): string | undefined => {
  if (!validationProps.packageData.is_available) return 'Package not available'
}

const validations = [
  allowedValidation,
  availableValidation,
  packageIsInSallesDate
]

const purchaseValidator = (travelers: any[], packageData: PackageModel): string | undefined => {
  for (const validation of validations) {
    const result = validation({ travelers, packageData })
    if (result) {
      return result
    }
  }
}

router.post('/purchase', async (req, res) => {
  const headers = req.body.session_variables

  const body = req.body.input.data
  const userId = headers['x-hasura-user-id']
  try {

    const user = await User.getByID(userId)
    const packageModel = await PackageService.getByID(body.package_id)

    const validationError = purchaseValidator(body.travelers, packageModel)

    if (validationError) {
      throw validationError
    }

    console.log({ packageModel })

    const paymentLimitDate = moment.utc().add(packageModel.payment_limit_day, 'days').toISOString()
    const price = packageModel.price

    console.log(packageModel.payment_limit_day)
    console.log(paymentLimitDate)
    console.log(price)

    res.status(200).json({
      purchase_id: "c93b8fa6-bde0-4556-9d9e-a9a87b7c72b1"
    })
  } catch (e) {
    console.log(e)
    return res.status(400).send()
  }
})

export { router as PurchaseRouter }