import { app } from './app'

const port = process.env.PORT || 80

app.listen(port, () => {
  console.log('App is listening on port ', port)
})