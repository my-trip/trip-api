import { User as UserModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { INSERT_USER } from '../remotes/hasura/graphql'
import { AuthService, Person } from './'


interface signupProps {
    name: string
    role: string
    email: string
    document: string
    document_type: string
    password: string
    birth: string
}


export class User {
    static async create(user: UserModel): Promise<UserModel> {
        try {
            console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHH")
            const response = await HasuraService.mutate({
                mutation: INSERT_USER,
                variables: user
            })
            console.log(response)

            return response.data as UserModel
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
            console.log("AQUIIII")

            const encryptedPassword = AuthService.encryptPassword(password)

            console.log({ encryptedPassword })

            const user = await User.create({
                password: encryptedPassword,
                email,
                role
            })

            console.log({ user })

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
