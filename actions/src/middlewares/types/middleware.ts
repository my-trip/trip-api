
  
import { Request, Response, NextFunction } from 'express'

type Middleware = (req: Request, res: Response, next: NextFunction) => any

export default Middleware