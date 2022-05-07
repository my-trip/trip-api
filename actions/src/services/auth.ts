

import { HasuraService } from './'

import { pickBy } from 'lodash'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pem2jwk from 'pem2jwk'
import jwkToPem from 'jwk-to-pem'

import { User as UserModel } from '../models/user'

const { JWT_PRIVATE_KEY, JWT_EXPIRE, JWT_KEY_ID } = process.env

import { USER_BY_EMAIL } from '../remotes/hasura/graphql/queries'


const privateKeyBuffer = Buffer.from(JWT_PRIVATE_KEY || '', 'base64')

export interface TokenUserData {
  // eslint-disable-next-line camelcase
  user_id: string
  name: string
  admin: boolean
}

export interface DecodedToken {
  uid: number
  data: TokenUserData
  iat: number
  exp: number
}

interface AuthData {
  user: UserModel
  jwtToken: string
  exp: number
}

interface JWK {
  kid: string
}

export class AuthService {
  private static passwordHashSaltRounds =
    process.env.PASSWORD_HASH_SALT_ROUNDS || 10

  public static jwks = {
    keys: [
      {
        ...pem2jwk(Buffer.from(process.env.JWT_PUBLIC_KEY || '', 'base64')),
        kid: JWT_KEY_ID,
        use: 'sig',
      },
    ],
  }

  public static encryptPassword(password: string): string {
    return bcrypt.hashSync(password, this.passwordHashSaltRounds)
  }

  public static async generateJwtToken(user: UserModel): Promise<string> {
    const { id, role } = user

    const userTokenData = {
      user_id: id,
      hasura: pickBy({
        'x-hasura-allowed-roles': [role],
        'x-hasura-default-role': role,
        'x-hasura-user-id': user.id?.toString(),
        // eslint-disable-next-line camelcase
      }),
    }

    return jwt.sign({ uuid: user.id, data: userTokenData }, privateKeyBuffer, {
      algorithm: 'RS256',
      expiresIn: JWT_EXPIRE || 86400,
      keyid: JWT_KEY_ID,
    })
  }

  public static async validate(
    username: string,
    password: string
  ): Promise<UserModel> {
    const getUserResponse = await HasuraService.query({
      query: USER_BY_EMAIL,
      variables: {
        username,
      },
    })

    if (getUserResponse.errors && getUserResponse.errors.length > 0) {
      console.log(`Auth Service - User Validate Error`)
      console.log({ errors: getUserResponse.errors })
      throw Error('InternalServerError')
    }

    const [user] = getUserResponse.data.user as UserModel[]

    if (!user) {
      throw Error('UserNotFound')
    }

    const validatePassword = await bcrypt.compare(password, user.password)

    if (!validatePassword) throw Error('InvalidCredentials')

    return user
  }

  public static async login(
    username: string,
    password: string
  ): Promise<AuthData> {
    const user = await this.validate(username, password)
    const jwtToken = await this.generateJwtToken(user)

    const jwtDecodedToken = jwt.decode(jwtToken, { complete: true })

    if (username === password) {
      console.log(`PasswordNotSafe - Username and password is equals: username -> ${username}`)
      throw new Error('PasswordNotSafe')
    }

    return {
      user,
      jwtToken,
      exp: jwtDecodedToken ? jwtDecodedToken.payload.exp : null,
    }
  }

  private static getJWK(kid: string): JWK | undefined {
    return this.jwks.keys.filter((jwk) => kid === jwk.kid).pop()
  }

  public static async validateJWT(token: string): Promise<DecodedToken> {
    const jwtDecodedToken = jwt.decode(token, { complete: true })

    if (jwtDecodedToken) {
      const { header } = jwtDecodedToken

      return new Promise((resolve, reject) => {
        const jwk = header.kid ? this.getJWK(header.kid) : null
        if (jwk) {
          jwt.verify(
            token,
            jwkToPem(jwk),
            { algorithms: [header.alg] },
            (err, decodedToken) => {
              if (err) reject(err)
              else if (!decodedToken) reject(Error('UndefinedDecodedToken'))
              else resolve(decodedToken as DecodedToken)
            }
          )
        } else {
          reject(Error('CouldNotFindJWK'))
        }
      })
    } else {
      throw Error('CouldNotFindJWK')
    }
  }

}