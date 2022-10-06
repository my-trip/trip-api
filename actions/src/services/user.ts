import { User as UserModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { INSERT_USER, USER_BY_ID } from '../remotes/hasura/graphql'
import { AuthService, Person } from './'


interface signupProps {
	name: string
	role: string
	email: string
	document: string
	document_type: string
	password: string
	birth?: string
}


export class User {
	static async create(user: UserModel): Promise<UserModel> {
		try {
			const response = await HasuraService.mutate({
				mutation: INSERT_USER,
				variables: user
			})

			return response.data.insert_user_one as UserModel
		} catch (e) {
			console.log(e)
			throw e
		}

	}
	static async getByID(userId: number): Promise<UserModel> {
		try {
			const response = await HasuraService.query({
				query: USER_BY_ID,
				variables: {
					id: userId
				}
			})

			return response.data.user as UserModel
		} catch (e) {
			console.log(e)
			throw e
		}
	}

	static async signup({
		birth,
		document_type,
		document,
		email,
		name,
		password,
		role
	}: signupProps): Promise<UserModel> {
		try {
			const encryptedPassword = AuthService.encryptPassword(password)

			const user = await User.create({
				password: encryptedPassword,
				email,
				role
			})

			await Person.create({
				birth,
				document,
				document_type,
				name
			})

			return user
		} catch (e) {
			console.log({ e })
			throw e
		}

	}
}
