import express from 'express'
import { AppRouter } from './routes'
import './services/settings' // initialize SettingsService singleton

const app = express()
app.use('/', AppRouter)

export { app }