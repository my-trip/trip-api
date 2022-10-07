import { Package as PackageModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { PACKAGE_BY_ID } from '../remotes/hasura/graphql'
import { INSERT_PURCHASE } from '../remotes/hasura/graphql'
import { Person } from '../models/person'
interface Travelers {
  boardingId: string,
  person: Person
}
interface InsertPurchasePayload {
  personId: string
  price: number
  packageId: string
  expirationDate: string,
  travelers: Travelers[]
}
export class Purchase {
  static async create(payload: InsertPurchasePayload): Promise<PackageModel> {
    const travelers = payload.travelers.map(traveler => {
      return {
        boarding_id: traveler.boardingId,
        person: {
          data: {
            name: traveler.person.name,
            phone: traveler.person.phone,
            document: traveler.person.document,
            document_type: "CPF"
          }
        }
      }
    })

    const variables = {
      person_id: payload.personId,
      price: payload.price,
      package_id: payload.packageId,
      travelers: { data: travelers },
      status: 'solicited',
      expiration_date: payload.expirationDate
    }

    const response = await HasuraService.mutate({
      mutation: INSERT_PURCHASE,
      variables
    })

    return response.data.purchase as PackageModel
  }
}
