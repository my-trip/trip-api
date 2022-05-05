import e, { Router, Response } from 'express'
import { AuthService, User} from '../services'

const router = Router()
const validator = require('validator')
const phone_regex = /^(\+\d{1,3}[- ]?)?\d{10,11}$/

interface CustomerData {
  name: string
  birthdate: string
  gender: string
  document: string
  document_type: string
  user_id: number
  business_name: string
  phone: string
  phone_type: string
}

interface BillingAccountData {
  name: string
  external_id: number
  user_id: number
}

router.post('/signup', async (req, res) => {
  const {
    name,
    document_type,
    email,
    password,
    birth,
    role
  } = req.body.input.data

  try {
    const encryptedPassword = AuthService.encryptPassword(password)

    const user = await User.create({
      password: encryptedPassword,
      email,
      role
    })

  } catch (e) {
  }
})

export { router as SignUpRouter }