
  
import Middleware from './types/middleware'

const unless = (
  path: string | string[],
  middleware: Middleware
): Middleware => (req, res, next) =>
  path.includes(req.path) ? next() : middleware(req, res, next)

export { unless }