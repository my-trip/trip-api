import e, { Router, Response } from 'express'
import { Place } from "../services"
import { Package as PackageModel } from "../models/package"
import jwt from 'jsonwebtoken'
import moment from 'moment'

const router = Router()


router.post('/place', async (req, res) => {
  try {
    const body = req.body.input.data
    const name = body.place
    const response = await Place.getPlaces(name)
    res.status(200).json(response)
  } catch (e) {
    console.log({ e })
    return res.status(400).send()
  }
})

export { router as PlaceRouter }