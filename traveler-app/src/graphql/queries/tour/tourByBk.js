import { gql } from '@apollo/client/core'

export const TOUR_BY_PK = gql`
  query tour($id:  uuid!) {
    tour: tour_by_pk(id: $id) {
      name
      status
      boarding_date
      destiny {
        id
        country {
          id
          name_pt
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
    }
  }
`
