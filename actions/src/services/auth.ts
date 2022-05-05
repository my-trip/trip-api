
  
import { HasuraService } from './'
import {
  USER_BY_USERNAME,
  NOT_REVOKED_TOKEN,
  COMPLETE_USER_BY_ID,
  USER_BY_ID_AND_PASSWORD,
  USER_TO_RECOVER_PASSWORD,
} from '../graphql/queries'
import {
  INSERT_TOKEN,
  REVOKE_TOKEN,
  UPDATE_USER_PASSWORD,
  SEND_EMAIL,
} from '../graphql/mutations'
import { pickBy } from 'lodash'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import pem2jwk from 'pem2jwk'
import jwkToPem from 'jwk-to-pem'
import encryptorCreator from 'simple-encryptor'

const { JWT_PRIVATE_KEY, JWT_EXPIRE, JWT_KEY_ID } = process.env

const encryptor = encryptorCreator(Object.assign({ key: process.env.APP_KEY }))

const privateKeyBuffer = Buffer.from(JWT_PRIVATE_KEY || '', 'base64')

export interface HasuraHeaders {
  'x-hasura-allowed-roles': string[]
}

export interface TokenUserData {
  // eslint-disable-next-line camelcase
  user_id: string
  name: string
  hasura: HasuraHeaders
  admin: boolean
}

export interface DecodedToken {
  uid: number
  data: TokenUserData
  iat: number
  exp: number
}

interface User {
  id: string
  name: string
  roles: string[]
  password: string
  avatar: string
  username: string
}

interface AuthData {
  user: User
  jwtToken: string
  exp: number
  refreshToken: string
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

  public static async generateRefreshToken(user: User): Promise<string> {
    const refreshToken = uuid()

    const insertTokenResponse = await HasuraService.mutate({
      mutation: INSERT_TOKEN,
      variables: {
        user_id: user.id,
        token: refreshToken,
      },
    })

    if (insertTokenResponse.errors && insertTokenResponse.errors.length > 0) {
      throw Error('Incorrect username or password')
    }

    return encryptor.encrypt(refreshToken)
  }
  public static async generateJwtToken(user: User): Promise<string> {
    const { roles } = user

    const { data, errors } = await HasuraService.query({
      query: COMPLETE_USER_BY_ID,
      variables: {
        id: user.id,
        subscription_status: 'active',
      },
    })

    if (errors && errors.length > 0) {
      console.log(`Auth Service - Generate Jwt Token Error`)
      console.log({ errors: JSON.stringify(errors) })
      throw Error('InternalServerError')
    }

    const { user_by_pk: userData } = data

    const [customer] = userData.customers

    if (customer) {
      this.concatCustomerRoles(roles, customer.subscriptions)

      if (roles.includes('digital_reader')) roles.push('subscriber') // Legacy support
    }

    // eslint-disable-next-line camelcase
    const [reseller_user] = userData.reseller_users

    const userTokenData = {
      user_id: user.id,
      name: user.name,
      admin: roles.includes('admin'),
      hasura: pickBy({
        'x-hasura-allowed-roles': roles,
        'x-hasura-default-role': this.getDefaultRole(roles),
        'x-hasura-user-id': user.id.toString(),
        'x-hasura-customer-id': customer ? customer.id.toString() : null,
        // eslint-disable-next-line camelcase
        'x-hasura-reseller-id': reseller_user
          ? reseller_user.reseller_id
          : null,
      }),
    } as TokenUserData

    return jwt.sign({ uuid: user.id, data: userTokenData }, privateKeyBuffer, {
      algorithm: 'RS256',
      expiresIn: JWT_EXPIRE || 86400,
      keyid: JWT_KEY_ID,
    })
  }

  public static async validate(
    username: string,
    password: string
  ): Promise<User> {
    const getUserResponse = await HasuraService.query({
      query: USER_BY_USERNAME,
      variables: {
        username,
      },
    })

    if (getUserResponse.errors && getUserResponse.errors.length > 0) {
      console.log(`Auth Service - User Validate Error`)
      console.log({ errors: getUserResponse.errors })
      throw Error('InternalServerError')
    }

    const [user] = getUserResponse.data.user as User[]

    if (!user) {
      throw Error('UserNotFound')
    }

    const validatePassword = await bcrypt.compare(password, user.password)

    if (!validatePassword) throw Error('InvalidCredentials')

    return user
  }

