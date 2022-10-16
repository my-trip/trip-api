import { Package as PackageModel } from '../models'
import { HasuraService } from '../remotes/hasura'
import { PLACE } from '../remotes/hasura/graphql'

export class Place {
  static async getPlaces(name: string): Promise<any> {
    const response = await HasuraService.query({
      query: PLACE,
      variables: {
        name: `${name}%`,
      }
    })

    const { data } = response
    
    const cities = data.city.map(data => {
      return {
        type: 'city',
        id: data.id,
        place: `${data.name} (${data.state.name})`
      }
    })

    const states = data.state.map(data => {
      return {
        type: 'state',
        id: data.id,
        place: `${data.name} (Brasil)`
      }
    })

    const places = [...cities, ...states]

    return places
  }
}
