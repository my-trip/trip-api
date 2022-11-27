
import { gql } from '@apollo/client/core'

export const GET_TOUR = gql`
  query tour($where:  tour_bool_exp) {
    tour( where: $where, order_by: { boarding_date: desc } ){
      id
      name
      status
      destiny {
        id
        country {
          id
          name
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
      boarding_date
      start_date
    }
  }
`


