import e, { Router, Response } from 'express'
import { Tour } from "../services"
import moment from 'moment'

const router = Router()

router.post('/availabled-tour', async (req, res) => {
  try {
    const body = req.body.input.input
    const now = moment.utc().toISOString()

    const where = body || {}

    const tours = await Tour.getAvailableWhere({
      ...where,
      start_selling_date: now,
      close_selling_date: now,
    })

    res.status(200).json({ tours })
  } catch (e) {
    return res.status(400).send()
  }
})

export { router as TourRouter }