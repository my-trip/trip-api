
  
import { Router, Response } from 'express'

const router = Router()

interface AuthParams {
  username: string
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

router.post('/refresh_token', async (req, res) => {
  const { refresh_token, refreshToken } = req.body.input as RefreshParams

  const token = refresh_token || refreshToken // Legacy support

  try {
    if (!token) {
      throw Error('refresh_token ou refreshToken não podem ser nulos.')
    }

    const {
      user,
      jwtToken,
      refreshToken,
      exp,
    } = await AuthService.refreshToken(token)

    res.status(200).json({
      id: user.id,
      name: user.name,
      roles: user.roles,
      refresh_token: refreshToken,
      refreshToken: refreshToken, // Legacy support
      exp,
      valid_until: exp.toString(), // Legacy support
      token: jwtToken,
      avatar: user.avatar,
    })
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body.input.data as AuthParams
  try {
    const { user, jwtToken, refreshToken, exp } = await AuthService.login(
      username,
      password
    )

    res.status(200).json({
      id: user.id,
      name: user.name,
      roles: user.roles,
      refresh_token: refreshToken,
      refreshToken: refreshToken, // Legacy support
      exp,
      valid_until: exp.toString(), // Legacy support
      token: jwtToken,
      avatar: user.avatar,
    })
  } catch (e) {
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
        roles: data.hasura['x-hasura-allowed-roles'],
        exp: decodedToken.exp,
      })
    }
  } catch (e) {
    handleError(e, res)
  }
})

export { router as AuthRouter }