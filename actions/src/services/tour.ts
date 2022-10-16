import { Package as PackageModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { GET_TOUR_AVAILABLE_TOUR } from '../remotes/hasura/graphql'

interface Address {
  state_id?: number
  city_id?: number
}
interface GetAvailablePayload {
  start_date?: string
  end_date?: string
  boarding?: Address
  destiny?: Address
  start_selling_date?: string
  close_selling_date: string
  allowed_people: string
}

export class Tour {
  static async getAvailableWhere(where?: GetAvailablePayload): Promise<any> {
    const getAvailableWhereVariables = {
      start_date: {},
      end_date: {},
      start_selling_date: {},
      close_selling_date: {},
      allowed_people: {},
      boarding: {
        address: {}
      },
      destiny: {}
    } as any


    if (where?.start_date) {
      getAvailableWhereVariables.start_date = {
        _gte: where?.start_date
      }
    }

    if (where?.end_date) {
      getAvailableWhereVariables.end_date = {
        _lte: where?.end_date
      }
    }


    if (where?.start_selling_date) {
      getAvailableWhereVariables.start_selling_date = {
        _lte: where?.start_selling_date
      }
    }

    if (where?.close_selling_date) {
      getAvailableWhereVariables.close_selling_date = {
        _gte: where?.close_selling_date
      }
    }

    if (where?.allowed_people) {
      getAvailableWhereVariables.allowed_people = {
        _eq: getAvailableWhereVariables.allowed_people
      }
    }

    if (where?.boarding) {
      const boardingWhere = {
        address: {}
      } as any
      if (where.boarding.city_id) {
        boardingWhere.address.city_id = {
          _eq: where.boarding.city_id
        }
      }
      if (where?.boarding.state_id) {
        boardingWhere.address.state_id = {
          _eq: where.boarding.state_id
        }
      }
      getAvailableWhereVariables.boarding = boardingWhere
    }

    if (where?.destiny) {
      const desinyWhere = {} as any
      if (where.destiny.city_id) {
        desinyWhere.city_id = {
          _eq: where.destiny?.city_id
        }
      }
      if (where.destiny.state_id) {
        desinyWhere.state_id = {
          _eq: where.destiny?.state_id
        }
      }
      getAvailableWhereVariables.destiny = desinyWhere
    }

    const response = await HasuraService.query({
      query: GET_TOUR_AVAILABLE_TOUR,
      variables: getAvailableWhereVariables
    })

    return response.data.tour
  }
}
