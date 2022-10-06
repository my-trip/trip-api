import { Package as PackageModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { PACKAGE_BY_ID } from '../remotes/hasura/graphql'

export class Package {
  static async getByID(id: number): Promise<PackageModel> {
    const response = await HasuraService.mutate({
      mutation: PACKAGE_BY_ID,
      variables: {
        id
      }
    })

    return response.data.package as PackageModel
  }
}
