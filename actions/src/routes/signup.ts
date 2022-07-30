import e, { Router, Response } from 'express'
import { AuthService, User, Agency } from "../services"
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/signup', async (req, res) => {


  const {
    name,
    description,
    person: {
      name: personName,
      document,
      document_type,
    },
    user: {
      email,
      password,
    }
  } = req.body.input.data

  try {
    const agency = await Agency.create({
      name,
      description,
      document,
      email,
      password,
      personName,
      documentType: document_type,
    })
    const agencyManagers = agency.agency_managers

    const agencyManager = agencyManagers[0]
    const { user } = agencyManager

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