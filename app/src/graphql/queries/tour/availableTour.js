
import { gql } from '@apollo/client/core'

export const GET_TOUR_AVAILABLE_TOUR = gql`
  query tour(
    $start_date: timestamptz
    $end_date: timestamptz
    $boarding: address_bool_exp,
    $destiny: address_bool_exp
    $start_selling_date: timestamptz
    $close_selling_date: timestamptz
    $allowed_people: Int
  ) {
    tour (
      where: {
        destiny:  $destiny
        start_date: {
          _gte: $start_date
        }
        end_date: {
          _lte: $end_date
        }
        is_available: {
          _eq: true
        }
        boardings: {
          address: $boarding
        }
        packages: {
          is_available: {
            _eq: true
          }
          available_quantity: {
            _gt: 0
          }
          start_selling_date: {
            _gte: $start_selling_date
          }
          close_selling_date: {
            _lte: $close_selling_date
          }
          allowed_people: {
            _eq: $allowed_people
          }
        }
      }
  ) {
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
      packages( where: {
        start_selling_date: {
        		_gte: $start_selling_date
        },
        close_selling_date: {
           _lte: $close_selling_date
        },
        available_quantity: {
          _gt: 0
        }
        is_available: {
          _eq: true
        }
      }) {
        allowed_people
        price
      }
    }
  }
`


