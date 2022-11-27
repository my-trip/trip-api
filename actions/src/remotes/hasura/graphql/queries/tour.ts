import { gql } from '@apollo/client/core'

export const GET_TOUR_AVAILABLE_TOUR = gql`
  query tour(
    $start_date: timestamptz_comparison_exp
    $end_date: timestamptz_comparison_exp
    $boarding: boarding_bool_exp,
    $destiny: address_bool_exp
    $start_selling_date: timestamptz_comparison_exp
    $close_selling_date: timestamptz_comparison_exp
    $allowed_people: Int_comparison_exp
  ) {
    tour (
      where: {
        destiny: $destiny
        start_date: $start_date
        end_date: $end_date
        is_available: {
          _eq: true
        }
        boardings: $boarding
        packages: {
          is_available: {
            _eq: true
          }
          available_quantity: {
            _gt: 0
          }
          start_selling_date:  $start_selling_date
          close_selling_date: $close_selling_date
          allowed_people: $allowed_people
        }
      }
  ) {
      id
      name
      cover
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
      start_date
      boarding_date
      packages( where: {
        start_selling_date: $start_selling_date,
        close_selling_date: $close_selling_date,
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