  public static async refreshToken(token: string): Promise<AuthData> {
    const decryptedToken = encryptor.decrypt(token)

    const notRevokedResponse = await HasuraService.query({
      query: NOT_REVOKED_TOKEN,
      variables: {
        token: decryptedToken,
      },
    })

    if (notRevokedResponse.errors && notRevokedResponse.errors.length > 0) {
      console.log(`Auth Service - User Refresh Token Error`)
      console.log({ errors: notRevokedResponse.errors })
      throw new Error('InvalidRefreshToken')
    }

    if (notRevokedResponse.data.token.length === 0) {
      throw new Error('InvalidRefreshToken')
    }

    const tokenData = notRevokedResponse.data.token[0]

    const user = tokenData.user as User

    const revokeTokenResponse = await HasuraService.mutate({
      mutation: REVOKE_TOKEN,
      variables: {
        token_id: tokenData.id,
        is_revoked: true,
      },
    })

    if (revokeTokenResponse.errors && revokeTokenResponse.errors.length > 0) {
      console.log(`Auth Service - User Refresh Token Error`)
      console.log({ errors: revokeTokenResponse.errors })
      throw new Error('InternalServerError')
    }

    if (!revokeTokenResponse.data.update_token_by_pk) {
      console.log(`Auth Service - User Refresh Token Error`)
      throw new Error('InternalServerError')
    }

    const jwtToken = await this.generateJwtToken(user)

    const jwtDecodedToken = jwt.decode(jwtToken, { complete: true })

    return {
      user,
      jwtToken,
      exp: jwtDecodedToken ? jwtDecodedToken.payload.exp : null,
      refreshToken: await this.generateRefreshToken(user),
    }
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
      refreshToken: await this.generateRefreshToken(user),
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

  public static async changePassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean } | void> {
    try {
      const buffer = Buffer.from(token, 'base64').toString('ascii')
      if (buffer == null) throw Error('InvalidToken')

      const decrypted = encryptor.decrypt(buffer)
      const [id, password] = decrypted.split(' ')

      const queryResult = await HasuraService.query({
        query: USER_BY_ID_AND_PASSWORD,
        variables: {
          id: parseInt(id),
          password: password,
        },
      })

      const method = 'AuthService.changePassword'
      if (queryResult.error)
        console.log(method, 'query error', queryResult.error.message)
      if (queryResult.errors)
        console.log(method, 'query error', queryResult.errors[0].message)

      const user = queryResult.data.user[0]

      if (!user) throw Error('InvalidToken')

      const mutationResult = await HasuraService.mutate({
        mutation: UPDATE_USER_PASSWORD,
        variables: {
          id: parseInt(id),
          newPassword: AuthService.encryptPassword(newPassword),
        },
      })

      if (mutationResult.errors)
        console.log(method, 'mutation error', mutationResult.errors[0].message)

      return { success: true }
    } catch (error) {
      throw Error(error.message)
    }
  }

  public static async recoveryPassword(
    documentValue: string,
    subscriberCode: string,
    username: string,
    sendEmail = true
  ): Promise<{ active: boolean; sentEmail: boolean; url: string }> {
    const response = await HasuraService.query({
      query: USER_TO_RECOVER_PASSWORD,
      variables: {
        document: documentValue,
        subscriber_code: subscriberCode,
        username: username,
      },
    })

    if (response.data.user.length === 0) throw Error('UserNotFound')
    if (response.data.user.length > 1) throw Error('MultipleUsers')

    // `active` is a TribunaOnlinePaywall legacy attribute that was a customer's subscription status
    // now, it is allways true
    const active = true

    const user = response.data.user[0]

    const { id, username: _username, password, email } = user

    const encrypted = encryptor.encrypt(`${id} ${password}`)
    const token = Buffer.from(encrypted).toString('base64')

    const url = `${process.env.TRIBUNA_DIGITAL_URL}/new-password/${token}`

    if (user.email == null) return { active, sentEmail: false, url }

    if (sendEmail) {
      await HasuraService.mutate({
        mutation: SEND_EMAIL,
        variables: {
          user_id: id,
          subject: 'Recuperação de senha',
          data: {
            url,
            username: _username,
          },
          from: process.env.EMAIL_SENDER,
          to: email,
          template_name: 'PasswordRecovery',
          text: '',
        },
      })
    }

    return { active, sentEmail: sendEmail, url }
  }
}