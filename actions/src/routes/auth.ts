
import { User } from "../services"

import { Router, Response } from 'express'
import { AuthService } from "../services/auth"

const router = Router()

interface AuthParams {
  email: string
  password: string
}

interface RefreshParams {
  // eslint-disable-next-line camelcase
  refresh_token: string
  refreshToken: string // Legacy support
}

function handleError(err, res: Response) {
  switch (err.message) {
    case 'MissingArguments':
      res.status(400).json({
        code: 'bad-request',
        name: 'MissingArguments',
        message:
          'É necessário informar nome de usuário, cpf/cnpj ou código de assinante.',
      })
      break
    case 'UserNotFound':
      res.status(404).json({
        code: 'not-found',
        name: 'UserNotFound',
        message: 'Usuário não encontrado.',
      })
      break
    case 'MultipleUsers':
      res.status(404).json({
        code: 'not-found',
        name: 'MultipleUsers',
        message:
          'Mais de um usuário encontrado, selecione outro método de recuperação.',
      })
      break
    case 'InvalidCredentials':
      res.status(401).json({
        code: 'unauthorized',
        name: 'InvalidCredentials',
        message: 'Usuário ou senha incorretos.',
      })
      break
    case 'InvalidRefreshToken':
      res.status(401).json({
        code: 'unauthorized',
        name: 'InvalidRefreshToken',
        message: 'RefreshToken inválido.',
      })
      break
    case 'InvalidToken':
    case 'UndefinedDecodedToken':
    case 'CouldNotFindJWK':
      res.status(401).json({
        code: 'invalid-jwt',
        name: err.message,
        message: 'Token inválido.',
      })
      break
    default:
      res.status(400).json({ message: err.message })
  }
}


router.post('/login', async (req, res) => {
  const { email, password } = req.body.input.data as AuthParams

  try {
    const { user, jwtToken } = await AuthService.login(
      email,
      password
    )
    console.log({ user })
    res.status(200).json({
      id: user.id,
      name: user.person?.name,
      agency_name: user.agency_manager?.agency?.name,
      email: user.email,
      roles: user.role,
      token: jwtToken,
    })
  } catch (e) {
    console.log(e)
    handleError(e, res)
  }
})

router.get('/.well_known/jwks.json', async (req, res) => {
  res.status(200).json(AuthService.jwks)
})

router.post('/validate_token', async (req, res) => {
  const { token } = req.body.input as { token: string }
  try {
    const decodedToken = await AuthService.validateJWT(token)
    if (decodedToken && decodedToken.data) {
      const { data } = decodedToken
      res.status(200).json({
        id: data.user_id,
        name: data.name,
        // roles: data.hasura['x-hasura-allowed-roles'],
        exp: decodedToken.exp,
      })
    }
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/me', async (req, res) => {
  console.log(">>>>>>>>>>>>>>>>")
  const headers = req.body.session_variables
  const userId = headers['x-hasura-user-id']
  console.log(">>>>>>>>>>>>")
  try {
    const user = await User.getMe(userId)

    res.status(200).json({
      me: user
    })
  } catch (e) {
    return res.status(400).send()
  }
})

export { router as AuthRouter }