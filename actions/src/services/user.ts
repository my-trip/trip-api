import { User as UserModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { INSERT_USER } from '../remotes/hasura/graphql'

export class User {
    static async create(user: UserModel): Promise<UserModel> {
        const { data, errors } = await HasuraService.mutate({
            mutation: INSERT_USER,
            variables: user
        })

        if (errors && errors.length) throw new Error(errors[0].message)
        return data as UserModel
    }
}
    