import e, { Router, Response } from 'express'
import { AuthService, User } from "../services"
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/signup', async (req, res) => {
  const {
    name,
    document_type,
    document,
    email,
    password,
    birth,
    role
  } = req.body.input.data

  try {
    const user = await User.signup({
      name,
      document_type,
      document,
      email,
      password,
      birth,
      role
    })

    const token = await AuthService.generateJwtToken(user)
    const decodedToken = jwt.decode(token, { complete: true })

    res.status(200).json({
      token,
      id: user.id,
      exp: decodedToken ? decodedToken.payload.exp : null,
    })
    return res.status(200).send()
  } catch (e) {
    console.log(e)
    return res.status(400).send()
  }
})

export { router as SignUpRouter }