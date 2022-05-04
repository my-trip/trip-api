import express from 'express'
import { AppRouter } from './routes'

const app = express()
app.use('/', AppRouter)

export { app }