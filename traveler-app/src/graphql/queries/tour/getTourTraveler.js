
import { gql } from '@apollo/client/core'

export const GET_TOUR = gql`
  query tour($where:  tour_bool_exp) {
    tour(where: {
      boardings: {
        address: {
          city_id: {_eq: 1},
          state_id: {_eq: 2}
        }
      }
      destiny: {
        city_id: {_eq: 1},
        state_id: {_eq: 2}
      },
      packages: {
        is_available: {
            _eq: true
        },
        close_selling_date: {
          _lte: ""
        },
        allowed_people: {
          _eq: 2
        }
      }
    }){
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


