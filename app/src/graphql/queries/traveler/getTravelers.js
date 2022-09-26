
import { gql } from '@apollo/client/core'

export const GET_TRAVELER = gql`
  query traveler($tourId:  uuid) {
    traveler(where: { package_access: { purchase: { status: { _eq: "confirmated" }} package: {tour_id: { _eq: $tourId } } }}) {
      id
      person {
        name
        document
    		phone   
      }
      boarding {
        id
        name
      }
      package_access {
        purchase {
          id
        }
        travelers   {
        	id
        	person {
						id
            name
            document
            phone
          }
        }
        package {
          name
          package_items {
            item {
              name
              description
            }
          }
        }
      }
    }
  }
`

