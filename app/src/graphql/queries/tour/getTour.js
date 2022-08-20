
import { gql } from '@apollo/client/core'

export const GET_TOUR = gql`
  query tour {
    tour{
      id
      name
      status
      destiny {
        id
        country {
          id
          name
        }
        state {
          id
          name
        }
        city {
          id
          name
        }
      }
      boarding_date
    }
  }
`


