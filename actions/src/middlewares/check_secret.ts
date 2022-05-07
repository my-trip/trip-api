import Middleware from './types/middleware'

const checkSecret: Middleware = (req, res, next) => {
    if (req.get('Authorization') !== process.env.ACTION_SECRET) {
        res.status(401).send({
            code: 401,
            message: 'Unauthorized request. Missing action secret.',
        })
    } else {
        next()
    }
}

export { checkSecret }