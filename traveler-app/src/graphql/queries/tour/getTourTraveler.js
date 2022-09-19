
import { gql } from '@apollo/client/core'

export const GET_TOUR = gql`
  query tour($where:  tour_bool_exp) {
    tour(where: $where
    ){
      id
      name
      destiny {
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
      packages {
        allowed_people
        price
      }
    }
  }
  
`


