import { Person as PersonModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { INSERT_PERSON } from '../remotes/hasura/graphql'

export class Person {
    static async create(person: PersonModel): Promise<PersonModel> {
        const response = await HasuraService.mutate({
            mutation: INSERT_PERSON,
            variables: person
        })

        return response.data as PersonModel
    }
}
    